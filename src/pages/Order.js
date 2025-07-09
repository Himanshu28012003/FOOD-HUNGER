import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
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
  Grid,
  Stepper,
  Step,
  StepLabel,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Restaurant as RestaurantIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  DeliveryDining as DeliveryIcon
} from '@mui/icons-material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { restaurantAPI, menuAPI, orderAPI, paymentAPI } from '../api';

// Load Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_key');

const steps = ['Cart', 'Delivery Details', 'Payment', 'Confirmation'];

function Order() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [orderDetails, setOrderDetails] = useState({
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    deliveryTime: '',
    specialInstructions: '',
    customerPhone: '',
    customerEmail: ''
  });
  const [orderId, setOrderId] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
      if (response.data.length > 0) {
        setSelectedRestaurant(response.data[0]);
        loadMenu(response.data[0]._id);
      }
    } catch (err) {
      setError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const loadMenu = async (restaurantId) => {
    try {
      const response = await menuAPI.getByRestaurant(restaurantId);
      setMenu(response.data.items); // Fix: set menu to the items array
    } catch (err) {
      setError('Failed to load menu');
    }
  };

  const addToCart = (menuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.menuItem._id === menuItem._id);
      if (existingItem) {
        return prevCart.map(item =>
          item.menuItem._id === menuItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { menuItem, quantity: 1, specialInstructions: '' }];
      }
    });
  };

  const removeFromCart = (menuItemId) => {
    setCart(prevCart => prevCart.filter(item => item.menuItem._id !== menuItemId));
  };

  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.menuItem._id === menuItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateSpecialInstructions = (menuItemId, instructions) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.menuItem._id === menuItemId
          ? { ...item, specialInstructions: instructions }
          : item
      )
    );
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  const calculateDeliveryFee = () => {
    return calculateSubtotal() > 30 ? 0 : 5;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateDeliveryFee();
  };

  const handleNext = () => {
    if (activeStep === 0 && cart.length === 0) {
      setError('Please add items to your cart');
      return;
    }
    if (activeStep === 1) {
      // Validate delivery details
      const { street, city, state, zipCode } = orderDetails.deliveryAddress;
      if (!street || !city || !state || !zipCode) {
        setError('Please fill in all delivery address fields');
        return;
      }
      if (!orderDetails.customerPhone || !orderDetails.customerEmail) {
        setError('Please provide phone and email');
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
    setError('');
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleCreateOrder = async () => {
    try {
      const orderData = {
        restaurantId: selectedRestaurant._id,
        items: cart.map(item => ({
          menuItem: item.menuItem._id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions
        })),
        deliveryAddress: orderDetails.deliveryAddress,
        deliveryTime: orderDetails.deliveryTime,
        specialInstructions: orderDetails.specialInstructions,
        customerPhone: orderDetails.customerPhone,
        customerEmail: orderDetails.customerEmail,
        paymentMethod: 'card'
      };

      const response = await orderAPI.create(orderData);
      setOrderId(response.data._id);
      setActiveStep(2);
    } catch (err) {
      setError('Failed to create order. Please try again.');
    }
  };

  const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handlePayment = async () => {
      if (!stripe || !elements) {
        return;
      }

      setPaymentProcessing(true);
      setError('');

      try {
        // Create payment intent
        const paymentIntentResponse = await paymentAPI.createPaymentIntent(orderId);
        
        // Confirm payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          paymentIntentResponse.clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
            }
          }
        );

        if (error) {
          setError(error.message);
        } else if (paymentIntent.status === 'succeeded') {
          // Confirm payment with backend
          await paymentAPI.confirmPayment(orderId, paymentIntent.id);
          setActiveStep(3);
          setSuccess('Payment successful! Your order has been confirmed.');
        }
      } catch (err) {
        setError('Payment failed. Please try again.');
      } finally {
        setPaymentProcessing(false);
      }
    };

    return (
      <Box sx={{ maxWidth: 500, mx: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Payment Details
        </Typography>
        
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Order Summary
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal: ${calculateSubtotal().toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tax: ${calculateTax().toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Delivery Fee: ${calculateDeliveryFee().toFixed(2)}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              Total: ${calculateTotal().toFixed(2)}
            </Typography>
          </Box>
        </Card>

        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Card Information
          </Typography>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </Card>

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handlePayment}
          disabled={!stripe || paymentProcessing}
          startIcon={paymentProcessing ? <CircularProgress size={20} /> : <PaymentIcon />}
          sx={{
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
          {paymentProcessing ? 'Processing Payment...' : `Pay $${calculateTotal().toFixed(2)}`}
        </Button>
      </Box>
    );
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            {/* Restaurant Selection */}
            <Card sx={{ mb: 3, p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Select Restaurant
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Restaurant</InputLabel>
                <Select
                  value={selectedRestaurant?._id || ''}
                  onChange={(e) => {
                    const restaurant = restaurants.find(r => r._id === e.target.value);
                    setSelectedRestaurant(restaurant);
                    loadMenu(restaurant._id);
                  }}
                  label="Restaurant"
                >
                  {restaurants.map((restaurant) => (
                    <MenuItem key={restaurant._id} value={restaurant._id}>
                      {restaurant.name} - {restaurant.location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Card>

            {/* Menu Items */}
            <Grid container spacing={3}>
              <Grid xs={12} md={8}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Menu
                </Typography>
                <Grid container spacing={2}>
                  {menu.map((item) => (
                    <Grid xs={12} sm={6} key={item._id}>
                      <Card sx={{ height: '100%' }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=140&fit=crop'}
                          alt={item.name}
                        />
                        <CardContent>
                          <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {item.description}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" color="primary" fontWeight={600}>
                              ${item.price}
                            </Typography>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => addToCart(item)}
                              startIcon={<AddIcon />}
                            >
                              Add
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              {/* Cart */}
              <Grid xs={12} md={4}>
                <Card sx={{ p: 3, position: 'sticky', top: 20 }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <CartIcon sx={{ mr: 1 }} />
                    Your Cart ({cart.length} items)
                  </Typography>
                  
                  {cart.length === 0 ? (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      Your cart is empty
                    </Typography>
                  ) : (
                    <Box>
                      {cart.map((item) => (
                        <Box key={item.menuItem._id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {item.menuItem.name}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => removeFromCart(item.menuItem._id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography sx={{ mx: 1, minWidth: 20, textAlign: 'center' }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
                            >
                              <AddIcon />
                            </IconButton>
                            <Typography variant="body2" sx={{ ml: 'auto' }}>
                              ${(item.menuItem.price * item.quantity).toFixed(2)}
                            </Typography>
                          </Box>
                          
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Special instructions..."
                            value={item.specialInstructions}
                            onChange={(e) => updateSpecialInstructions(item.menuItem._id, e.target.value)}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      ))}
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Subtotal: ${calculateSubtotal().toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tax: ${calculateTax().toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Delivery Fee: ${calculateDeliveryFee().toFixed(2)}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="h6" fontWeight={600}>
                          Total: ${calculateTotal().toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Delivery Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Delivery Address
                </Typography>
              </Grid>
              
              <Grid xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={orderDetails.deliveryAddress.street}
                  onChange={(e) => setOrderDetails({
                    ...orderDetails,
                    deliveryAddress: { ...orderDetails.deliveryAddress, street: e.target.value }
                  })}
                  required
                />
              </Grid>
              
              <Grid xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={orderDetails.deliveryAddress.city}
                  onChange={(e) => setOrderDetails({
                    ...orderDetails,
                    deliveryAddress: { ...orderDetails.deliveryAddress, city: e.target.value }
                  })}
                  required
                />
              </Grid>
              
              <Grid xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={orderDetails.deliveryAddress.state}
                  onChange={(e) => setOrderDetails({
                    ...orderDetails,
                    deliveryAddress: { ...orderDetails.deliveryAddress, state: e.target.value }
                  })}
                  required
                />
              </Grid>
              
              <Grid xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  value={orderDetails.deliveryAddress.zipCode}
                  onChange={(e) => setOrderDetails({
                    ...orderDetails,
                    deliveryAddress: { ...orderDetails.deliveryAddress, zipCode: e.target.value }
                  })}
                  required
                />
              </Grid>
              
              <Grid xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={orderDetails.customerPhone}
                  onChange={(e) => setOrderDetails({ ...orderDetails, customerPhone: e.target.value })}
                  required
                />
              </Grid>
              
              <Grid xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={orderDetails.customerEmail}
                  onChange={(e) => setOrderDetails({ ...orderDetails, customerEmail: e.target.value })}
                  required
                />
              </Grid>
              
              <Grid xs={12}>
                <TextField
                  fullWidth
                  label="Special Instructions (Optional)"
                  multiline
                  rows={3}
                  value={orderDetails.specialInstructions}
                  onChange={(e) => setOrderDetails({ ...orderDetails, specialInstructions: e.target.value })}
                  placeholder="Any special delivery instructions..."
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Elements stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 2 }}>
              Order Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Thank you for your order. We'll start preparing it right away.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Order ID: {orderId}
            </Typography>
          </Box>
        );

      default:
        return null;
    }
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
                Order Food Online
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4, fontWeight: 400 }}
              >
                Browse menus and place your order
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

        {/* Stepper */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step Content */}
        <Box sx={{ mb: 4 }}>
          {renderStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        {activeStep < 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box>
              {activeStep === 1 ? (
                <Button
                  variant="contained"
                  onClick={handleCreateOrder}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                    },
                  }}
                >
                  Create Order
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                    },
                  }}
                >
                  {activeStep === steps.length - 2 ? 'Finish' : 'Next'}
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Order; 