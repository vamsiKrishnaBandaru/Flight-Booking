import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FlightCard from '../components/FlightCard'; // Import the shared component
import { FlightSearchForm } from '../components/FlightSearchForm';
import { useToast } from '../context/ToastContext';
import {
  getOutboundFlights,
  getFlightsLoading,
  getFlightsHasSearched,
  getFlightSearchParams,
} from '../store/selectors/flightSelectors';
import {
  searchFlightsData,
  setSelectedFlight,
} from '../store/actions/flightActions';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Button,
} from '@mui/material';
import {
  LocationOn,
  Shield,
  Star,
  TrendingUp,
  Flight,
  Security,
  Speed,
  Support,
  ArrowForward,
} from '@mui/icons-material';
import { GradientButton } from '../components/ui/GradientButton';
import { useAuth } from '../context/AuthContext';

// Remove the local FlightCard component definition

export function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { showError } = useToast();

  // Redux state - exactly like your approach
  const flights = useSelector(getOutboundFlights);
  const loading = useSelector(getFlightsLoading);
  const hasSearched = useSelector(getFlightsHasSearched);
  const searchParams = useSelector(getFlightSearchParams);

  const handleSearch = (params) => {
    dispatch({ type: 'CLEAR_FLIGHT_SEARCH' }); // Clear previous results

    // Validate required fields - updated for ID-based payload
    if (!params.originId || !params.destinationId) {
      showError('Please select both origin and destination airports');
      return;
    }

    // Dispatch Redux action - exactly like your example
    dispatch(searchFlightsData(params));
  };

  const handleSelectFlight = (flight) => {
    // Store search parameters for later navigation
    sessionStorage.setItem('searchParams', JSON.stringify(searchParams));
    sessionStorage.setItem('selectedFlight', JSON.stringify(flight));

    // Use Redux action to set selected flight
    dispatch(setSelectedFlight(flight));
    navigate('/booking');
  };

  const features = [
    {
      icon: <LocationOn />,
      title: 'Global Coverage',
      description:
        'Search flights to over 1000 destinations worldwide with real-time availability',
    },
    {
      icon: <Shield />,
      title: 'Secure Booking',
      description:
        'Your personal and payment information is protected with bank-level security',
    },
    {
      icon: <Star />,
      title: 'Best Prices',
      description:
        'We compare prices across airlines to ensure you get the best deals available',
    },
  ];

  const popularDestinations = [
    { city: 'New York', country: 'USA', price: 299, image: '🗽' },
    { city: 'London', country: 'UK', price: 450, image: '🇬🇧' },
    { city: 'Tokyo', country: 'Japan', price: 680, image: '🗾' },
    { city: 'Paris', country: 'France', price: 520, image: '🇫🇷' },
    { city: 'Sydney', country: 'Australia', price: 890, image: '🇦🇺' },
    { city: 'Dubai', country: 'UAE', price: 380, image: '🇦🇪' },
  ];

  return (
    <Box
      sx={{
        bgcolor: '#EFF7FB',
      }}
    >
      {/* Hero Section - Clean like Lovable */}
      <Box
        sx={{
          pt: 8,
          pb: 6,
          bgcolor: '#EFF7FB', // Same as body background
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center' }}>
            <Chip
              label="✈️ Your Journey Starts Here"
              sx={{
                mb: 4,
                bgcolor: '#EBF4FF', // Lovable primary-light
                color: '#3B82F6', // Lovable primary
                fontSize: '0.875rem',
                fontWeight: 500,
                px: 3,
                py: 1,
                borderRadius: '12px',
                border: 'none',
              }}
            />

            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.25rem', md: '3rem' },
                fontWeight: 700,
                mb: 4,
                lineHeight: 1.2,
                color: '#1E293B', // Lovable foreground
                letterSpacing: '-0.025em',
              }}
            >
              Find & Book Your{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #7DD3FC, #38BDF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Perfect Flight
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                maxWidth: 640,
                mx: 'auto',
                color: '#64748B', // Lovable muted-foreground
                lineHeight: 1.6,
                mb: 6,
                fontSize: '1.125rem',
                fontWeight: 400,
              }}
            >
              Search, compare, and book flights from over 500 airlines to
              thousands of destinations worldwide. Get the best deals with our
              smart price comparison technology.
            </Typography>
          </Box>

          {/* Search Form - Clean White Card like Lovable */}
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <FlightSearchForm onSearch={handleSearch} />
          </Box>
        </Container>
      </Box>

      {/* Loading State */}
      {loading && (
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 8,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={60} sx={{ color: '#3B82F6', mb: 3 }} />
              <Typography
                variant="h6"
                sx={{ color: '#1E293B', fontWeight: 600, mb: 1 }}
              >
                Searching flights...
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748B' }}>
                Finding the best deals for your journey
              </Typography>
            </Box>
          </Box>
        </Container>
      )}

      {/* Flight Results - Only show after search with results */}
      {!loading && hasSearched && flights.length > 0 && (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#1E293B',
                fontSize: '2rem',
              }}
            >
              Available Flights
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: '#64748B', fontSize: '1.125rem' }}
            >
              {flights.length} flights found for your search
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {flights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onSelect={handleSelectFlight} // Pass the handler to onSelect
              />
            ))}
          </Box>
        </Container>
      )}

      {/* No Results - ONLY show after search with no results */}
      {!loading && hasSearched && flights.length === 0 && (
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Card
            sx={{
              textAlign: 'center',
              py: 8,
              borderRadius: '12px',
              bgcolor: '#FFFFFF', // Lovable card white
              border: '1px solid #E2E8F0', // Lovable border
              boxShadow: '0 4px 20px rgba(56, 142, 255, 0.08)', // Lovable shadow
            }}
          >
            <CardContent>
              <Typography
                variant="h4"
                sx={{ color: '#1E293B', mb: 3, fontWeight: 600 }}
              >
                No flights found for your search criteria
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#64748B', mb: 4, fontSize: '1rem' }}
              >
                Try adjusting your search parameters or search for JFK to LAX
                for February 2025
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#3B82F6', // Lovable primary
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: '#2563EB', // Lovable primary-hover
                  },
                }}
                onClick={() => window.location.reload()}
              >
                Try Different Search
              </Button>
            </CardContent>
          </Card>
        </Container>
      )}

      {/* Features Section - Only show when not showing search results */}
      {(!hasSearched || (hasSearched && flights.length === 0)) && (
        <Box sx={{ py: 12, bgcolor: '#FFFFFF' }}>
          <Container maxWidth="xl">
            <Box sx={{ textAlign: 'center', mb: 12 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: '#1E293B',
                  mb: 4,
                  fontSize: '2.25rem',
                }}
              >
                Why Choose SkyBook?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#64748B',
                  maxWidth: 640,
                  mx: 'auto',
                  fontSize: '1.125rem',
                }}
              >
                We make flight booking simple, secure, and affordable with
                cutting-edge technology and exceptional service.
              </Typography>
            </Box>

            {/* 3 cards in a HORIZONTAL ROW exactly like lovable */}
            <Box
              sx={{
                display: 'flex',
                gap: 6,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {features.map((feature, index) => (
                <Box key={index} sx={{ flex: '1 1 300px', maxWidth: '350px' }}>
                  <Card
                    sx={{
                      p: 6,
                      textAlign: 'center',
                      height: '100%',
                      bgcolor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        borderColor: '#3B82F6',
                        '& .feature-icon': {
                          transform: 'scale(1.1)',
                        },
                      },
                    }}
                  >
                    <Box
                      className="feature-icon"
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7DD3FC, #38BDF8)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 4,
                        transition:
                          'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        sx: { fontSize: 32 },
                      })}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: '#1E293B',
                        fontSize: '1.25rem',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#64748B',
                        lineHeight: 1.6,
                        fontSize: '1rem',
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Card>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {/* Popular Destinations Section - Only show when not showing search results */}
      {(!hasSearched || (hasSearched && flights.length === 0)) && (
        <Box sx={{ py: 12, bgcolor: '#EFF7FB' }}>
          <Container maxWidth="xl">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 12,
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    color: '#1E293B',
                    mb: 4,
                    fontSize: '2.25rem',
                  }}
                >
                  Popular Destinations
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: '#64748B', fontSize: '1.125rem' }}
                >
                  Discover amazing places with great flight deals
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#E2E8F0',
                  color: '#64748B',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#3B82F6',
                    color: '#3B82F6',
                    bgcolor: '#EBF4FF',
                  },
                }}
              >
                View All Destinations
              </Button>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {popularDestinations.map((destination, index) => (
                <Card
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: '12px',
                    background:
                      'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                    border: 'none',
                    boxShadow:
                      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow:
                        '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                      }}
                    >
                      <Box sx={{ fontSize: '2.25rem' }}>
                        {destination.image}
                      </Box>
                      <Chip
                        label={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <TrendingUp sx={{ fontSize: 12 }} />
                            Popular
                          </Box>
                        }
                        size="small"
                        sx={{
                          bgcolor: '#EBF4FF',
                          color: '#3B82F6',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          border: 'none',
                          borderRadius: '12px',
                          px: 1.5,
                          py: 0.5,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        color: '#1E293B',
                        fontSize: '1.25rem',
                      }}
                    >
                      {destination.city}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: '#64748B', mb: 2, fontSize: '0.875rem' }}
                    >
                      {destination.country}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 'auto',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: '#64748B', fontSize: '0.875rem' }}
                      >
                        From
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: '#3B82F6',
                          fontSize: '1.5rem',
                        }}
                      >
                        ${destination.price}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {/* CTA Section - only for logged-out users */}
      {!user && (
        <Box sx={{ bgcolor: '#0F172A', py: 10 }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}
            >
              Ready to Take Off?
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: '#94A3B8', mb: 5, maxWidth: 600, mx: 'auto' }}
            >
              Join thousands of happy travelers who trust SkyBook for their
              adventures. Sign up now for exclusive deals and a seamless booking
              experience.
            </Typography>
            <GradientButton
              size="large"
              onClick={() => navigate('/register')}
              sx={{ px: 6, py: 1.5, fontSize: '1.125rem' }}
            >
              Sign Up Now
            </GradientButton>
          </Container>
        </Box>
      )}
    </Box>
  );
}

export default Home;
