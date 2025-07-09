import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Fade,
  useTheme,
  useMediaQuery,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Restaurant as RestaurantIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
  LocationOn as LocationIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { reservationAPI, restaurantAPI } from '../api';

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [formData, setFormData] = useState({
    restaurantId: '',
    date: '',
    time: '',
    partySize: 2,
    specialRequests: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [reservationsRes, restaurantsRes] = await Promise.all([
        reservationAPI.getUserReservations(),
        restaurantAPI.getAll()
      ]);
      setReservations(reservationsRes.data);
      setRestaurants(restaurantsRes.data);
    } catch (err) {
      setError('Failed to load reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (reservation = null) => {
    if (reservation) {
      setEditingReservation(reservation);
      setFormData({
        restaurantId: reservation.restaurant._id,
        date: reservation.date,
        time: reservation.time,
        partySize: reservation.partySize,
        specialRequests: reservation.specialRequests || ''
      });
    } else {
      setEditingReservation(null);
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        restaurantId: '',
        date: tomorrow.toISOString().split('T')[0],
        time: '19:00',
        partySize: 2,
        specialRequests: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReservation(null);
    setFormData({
      restaurantId: '',
      date: '',
      time: '',
      partySize: 2,
      specialRequests: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const reservationData = {
        restaurantId: formData.restaurantId,
        date: formData.date,
        time: formData.time,
        partySize: formData.partySize,
        specialRequests: formData.specialRequests
      };

      if (editingReservation) {
        await reservationAPI.update(editingReservation._id, reservationData);
        setSuccess('Reservation updated successfully!');
      } else {
        await reservationAPI.create(reservationData);
        setSuccess('Reservation created successfully!');
      }

      handleCloseDialog();
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      await reservationAPI.cancel(reservationId);
      setSuccess('Reservation cancelled successfully!');
      loadData();
    } catch (err) {
      setError('Failed to cancel reservation. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircleIcon />;
      case 'pending': return <ScheduleIcon />;
      case 'cancelled': return <CancelIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const ReservationCard = ({ reservation }) => (
    <Fade in timeout={800}>
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
          <CardMedia
            component="img"
            sx={{ 
              width: isMobile ? '100%' : 200, 
              height: isMobile ? 150 : 200,
              objectFit: 'cover'
            }}
            image={reservation.restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop'}
            alt={reservation.restaurant.name}
          />
          <CardContent sx={{ flex: 1, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                {reservation.restaurant.name}
              </Typography>
              <Chip
                icon={getStatusIcon(reservation.status)}
                label={reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                color={getStatusColor(reservation.status)}
                size="small"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {reservation.restaurant.location}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {new Date(reservation.date).toLocaleDateString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimeIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {reservation.time}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <GroupIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}
              </Typography>
            </Box>

            {reservation.specialRequests && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <strong>Special Requests:</strong> {reservation.specialRequests}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {reservation.status !== 'cancelled' && (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(reservation)}
                    sx={{ borderRadius: 2 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<CancelIcon />}
                    onClick={() => handleCancel(reservation._id)}
                    sx={{ borderRadius: 2 }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </Box>
      </Card>
    </Fade>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Fade in timeout={1000}>
            <Box>
              <RestaurantIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: isMobile ? '2.5rem' : '3.5rem',
                }}
              >
                Your Reservations
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4, fontWeight: 400 }}
              >
                Manage your dining reservations
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* Success/Error Alerts */}
        {success && (
          <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Add New Reservation Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
              },
            }}
          >
            Make New Reservation
          </Button>
        </Box>

        {/* Reservations List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : reservations.length > 0 ? (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Your Reservations ({reservations.length})
            </Typography>
            {reservations.map((reservation) => (
              <ReservationCard key={reservation._id} reservation={reservation} />
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <RestaurantIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              No reservations yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start by making your first reservation
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                },
              }}
            >
              Make Your First Reservation
            </Button>
          </Box>
        )}

        {/* Reservation Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ pb: 1 }}>
            {editingReservation ? 'Edit Reservation' : 'Make New Reservation'}
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Restaurant</InputLabel>
                    <Select
                      value={formData.restaurantId}
                      onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                      label="Restaurant"
                    >
                      {restaurants.map((restaurant) => (
                        <MenuItem key={restaurant._id} value={restaurant._id}>
                          {restaurant.name} - {restaurant.location}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  />
                </Grid>

                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Party Size</InputLabel>
                    <Select
                      value={formData.partySize}
                      onChange={(e) => setFormData({ ...formData, partySize: e.target.value })}
                      label="Party Size"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                        <MenuItem key={size} value={size}>
                          {size} {size === 1 ? 'person' : 'people'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="Special Requests (Optional)"
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    multiline
                    rows={3}
                    placeholder="Any special requests or dietary requirements..."
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button onClick={handleCloseDialog} disabled={submitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || !formData.restaurantId}
                sx={{
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                  },
                }}
              >
                {submitting ? 'Saving...' : (editingReservation ? 'Update Reservation' : 'Create Reservation')}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Reservations; 