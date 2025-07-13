import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, formatDate, formatTime } from '../utils/formatters';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Divider,
  CircularProgress,
  Button,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Flight,
  CalendarToday,
  Schedule,
  Person,
  CreditCard,
  People,
  ArrowBack,
  NavigateNext,
  Warning,
} from '@mui/icons-material';
import { GradientButton } from '../components/ui/GradientButton';
import { bookingApi } from '../services/bookingService';

const validateDateOfBirth = (dob) => {
  if (!dob) return false;

  const date = new Date(dob);
  const today = new Date();

  if (isNaN(date.getTime())) return false;
  if (date > today) return false;

  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  return age >= 0 && age <= 120;
};

export function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showError, showSuccess } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sectionLoading, setSectionLoading] = useState({
    flight: true,
    passengers: false,
  });

  useEffect(() => {
    const initializeBooking = async () => {
      if (!user) {
        showError('Please sign in to book a flight.');
        navigate('/login', {
          state: {
            from: location,
            hasSearchResults: true,
          },
        });
        return;
      }

      try {
        // Load selected flight from sessionStorage
        const flightData = sessionStorage.getItem('selectedFlight');
        if (!flightData) {
          throw new Error('No flight selected');
        }

        const flight = JSON.parse(flightData);
        setSelectedFlight(flight);

        // Initialize passengers based on search params
        const params = JSON.parse(sessionStorage.getItem('searchParams') || '{}');
        const passengerCount =
          (params.passengers?.adults || 1) + (params.passengers?.children || 0);

        const initialPassengers = Array.from(
          { length: passengerCount },
          (_, index) => ({
            id: index + 1,
            firstName: '',
            lastName: '',
            dateOfBirth: '',
          }),
        );

        setPassengers(initialPassengers);
      } catch (error) {
        showError('No flight selected. Please search for flights first.');
        navigate('/');
      } finally {
        setSectionLoading((prev) => ({ ...prev, flight: false }));
      }
    };

    initializeBooking();
  }, [user, navigate, location, showError]);

  const handlePassengerChange = (index, field, value) => {
    setPassengers((prev) =>
      prev.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger,
      ),
    );
    // Clear error for this field if it exists
    if (formErrors[`passenger${index}-${field}`]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`passenger${index}-${field}`];
        return newErrors;
      });
    }
  };

  const validatePassengers = () => {
    const errors = {};
    let isValid = true;

    passengers.forEach((passenger, index) => {
      if (!passenger.firstName?.trim()) {
        errors[`passenger${index}-firstName`] = 'First name is required';
        isValid = false;
      } else if (passenger.firstName.length < 2) {
        errors[`passenger${index}-firstName`] = 'First name must be at least 2 characters';
        isValid = false;
      }

      if (!passenger.lastName?.trim()) {
        errors[`passenger${index}-lastName`] = 'Last name is required';
        isValid = false;
      } else if (passenger.lastName.length < 2) {
        errors[`passenger${index}-lastName`] = 'Last name must be at least 2 characters';
        isValid = false;
      }

      if (!passenger.dateOfBirth) {
        errors[`passenger${index}-dateOfBirth`] = 'Date of birth is required';
        isValid = false;
      } else if (!validateDateOfBirth(passenger.dateOfBirth)) {
        errors[`passenger${index}-dateOfBirth`] = 'Please enter a valid date of birth';
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleConfirmBooking = () => {
    if (!validatePassengers()) {
      showError('Please fill in all required passenger details correctly.');
      return;
    }
    setShowConfirmation(true);
  };

  const handleBooking = async () => {
    setLoading(true);
    setShowConfirmation(false);

    try {
      const totalAmount = selectedFlight.price * passengers.length;

      const passengerDetails = passengers.map((p) => ({
        firstName: p.firstName.trim(),
        lastName: p.lastName.trim(),
        dateOfBirth: p.dateOfBirth,
      }));

      const bookingData = {
        flightId: selectedFlight.id,
        passengers: passengerDetails,
        totalAmount: totalAmount,
        bookingStatus: 'confirmed',
      };

      const result = await bookingApi.create(bookingData);

      sessionStorage.removeItem('selectedFlight');
      sessionStorage.removeItem('searchParams');

      showSuccess('Booking confirmed successfully!');
      navigate(`/bookings/${result.data.booking.id}`);
    } catch (error) {
      showError(error.message || 'Failed to complete booking.');
    } finally {
      setLoading(false);
    }
  };

  if (sectionLoading.flight) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#EFF7FB',
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading flight details...</Typography>
      </Box>
    );
  }

  if (!selectedFlight) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#EFF7FB',
          p: 2,
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Warning sx={{ fontSize: 64, color: '#DC2626', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            No Flight Selected
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Please search for and select a flight before proceeding with booking.
          </Typography>
          <GradientButton onClick={() => navigate('/')} startIcon={<Flight />}>
            Search Flights
          </GradientButton>
        </Container>
      </Box>
    );
  }

  const totalPrice = selectedFlight.price * passengers.length;

  return (
    <>
      <Box sx={{ minHeight: '100vh', bgcolor: '#EFF7FB', py: 8 }}>
        <Container maxWidth="md">
          {/* Back Button and Breadcrumbs */}
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{
                color: '#64748B',
                textTransform: 'none',
                fontWeight: 500,
                mb: 2,
                '&:hover': {
                  bgcolor: 'rgba(100, 116, 139, 0.1)',
                },
              }}
            >
              Back to Search Results
            </Button>

            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              sx={{ color: '#64748B', fontSize: '0.875rem' }}
            >
              <Link
                underline="hover"
                color="inherit"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
                sx={{ cursor: 'pointer' }}
              >
                Search Flights
              </Link>
              <Typography
                color="#1E293B"
                sx={{ fontWeight: 600, fontSize: '0.875rem' }}
              >
                Booking Details
              </Typography>
            </Breadcrumbs>
          </Box>

          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: '#1E293B', mb: 4 }}
          >
            Complete Your Booking
          </Typography>

          <Grid container spacing={4}>
            {/* Left Column: Flight & Passenger Details */}
            <Grid item xs={12} md={7}>
              {/* Flight Summary */}
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #E2E8F0',
                  mb: 4,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 2, color: '#1E293B' }}
                  >
                    Flight Summary
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {selectedFlight.airline}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 600, color: '#1E293B' }}
                      >
                        {selectedFlight.origin.code} → {selectedFlight.destination.code}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedFlight.origin.city} to {selectedFlight.destination.city}
                      </Typography>
                    </Box>
                    <Flight sx={{ fontSize: 40, color: '#3B82F6' }} />
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={6}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <CalendarToday sx={{ fontSize: 18, color: '#64748B' }} />
                      <Typography variant="body2" color="#64748B">
                        {formatDate(new Date(selectedFlight.departureTime))}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Schedule sx={{ fontSize: 18, color: '#64748B' }} />
                      <Typography variant="body2" color="#64748B">
                        {formatTime(new Date(selectedFlight.departureTime))} -{' '}
                        {formatTime(new Date(selectedFlight.arrivalTime))}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Passenger Details */}
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #E2E8F0',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: '#1E293B',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <People sx={{ color: '#3B82F6' }} /> Passenger Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {passengers.map((passenger, index) => (
                      <Box key={index}>
                        <Typography
                          sx={{ fontWeight: 500, mb: 2, color: '#1E293B' }}
                        >
                          Passenger {index + 1}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="First Name"
                              value={passenger.firstName}
                              onChange={(e) =>
                                handlePassengerChange(
                                  index,
                                  'firstName',
                                  e.target.value,
                                )
                              }
                              error={!!formErrors[`passenger${index}-firstName`]}
                              helperText={formErrors[`passenger${index}-firstName`]}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              value={passenger.lastName}
                              onChange={(e) =>
                                handlePassengerChange(
                                  index,
                                  'lastName',
                                  e.target.value,
                                )
                              }
                              error={!!formErrors[`passenger${index}-lastName`]}
                              helperText={formErrors[`passenger${index}-lastName`]}
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              type="date"
                              label="Date of Birth"
                              value={passenger.dateOfBirth}
                              onChange={(e) =>
                                handlePassengerChange(
                                  index,
                                  'dateOfBirth',
                                  e.target.value,
                                )
                              }
                              error={!!formErrors[`passenger${index}-dateOfBirth`]}
                              helperText={formErrors[`passenger${index}-dateOfBirth`]}
                              InputLabelProps={{ shrink: true }}
                              required
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column: Price Summary */}
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #E2E8F0',
                  position: 'sticky',
                  top: '2rem',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 2, color: '#1E293B' }}
                  >
                    Price Summary
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography color="text.secondary">
                      Base Fare ({passengers.length} x{' '}
                      {formatPrice(selectedFlight.price)})
                    </Typography>
                    <Typography color="text.secondary">
                      {formatPrice(totalPrice)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography color="text.secondary">Taxes & Fees</Typography>
                    <Typography color="text.secondary">
                      {formatPrice(0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: '#1E293B' }}
                    >
                      Total
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: '#3B82F6' }}
                    >
                      {formatPrice(totalPrice)}
                    </Typography>
                  </Box>

                  <GradientButton
                    fullWidth
                    size="large"
                    onClick={handleConfirmBooking}
                    disabled={loading}
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <CreditCard />
                      )
                    }
                    sx={{ height: 48 }}
                  >
                    {loading ? 'Processing...' : 'Confirm and Pay'}
                  </GradientButton>

                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => navigate('/')}
                    sx={{ mt: 2, color: '#64748B', textTransform: 'none' }}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>Confirm Your Booking</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Please review your booking details before proceeding with payment.
          </Alert>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Flight Details
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {selectedFlight.airline}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {selectedFlight.origin.code} ({selectedFlight.origin.city}) → {selectedFlight.destination.code} ({selectedFlight.destination.city})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(new Date(selectedFlight.departureTime))} |{' '}
              {formatTime(new Date(selectedFlight.departureTime))} -{' '}
              {formatTime(new Date(selectedFlight.arrivalTime))}
            </Typography>
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Passenger Details
          </Typography>
          {passengers.map((passenger, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Passenger {index + 1}
              </Typography>
              <Typography>
                {passenger.firstName} {passenger.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                DOB: {formatDate(new Date(passenger.dateOfBirth))}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Total Amount
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#3B82F6' }}>
              {formatPrice(totalPrice)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowConfirmation(false)}
            sx={{ color: '#64748B' }}
          >
            Back
          </Button>
          <GradientButton
            onClick={handleBooking}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <CreditCard />
              )
            }
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </GradientButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Booking;
