import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Avatar,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Restaurant as RestaurantIcon,
  LocationOn as LocationIcon,
  AttachMoney as PriceIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import API from '../api';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [prefs, setPrefs] = useState({ cuisine: [], priceRange: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, prefsRes] = await Promise.all([
          API.get('/auth/profile'),
          API.get('/users/preferences')
        ]);
        setProfile(profileRes.data);
        setPrefs(prefsRes.data);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = e => {
    setPrefs({ ...prefs, [e.target.name]: e.target.value });
    setSuccess('');
    setError('');
  };

  const handleCuisineChange = (e) => {
    const cuisines = e.target.value.split(',').map(c => c.trim()).filter(c => c);
    setPrefs({ ...prefs, cuisine: cuisines });
    setSuccess('');
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess('');
    setError('');
    
    try {
    await API.put('/users/preferences', prefs);
      setSuccess('Preferences updated successfully!');
    } catch (err) {
      setError('Failed to update preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading your profile...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          Failed to load profile. Please refresh the page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Fade in timeout={800}>
          <Box>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <RestaurantIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Your Profile
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Manage your account and preferences
              </Typography>
            </Box>

            {/* Success/Error Alerts */}
            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
              {/* Profile Information */}
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  flex: 1,
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                      mr: 2
                    }}
                  >
                    {profile.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      {profile.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Member since {new Date().getFullYear()}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {profile.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Account Type
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      Customer
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Preferences */}
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  flex: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Your Preferences
                </Typography>

                <TextField
                  fullWidth
                  label="Favorite Cuisines"
                  name="cuisine"
                  value={prefs.cuisine.join(', ')}
                  onChange={handleCuisineChange}
                  margin="normal"
                  placeholder="e.g., Italian, Chinese, Mexican"
                  InputProps={{
                    startAdornment: (
                      <RestaurantIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-focused': {
                        color: 'white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255,255,255,0.5)',
                        opacity: 1,
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Price Range"
                  name="priceRange"
                  value={prefs.priceRange}
                  onChange={handleChange}
                  margin="normal"
                  placeholder="e.g., $10-30, Budget, Premium"
                  InputProps={{
                    startAdornment: (
                      <PriceIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-focused': {
                        color: 'white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255,255,255,0.5)',
                        opacity: 1,
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Preferred Location"
                  name="location"
                  value={prefs.location}
                  onChange={handleChange}
                  margin="normal"
                  placeholder="e.g., Downtown, North Side, Anywhere"
                  InputProps={{
                    startAdornment: (
                      <LocationIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.7)' }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                      '&.Mui-focused': {
                        color: 'white',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255,255,255,0.5)',
                        opacity: 1,
                      },
                    },
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSave}
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </Paper>
            </Box>
          </Box>
        </Fade>
      </Box>
    </Container>
  );
}

export default Profile; 