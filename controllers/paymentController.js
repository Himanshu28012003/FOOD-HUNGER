import Stripe from 'stripe';
import Order from '../models/Order.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId).populate('restaurant');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to pay for this order' });
    }
    
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Order is already paid' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        restaurantId: order.restaurant._id.toString(),
        userId: req.user.id
      }
    });

    // Update order with payment intent ID
    await Order.findByIdAndUpdate(orderId, {
      paymentIntentId: paymentIntent.id
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id
    });
  } catch (err) {
    next(err);
  }
};

export const confirmPayment = async (req, res, next) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Update order status
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: 'paid',
          status: 'confirmed',
          estimatedDeliveryTime: new Date(Date.now() + 45 * 60000) // 45 minutes from now
        },
        { new: true }
      ).populate('restaurant', 'name location');
      
      res.json({
        success: true,
        order: updatedOrder,
        message: 'Payment successful! Your order has been confirmed.'
      });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (err) {
    next(err);
  }
};

export const getPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (order.paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
      res.json({
        paymentStatus: paymentIntent.status,
        orderStatus: order.status,
        amount: paymentIntent.amount / 100
      });
    } else {
      res.json({
        paymentStatus: order.paymentStatus,
        orderStatus: order.status
      });
    }
  } catch (err) {
    next(err);
  }
};

export const refundPayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ error: 'Order is not paid' });
    }

    if (order.paymentIntentId) {
      // Create refund with Stripe
      const refund = await stripe.refunds.create({
        payment_intent: order.paymentIntentId
      });

      // Update order status
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'refunded',
        status: 'cancelled'
      });

      res.json({
        success: true,
        refundId: refund.id,
        message: 'Payment refunded successfully'
      });
    } else {
      res.status(400).json({ error: 'No payment intent found' });
    }
  } catch (err) {
    next(err);
  }
}; 