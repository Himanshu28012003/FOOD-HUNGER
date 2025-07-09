import Reservation from '../models/Reservation.js';
import Restaurant from '../models/Restaurant.js';

export const makeReservation = async (req, res, next) => {
  try {
    const { restaurantId, date, time, partySize, specialRequests } = req.body;
    
    // Validate restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Validate date is in the future
    const reservationDate = new Date(date);
    if (reservationDate < new Date()) {
      return res.status(400).json({ error: 'Reservation date must be in the future' });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      restaurant: restaurantId,
      date: reservationDate,
      time,
      partySize,
      specialRequests
    });

    // Populate restaurant details
    await reservation.populate('restaurant', 'name location');
    
    res.status(201).json(reservation);
  } catch (err) { 
    next(err); 
  }
};

export const getUserReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('restaurant', 'name location image cuisine')
      .sort({ date: 1, time: 1 });
    res.json(reservations);
  } catch (err) { 
    next(err); 
  }
};

export const getCurrentUserReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('restaurant', 'name location image cuisine')
      .sort({ date: 1, time: 1 });
    res.json(reservations);
  } catch (err) { 
    next(err); 
  }
};

export const updateReservation = async (req, res, next) => {
  try {
    const { date, time, partySize, specialRequests, status } = req.body;
    
    // Check if reservation belongs to user
    const existingReservation = await Reservation.findById(req.params.id);
    if (!existingReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    if (existingReservation.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this reservation' });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { date, time, partySize, specialRequests, status },
      { new: true }
    ).populate('restaurant', 'name location image cuisine');
    
    res.json(reservation);
  } catch (err) { 
    next(err); 
  }
};

export const cancelReservation = async (req, res, next) => {
  try {
    // Check if reservation belongs to user
    const existingReservation = await Reservation.findById(req.params.id);
    if (!existingReservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    if (existingReservation.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this reservation' });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id, 
      { status: 'cancelled' },
      { new: true }
    ).populate('restaurant', 'name location image cuisine');
    
    res.json({ message: 'Reservation cancelled successfully', reservation });
  } catch (err) { 
    next(err); 
  }
};

export const getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('restaurant', 'name location image cuisine');
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this reservation' });
    }
    
    res.json(reservation);
  } catch (err) { 
    next(err); 
  }
}; 