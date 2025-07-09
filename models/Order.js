import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  specialInstructions: String
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true, default: 0 },
  deliveryFee: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'digital_wallet'],
    required: true
  },
  paymentIntentId: String,
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    instructions: String
  },
  deliveryTime: Date,
  estimatedDeliveryTime: Date,
  specialInstructions: String,
  customerPhone: String,
  customerEmail: String
}, { timestamps: true });

export default mongoose.model('Order', orderSchema); 