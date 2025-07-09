import Menu from '../models/Menu.js';
import Review from '../models/Review.js';

export const getMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findOne({ restaurant: req.params.restaurantId }).populate('items.reviews');
    if (!menu) return res.status(404).json({ error: 'Menu not found' });
    res.json(menu);
  } catch (err) { next(err); }
};

export const addMenuReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const menu = await Menu.findOne({ restaurant: req.params.restaurantId });
    if (!menu) return res.status(404).json({ error: 'Menu not found' });
    const item = menu.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    const review = await Review.create({
      user: req.user.id,
      menuItem: req.params.itemId,
      rating,
      comment
    });
    item.reviews.push(review._id);
    await menu.save();
    res.status(201).json(review);
  } catch (err) { next(err); }
}; 