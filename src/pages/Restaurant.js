import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Chip,
  Alert,
  CircularProgress,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  LocationOn as LocationIcon,
  AttachMoney as PriceIcon,
  Star as StarIcon,
  MenuBook as MenuIcon,
  RateReview as ReviewIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { restaurantAPI } from '../api';

function Restaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openReview, setOpenReview] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadRestaurant();
  }, [id]);

  const loadRestaurant = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await restaurantAPI.getById(id);
      setRestaurant(response.data);
    } catch (err) {
      setError('Failed to load restaurant details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = () => setOpenReview(true);
  const handleCloseReview = () => setOpenReview(false);

  const handleReviewChange = e => setReview({ ...review, [e.target.name]: e.target.value });
  const handleRatingChange = (_, value) => setReview({ ...review, rating: value });

  const handleSubmitReview = async () => {
    setSubmitting(true);
    try {
      await restaurantAPI.addReview(id, review);
      setOpenReview(false);
      setReview({ rating: 5, comment: '' });
      loadRestaurant(); // Reload to get updated reviews
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMakeReservation = () => {
    navigate('/reservations');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          Restaurant not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Fade in timeout={800}>
          <Box>
            {/* Restaurant Header */}
            <Card sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                height="300"
                image={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=300&fit=crop'}
                alt={restaurant.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                    {restaurant.name}
                  </Typography>
                  {restaurant.averageRating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon sx={{ color: 'warning.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {restaurant.averageRating.toFixed(1)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Typography variant="h6" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {restaurant.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon color="primary" />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {restaurant.location}
                    </Typography>
                  </Box>
                  {restaurant.priceRange && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PriceIcon color="primary" />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {restaurant.priceRange}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {restaurant.cuisine?.map((cuisine, index) => (
                    <Chip
                      key={index}
                      label={cuisine}
                      size="medium"
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    to={`/menus/${restaurant._id}`}
                    variant="contained"
                    size="large"
                    startIcon={<MenuIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                      },
                    }}
                  >
                    View Menu
                  </Button>
                  
                  <Button
                    onClick={handleMakeReservation}
                    variant="contained"
                    size="large"
                    startIcon={<EventIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      bgcolor: 'success.main',
                      '&:hover': {
                        bgcolor: 'success.dark',
                      },
                    }}
                  >
                    Make Reservation
                  </Button>
                  
                  <Button
                    onClick={handleOpenReview}
                    variant="outlined"
                    size="large"
                    startIcon={<ReviewIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                  >
                    Add Review
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Reviews Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                Reviews ({restaurant.reviews?.length || 0})
              </Typography>
              
              {restaurant.reviews && restaurant.reviews.length > 0 ? (
                <Grid container columns={12} columnSpacing={3}>
                  {restaurant.reviews.map(r => (
                    <Grid key={r._id} xs={12} sm={6} md={4}>
                      <Card sx={{ borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Rating value={r.rating} readOnly max={5} size="small" />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              {r.rating}/5
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                            {r.comment}
                          </Typography>
                          {r.user && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                              - {r.user.name || 'Anonymous'}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ReviewIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No reviews yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Be the first to review this restaurant
                  </Typography>
                  <Button
                    onClick={handleOpenReview}
                    variant="contained"
                    startIcon={<ReviewIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Write a Review
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Fade>

        {/* Review Dialog */}
        <Dialog 
          open={openReview} 
          onClose={handleCloseReview}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ pb: 1 }}>
            Write a Review for {restaurant.name}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3, mt: 1 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                How would you rate your experience?
              </Typography>
              <Rating
                name="rating"
                value={review.rating}
                onChange={handleRatingChange}
                max={5}
                size="large"
              />
            </Box>
            <TextField
              autoFocus
              margin="dense"
              name="comment"
              label="Your Review"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={review.comment}
              onChange={handleReviewChange}
              placeholder="Share your dining experience..."
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={handleCloseReview} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              variant="contained"
              disabled={submitting || !review.comment.trim()}
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                },
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Restaurant; 