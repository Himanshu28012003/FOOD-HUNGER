import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  cuisine: [String],
  location: String,
  priceRange: String,
  image: String,
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
}, { timestamps: true });

export default mongoose.model('Restaurant', restaurantSchema); 