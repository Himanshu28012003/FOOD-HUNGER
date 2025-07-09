import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Chip,
  Rating,
  CircularProgress,
  Alert,
  Fade,
  useTheme,
  useMediaQuery,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Restaurant as RestaurantIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../api';
import { RouterProvider } from 'react-router-dom';

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadRandomRestaurants();
  }, []);

  const loadRandomRestaurants = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await restaurantAPI.getRandom({ limit: 6 });
      setRestaurants(response.data);
    } catch (err) {
      setError('Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const response = await restaurantAPI.getAll({ q: searchQuery });
      setSearchResults(response.data);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const RestaurantCard = ({ restaurant }) => (
    <Fade in timeout={800}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop'}
          alt={restaurant.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
              {restaurant.name}
            </Typography>
            {restaurant.averageRating && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StarIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {restaurant.averageRating.toFixed(1)}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
            {restaurant.description || 'Discover amazing flavors and exceptional dining experience.'}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {restaurant.cuisine?.slice(0, 2).map((cuisine, index) => (
              <Chip
                key={index}
                label={cuisine}
                size="small"
                sx={{
                  bgcolor: 'primary.light',
                  color: 'white',
                  fontSize: '0.75rem',
                }}
              />
            ))}
            {restaurant.cuisine?.length > 2 && (
              <Chip
                label={`+${restaurant.cuisine.length - 2} more`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {restaurant.location || 'Location not specified'}
            </Typography>
          </Box>
          
          {restaurant.priceRange && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Price Range: {restaurant.priceRange}
            </Typography>
          )}
          
          <Button
            component={Link}
            to={`/restaurants/${restaurant._id}`}
            variant="contained"
            fullWidth
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: 'auto',
              borderRadius: 2,
              py: 1,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
              },
            }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Hero Section */}
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
                Food and Hunger
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4, fontWeight: 400 }}
              >
                Find your next favorite dining experience
              </Typography>
            </Box>
          </Fade>

          {/* Search Bar */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mb: 4,
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
            }}
          >
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants by name, cuisine, or location..."
              variant="outlined"
              size="large"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: isMobile ? '100%' : 400,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  fontSize: '1.1rem',
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={searching}
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
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
              Search Results ({searchResults.length})
            </Typography>
            <Grid container spacing={3}>
              {searchResults.map((restaurant) => (
                <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
                  <RestaurantCard restaurant={restaurant} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Random Restaurants Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Recommended for You
            </Typography>
            <Button
              onClick={loadRandomRestaurants}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {restaurants.map((restaurant) => (
                <Grid item xs={12} sm={6} md={4} key={restaurant._id}>
                  <RestaurantCard restaurant={restaurant} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Ready to explore more?
          </Typography>
          <Button
            component={Link}
            to="/restaurants"
            variant="contained"
            size="large"
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
            Browse All Restaurants
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Home; 