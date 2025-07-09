import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';

export const getUserPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.preferences || {});
  } catch (err) { next(err); }
};

export const updateUserPreferences = async (req, res, next) => {
  try {
    const { cuisine, priceRange, location } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences: { cuisine, priceRange, location } },
      { new: true }
    );
    res.json(user.preferences);
  } catch (err) { next(err); }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const filter = {};
    if (user.preferences?.cuisine?.length) filter.cuisine = { $in: user.preferences.cuisine };
    if (user.preferences?.priceRange) filter.priceRange = user.preferences.priceRange;
    if (user.preferences?.location) filter.location = user.preferences.location;
    const restaurants = await Restaurant.find(filter).limit(5);
    res.json(restaurants);
  } catch (err) { next(err); }
}; 