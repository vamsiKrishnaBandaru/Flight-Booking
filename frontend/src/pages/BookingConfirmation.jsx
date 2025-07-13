import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatTime, formatDate, formatPrice } from '../utils/formatters';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle,
  Flight,
  CalendarToday,
  Schedule,
  Person,
  Home,
  Print,
  Mail,
  ErrorOutline,
} from '@mui/icons-material';
import { GradientButton } from '../components/ui/GradientButton';
import { bookingApi } from '../services/bookingService';

export function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function will be called by the effect
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const response = await bookingApi.get(bookingId);
        setBooking(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch booking details.');
      } finally {
        setLoading(false);
      }
    };

    // We only fetch when we have a valid bookingId.
    if (bookingId) {
      fetchBooking();
    }
    // The backend endpoint is protected by RLS, so we don't need to check for user here.
    // We only need to re-fetch if the ID in the URL changes.
  }, [bookingId]);

  if (loading) {
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
      </Box>
    );
  }

  if (error || !booking) {
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
          <ErrorOutline sx={{ fontSize: 64, color: '#DC2626', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Failed to load booking
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            {error || 'The booking could not be found.'}
          </Typography>
          <GradientButton onClick={() => navigate('/')} startIcon={<Home />}>
            Go to Homepage
          </GradientButton>
        </Container>
      </Box>
    );
  }

  const flight = booking.flight;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#EFF7FB', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        {/* Confirmation Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <CheckCircle sx={{ fontSize: 64, color: '#16A34A', mb: 2 }} />
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}
          >
            Booking Confirmed!
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748B', mb: 2 }}>
            Your e-ticket and itinerary have been sent to your email.
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Booking ID:{' '}
            <Box
              component="span"
              sx={{ color: '#3B82F6', fontFamily: 'monospace' }}
            >
              {booking.id}
            </Box>
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 6 }}>
          <Button variant="outlined" startIcon={<Print />}>
            Print Ticket
          </Button>
          <GradientButton startIcon={<Mail />}>Email Itinerary</GradientButton>
        </Box>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Left Column: Flight Details */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #E2E8F0',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: '#1E293B', mb: 3 }}
                >
                  Flight Details
                </Typography>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
                >
                  <Flight sx={{ color: '#3B82F6' }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#1E293B' }}>
                      {flight.origin.code} → {flight.destination.code}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flight.airline}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={6}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <CalendarToday sx={{ fontSize: 18, color: '#64748B' }} />
                    <Typography variant="body2" color="#64748B">
                      {formatDate(flight.departureTime)}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Schedule sx={{ fontSize: 18, color: '#64748B' }} />
                    <Typography variant="body2" color="#64748B">
                      {formatTime(flight.departureTime)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Passenger & Price */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #E2E8F0',
                mb: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: '#1E293B', mb: 2 }}
                >
                  Passengers
                </Typography>
                <List sx={{ p: 0 }}>
                  {booking.passengers.map((passenger, index) => (
                    <ListItem key={index} disableGutters>
                      <Person sx={{ color: '#64748B', mr: 1.5 }} />
                      <ListItemText
                        primary={passenger.fullName}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
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
                  sx={{ fontWeight: 600, color: '#1E293B', mb: 2 }}
                >
                  Total Price
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: '#3B82F6' }}
                >
                  {formatPrice(booking.totalAmount)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="text"
            onClick={() => navigate('/')}
            startIcon={<Home />}
          >
            Back to Homepage
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default BookingConfirmation;
