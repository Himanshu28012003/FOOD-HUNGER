import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    cuisine: [String],
    priceRange: String,
    location: String
  },
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema); 