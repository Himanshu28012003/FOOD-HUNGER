import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Fade,
  useTheme,
  useMediaQuery,
  Grid,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  DeliveryDining as DeliveryIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { orderAPI } from '../api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await orderAPI.cancel(orderId);
      setError('');
      loadOrders();
    } catch (err) {
      setError('Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'preparing': return 'info';
      case 'ready': return 'warning';
      case 'out_for_delivery': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircleIcon />;
      case 'preparing': return <ScheduleIcon />;
      case 'ready': return <DeliveryIcon />;
      case 'out_for_delivery': return <DeliveryIcon />;
      case 'delivered': return <CheckCircleIcon />;
      case 'cancelled': return <CancelIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'refunded': return 'info';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const OrderCard = ({ order }) => (
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
            image={order.restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop'}
            alt={order.restaurant.name}
          />
          <CardContent sx={{ flex: 1, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                {order.restaurant.name}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <Chip
                  icon={getStatusIcon(order.status)}
                  label={order.status.replace('_', ' ').toUpperCase()}
                  color={getStatusColor(order.status)}
                  size="small"
                />
                <Chip
                  label={order.paymentStatus.toUpperCase()}
                  color={getPaymentStatusColor(order.paymentStatus)}
                  size="small"
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {order.restaurant.location}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimeIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Ordered: {formatDate(order.createdAt)}
              </Typography>
            </Box>

            {order.estimatedDeliveryTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <DeliveryIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Estimated Delivery: {formatDate(order.estimatedDeliveryTime)}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ReceiptIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • Total: ${order.total.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => handleViewOrder(order)}
                sx={{ borderRadius: 2 }}
              >
                View Details
              </Button>
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<CancelIcon />}
                  onClick={() => handleCancelOrder(order._id)}
                  sx={{ borderRadius: 2 }}
                >
                  Cancel Order
                </Button>
              )}
            </Box>
          </CardContent>
        </Box>
      </Card>
    </Fade>
  );

  const OrderDetailsDialog = () => (
    <Dialog 
      open={openDialog} 
      onClose={() => setOpenDialog(false)}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        Order Details
        <Typography variant="body2" color="text.secondary">
          Order ID: {selectedOrder?._id}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {selectedOrder && (
          <Box>
            {/* Restaurant Info */}
            <Card sx={{ mb: 3, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Restaurant Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <RestaurantIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1" fontWeight={600}>
                  {selectedOrder.restaurant.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {selectedOrder.restaurant.location}
                </Typography>
              </Box>
            </Card>

            {/* Order Items */}
            <Card sx={{ mb: 3, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Items
              </Typography>
              {selectedOrder.items.map((item, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.menuItem.name}
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Quantity: {item.quantity} × ${item.price}
                  </Typography>
                  {item.specialInstructions && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Special Instructions:</strong> {item.specialInstructions}
                    </Typography>
                  )}
                </Box>
              ))}
            </Card>

            {/* Order Summary */}
            <Card sx={{ mb: 3, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">${selectedOrder.subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tax:</Typography>
                <Typography variant="body2">${selectedOrder.tax.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Delivery Fee:</Typography>
                <Typography variant="body2">${selectedOrder.deliveryFee.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={600}>Total:</Typography>
                <Typography variant="h6" fontWeight={600}>${selectedOrder.total.toFixed(2)}</Typography>
              </Box>
            </Card>

            {/* Delivery Information */}
            <Card sx={{ mb: 3, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Delivery Information
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Address:</strong> {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} {selectedOrder.deliveryAddress.zipCode}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Phone:</strong> {selectedOrder.customerPhone}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Email:</strong> {selectedOrder.customerEmail}
              </Typography>
              {selectedOrder.specialInstructions && (
                <Typography variant="body2">
                  <strong>Special Instructions:</strong> {selectedOrder.specialInstructions}
                </Typography>
              )}
            </Card>

            {/* Order Status */}
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip
                  icon={getStatusIcon(selectedOrder.status)}
                  label={selectedOrder.status.replace('_', ' ').toUpperCase()}
                  color={getStatusColor(selectedOrder.status)}
                  sx={{ mr: 2 }}
                />
                <Chip
                  label={selectedOrder.paymentStatus.toUpperCase()}
                  color={getPaymentStatusColor(selectedOrder.paymentStatus)}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Ordered:</strong> {formatDate(selectedOrder.createdAt)}
              </Typography>
              {selectedOrder.estimatedDeliveryTime && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Estimated Delivery:</strong> {formatDate(selectedOrder.estimatedDeliveryTime)}
                </Typography>
              )}
            </Card>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Fade in timeout={1000}>
            <Box>
              <ReceiptIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
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
                Your Orders
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4, fontWeight: 400 }}
              >
                Track your food orders and delivery status
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Orders List */}
        {orders.length > 0 ? (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Order History ({orders.length} orders)
            </Typography>
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ReceiptIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              No orders yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start by placing your first order
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="/order"
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
              Order Food Now
            </Button>
          </Box>
        )}

        {/* Order Details Dialog */}
        <OrderDetailsDialog />
      </Box>
    </Container>
  );
}

export default Orders; 