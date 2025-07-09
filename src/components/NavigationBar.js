import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Link, useNavigate } from 'react-router-dom';

function NavigationBar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, mb: 2 }}>
      <AppBar 
        position="static"
        sx={{
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton 
            size="large" 
            edge="start" 
            color="inherit" 
            aria-label="menu" 
            sx={{ mr: 2 }} 
            component={Link} 
            to="/"
          >
            <RestaurantMenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            Food and Hunger
          </Typography>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ fontWeight: 500 }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/restaurants"
            sx={{ fontWeight: 500 }}
          >
            Restaurants
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/recommendations"
            sx={{ fontWeight: 500 }}
          >
            Recommendations
          </Button>
          {isLoggedIn ? (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/profile"
                sx={{ fontWeight: 500 }}
              >
                Profile
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/order"
                sx={{ fontWeight: 500 }}
              >
                Order Food
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/orders"
                sx={{ fontWeight: 500 }}
              >
                My Orders
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/reservations"
                sx={{ fontWeight: 500 }}
              >
                Reservations
              </Button>
              <Button 
                color="inherit" 
                onClick={onLogout}
                sx={{ fontWeight: 500 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ fontWeight: 500 }}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/register"
                sx={{ fontWeight: 500 }}
              >
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavigationBar; 