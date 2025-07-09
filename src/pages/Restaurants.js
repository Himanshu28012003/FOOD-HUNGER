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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Fade,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Pagination,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Restaurant as RestaurantIcon,
  ArrowForward as ArrowForwardIcon,
  Shuffle as ShuffleIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../api';

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [showRandom, setShowRandom] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [restaurants, searchQuery, selectedCuisine, selectedPriceRange, selectedLocation, sortBy]);

  const loadRestaurants = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
    } catch (err) {
      setError('Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadRandomRestaurants = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await restaurantAPI.getRandom({ limit: 20 });
      setRestaurants(response.data);
      setShowRandom(true);
    } catch (err) {
      setError('Failed to load random restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...restaurants];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        restaurant.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Cuisine filter
    if (selectedCuisine) {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisine?.includes(selectedCuisine)
      );
    }

    // Price range filter
    if (selectedPriceRange) {
      filtered = filtered.filter(restaurant =>
        restaurant.priceRange === selectedPriceRange
      );
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(restaurant =>
        restaurant.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'price':
          return (a.priceRange || '').localeCompare(b.priceRange || '');
        default:
          return 0;
      }
    });

    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('');
    setSelectedPriceRange('');
    setSelectedLocation('');
    setSortBy('name');
    setShowRandom(false);
  };

  // Get unique values for filters
  const cuisines = [...new Set(restaurants.flatMap(r => r.cuisine || []))];
  const priceRanges = [...new Set(restaurants.map(r => r.priceRange).filter(Boolean))];
  const locations = [...new Set(restaurants.map(r => r.location).filter(Boolean))];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

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
                All Restaurants
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4, fontWeight: 400 }}
              >
                {showRandom ? 'Random recommendations for you' : 'Discover amazing dining experiences'}
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
            }}
          >
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants..."
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            
            <ToggleButtonGroup
              value={showRandom ? 'random' : 'all'}
              exclusive
              onChange={(e, value) => {
                if (value === 'random') {
                  loadRandomRestaurants();
                } else {
                  loadRestaurants();
                }
              }}
              sx={{ borderRadius: 2 }}
            >
              <ToggleButton value="all" sx={{ px: 3 }}>
                All
              </ToggleButton>
              <ToggleButton value="random" sx={{ px: 3 }}>
                <ShuffleIcon sx={{ mr: 1 }} />
                Random
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Filter Controls */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 2,
              mb: 3,
            }}
          >
            <FormControl fullWidth size="small">
              <InputLabel>Cuisine</InputLabel>
              <Select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                label="Cuisine"
              >
                <MenuItem value="">All Cuisines</MenuItem>
                {cuisines.map((cuisine) => (
                  <MenuItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Price Range</InputLabel>
              <Select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                label="Price Range"
              >
                <MenuItem value="">All Prices</MenuItem>
                {priceRanges.map((price) => (
                  <MenuItem key={price} value={price}>
                    {price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Location</InputLabel>
              <Select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                label="Location"
              >
                <MenuItem value="">All Locations</MenuItem>
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="price">Price</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Clear Filters Button */}
          {(searchQuery || selectedCuisine || selectedPriceRange || selectedLocation) && (
            <Button
              onClick={clearFilters}
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
            >
              Clear All Filters
            </Button>
          )}
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Results Count */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" color="text.secondary">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
          </Typography>
          {loading && <CircularProgress size={24} />}
        </Box>

        {/* Restaurants Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : currentRestaurants.length > 0 ? (
          <>
            <Grid container columns={12} columnSpacing={3} sx={{ mb: 4 }}>
              {currentRestaurants.map((restaurant) => (
                <Grid key={restaurant._id} xs={12} sm={6} md={4}>
                  <RestaurantCard restaurant={restaurant} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <RestaurantIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              No restaurants found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search criteria or filters
            </Typography>
            <Button
              onClick={clearFilters}
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Restaurants; 