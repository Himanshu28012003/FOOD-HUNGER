import Order from '../models/Order.js';
import Menu from '../models/Menu.js';
import Restaurant from '../models/Restaurant.js';
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res, next) => {
  try {
    const {
      restaurantId,
      items,
      deliveryAddress,
      deliveryTime,
      specialInstructions,
      customerPhone,
      customerEmail,
      paymentMethod
    } = req.body;

    // Validate restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({ error: `Menu item ${item.menuItem} not found` });
      }

      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: menuItem.price,
        specialInstructions: item.specialInstructions
      });
    }

    // Calculate taxes and fees
    const tax = subtotal * 0.08; // 8% tax
    const deliveryFee = subtotal > 30 ? 0 : 5; // Free delivery over $30
    const total = subtotal + tax + deliveryFee;

    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurantId,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      paymentMethod,
      deliveryAddress,
      deliveryTime,
      specialInstructions,
      customerPhone,
      customerEmail
    });

    await order.populate('restaurant', 'name location');
    await order.populate('items.menuItem', 'name price');

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant', 'name location image')
      .populate('items.menuItem', 'name price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name location image')
      .populate('items.menuItem', 'name price image description');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('restaurant', 'name location');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this order' });
    }
    
    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    ).populate('restaurant', 'name location');
    
    res.json(updatedOrder);
  } catch (err) {
    next(err);
  }
};

export const payOrder = async (req, res, next) => {
  try {
    // Mock payment
    const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus: 'paid' }, { new: true });
    res.json({ message: 'Payment successful', order });
  } catch (err) { next(err); }
}; 