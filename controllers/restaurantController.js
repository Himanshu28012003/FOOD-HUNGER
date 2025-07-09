import Restaurant from '../models/Restaurant.js';
import Review from '../models/Review.js';
import Menu from '../models/Menu.js';

export const getRestaurants = async (req, res, next) => {
  try {
    const { cuisine, location, priceRange, q } = req.query;
    const filter = {};
    if (cuisine) filter.cuisine = cuisine;
    if (location) filter.location = location;
    if (priceRange) filter.priceRange = priceRange;
    if (q) filter.name = { $regex: q, $options: 'i' };
    const restaurants = await Restaurant.find(filter).populate('reviews');
    res.json(restaurants);
  } catch (err) { next(err); }
};

export const getRandomRestaurants = async (req, res, next) => {
  try {
    const { limit = 5, cuisine, location, priceRange } = req.query;
    const filter = {};
    
    // Add optional filters
    if (cuisine) filter.cuisine = { $in: cuisine.split(',') };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (priceRange) filter.priceRange = priceRange;
    
    // Get random restaurants using MongoDB's $sample aggregation
    const restaurants = await Restaurant.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(limit) } },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'restaurant',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          averageRating: {
            $avg: '$reviews.rating'
          },
          reviewCount: {
            $size: '$reviews'
          }
        }
      }
    ]);
    
    res.json(restaurants);
  } catch (err) { next(err); }
};

export const getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('menu').populate('reviews');
    if (!restaurant) return res.status(404).json({ error: 'Not found' });
    res.json(restaurant);
  } catch (err) { next(err); }
};

export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.create({
      user: req.user.id,
      restaurant: req.params.id,
      rating,
      comment
    });
    await Restaurant.findByIdAndUpdate(req.params.id, { $push: { reviews: review._id } });
    res.status(201).json(review);
  } catch (err) { next(err); }
};

export const addOrUpdateMenu = async (req, res, next) => {
  try {
    const restaurantId = req.params.id;
    const { items } = req.body;
    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    // Check if menu exists for this restaurant
    let menu = await Menu.findOne({ restaurant: restaurantId });
    if (menu) {
      // Update existing menu
      menu.items = items;
      await menu.save();
    } else {
      // Create new menu
      menu = await Menu.create({ restaurant: restaurantId, items });
      // Link menu to restaurant
      restaurant.menu.push(menu._id);
      await restaurant.save();
    }
    res.status(200).json(menu);
  } catch (err) {
    next(err);
  }
}; 