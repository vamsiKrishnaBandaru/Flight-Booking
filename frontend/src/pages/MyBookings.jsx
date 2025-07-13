import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  Flight,
  CalendarToday,
  Schedule,
  ConfirmationNumber,
  Person,
  Add,
  ErrorOutline,
} from '@mui/icons-material';
import { GradientButton } from '../components/ui/GradientButton';
import { bookingApi } from '../services/bookingService';

export function MyBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await bookingApi.list();
        setBookings(data.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const getStatusChip = (status) => {
    // Defensive check to prevent crash if status is missing
    if (!status) {
      status = 'unknown';
    }

    const styles = {
      confirmed: {
        bgColor: '#EBF4FF', // Lovable primary-light
        textColor: '#3B82F6', // Lovable primary
      },
      cancelled: {
        bgColor: '#FEE2E2', // Lovable danger-light
        textColor: '#DC2626', // Lovable danger
      },
    };
    const style = styles[status] || {
      bgColor: '#F1F5F9',
      textColor: '#475569',
    };

    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        size="small"
        sx={{
          bgcolor: style.bgColor,
          color: style.textColor,
          fontWeight: 600,
          borderRadius: '6px',
        }}
      />
    );
  };

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

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ErrorOutline sx={{ fontSize: 64, color: '#DC2626', mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Failed to load bookings
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {error}
        </Typography>
        <GradientButton onClick={() => navigate('/')}>
          Go to Homepage
        </GradientButton>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#EFF7FB', py: 8 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 6,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>
            My Bookings
          </Typography>
          <GradientButton
            size="large"
            startIcon={<Add />}
            onClick={() => navigate('/')}
          >
            Book New Flight
          </GradientButton>
        </Box>

        {bookings.length === 0 ? (
          <Card
            sx={{
              textAlign: 'center',
              py: { xs: 6, md: 10 },
              borderRadius: '16px',
              bgcolor: 'white',
              border: '1px solid #E2E8F0',
            }}
          >
            <CardContent>
              <Box
                component="img"
                src="/empty-state.svg"
                alt="No bookings"
                sx={{ height: 120, mb: 4, opacity: 0.7 }}
              />
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: '#1E293B', mb: 1 }}
              >
                No adventures yet!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}
              >
                Your booked flights will appear here. Let's find your next
                destination.
              </Typography>
              <GradientButton
                size="large"
                startIcon={<Flight />}
                onClick={() => navigate('/')}
              >
                Find a Flight
              </GradientButton>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {bookings.map((booking) => (
              <Grid item xs={12} key={booking.id}>
                <Card
                  sx={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={8}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: '#1E293B' }}
                          >
                            {booking.flight.origin?.code || 'N/A'} →{' '}
                            {booking.flight.destination?.code || 'N/A'}
                          </Typography>
                          {getStatusChip(booking.status)}
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            flexWrap: 'wrap',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              color: '#64748B',
                            }}
                          >
                            <CalendarToday sx={{ fontSize: 16 }} />
                            <Typography variant="body2">
                              {formatDate(booking.flight.departureTime)}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              color: '#64748B',
                            }}
                          >
                            <Schedule sx={{ fontSize: 16 }} />
                            <Typography variant="body2">
                              {formatTime(booking.flight.departureTime)}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              color: '#64748B',
                            }}
                          >
                            <Person sx={{ fontSize: 16 }} />
                            <Typography variant="body2">
                              {booking.passengers.length} Passenger(s)
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: { xs: 'flex-start', md: 'flex-end' },
                          gap: 1,
                        }}
                      >
                        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                          <Typography variant="body2" color="text.secondary">
                            Total Price
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: '#1E293B' }}
                          >
                            {formatPrice(booking.totalAmount)}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            navigate(`/bookings/${booking.id}`)
                          }
                          sx={{ mt: { xs: 1, md: 0 } }}
                        >
                          View Details
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default MyBookings;
