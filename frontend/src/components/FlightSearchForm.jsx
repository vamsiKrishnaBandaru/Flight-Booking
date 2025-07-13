import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Chip,
  InputAdornment,
  IconButton,
  CircularProgress,
  Popover,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  CalendarMonth,
  People,
  SwapHoriz,
  Search,
  DirectionsCar,
  CalendarToday,
  FlightClass,
} from '@mui/icons-material';
import { GradientButton } from './ui/GradientButton';
import { AirportDropdown } from './ui/AirportDropdown';
import { getAirportsData } from '../store/actions/airportActions';
import {
  getAirports,
  getAirportsLoading,
} from '../store/selectors/airportSelectors';
import { getFlightsLoading } from '../store/selectors/flightSelectors';
import { useToast } from '../context/ToastContext';

export function FlightSearchForm({ onSearch }) {
  const dispatch = useDispatch();
  const { showError } = useToast();

  // Redux state
  const airports = useSelector(getAirports);
  const loadingAirports = useSelector(getAirportsLoading);
  const loadingFlights = useSelector(getFlightsLoading);

  // Local form state
  const [formData, setFormData] = useState({
    origin: null,
    destination: null,
    departureDate: '',
    returnDate: '',
    passengers: { adults: 1, children: 0, infants: 0 },
    cabinClass: 'economy',
    tripType: 'round-trip',
  });

  // Load airports when component mounts - Redux approach
  useEffect(() => {
    dispatch(getAirportsData());
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.origin || !formData.destination) {
      showError('Please select both origin and destination airports');
      return;
    }

    if (!formData.departureDate) {
      showError('Please select a departure date');
      return;
    }

    if (formData.tripType === 'round-trip' && !formData.returnDate) {
      showError('Please select a return date for round trip');
      return;
    }

    // Pass IDs instead of codes or full objects
    onSearch({
      originId: formData.origin?.id,
      destinationId: formData.destination?.id,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate,
      passengers: formData.passengers,
      cabinClass: formData.cabinClass,
      tripType: formData.tripType,
    });
  };

  const swapLocations = () => {
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  // State for the passenger popover
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePassengerClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePassengerClose = () => {
    setAnchorEl(null);
  };

  const handlePassengerChange = (type, change) => {
    const currentPassengers = { ...formData.passengers };
    const newValue = currentPassengers[type] + change;

    if (type === 'adults' && newValue >= 1 && newValue <= 9) {
      currentPassengers[type] = newValue;
    } else if (type === 'children' && newValue >= 0 && newValue <= 9) {
      currentPassengers[type] = newValue;
    }

    handleInputChange('passengers', currentPassengers);
  };

  const totalPassengers =
    formData.passengers.adults + formData.passengers.children;
  const open = Boolean(anchorEl);
  const id = open ? 'passenger-popover' : undefined;

  return (
    <Card
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #E2E8F0',
        mb: 4,
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Trip Type Selection */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <GradientButton
            onClick={() => handleInputChange('tripType', 'round-trip')}
            sx={
              formData.tripType === 'round-trip'
                ? {
                    height: '36px',
                    px: 2,
                    py: 1,
                    fontSize: '0.875rem',
                  }
                : {
                    background: '#FFFFFF',
                    color: '#64748B',
                    border: '1px solid #E2E8F0',
                    boxShadow: 'none',
                    height: '36px',
                    px: 2,
                    py: 1,
                    fontSize: '0.875rem',
                    '&:hover': {
                      bgcolor: '#F8FAFC',
                      borderColor: '#CBD5E1',
                      background: '#F8FAFC',
                      boxShadow: 'none',
                    },
                  }
            }
          >
            Round Trip
          </GradientButton>
          <GradientButton
            onClick={() => handleInputChange('tripType', 'one-way')}
            sx={
              formData.tripType === 'one-way'
                ? {
                    height: '36px',
                    px: 2,
                    py: 1,
                    fontSize: '0.875rem',
                  }
                : {
                    background: '#FFFFFF',
                    color: '#64748B',
                    border: '1px solid #E2E8F0',
                    boxShadow: 'none',
                    height: '36px',
                    px: 2,
                    py: 1,
                    fontSize: '0.875rem',
                    '&:hover': {
                      bgcolor: '#F8FAFC',
                      borderColor: '#CBD5E1',
                      background: '#F8FAFC',
                      boxShadow: 'none',
                    },
                  }
            }
          >
            One Way
          </GradientButton>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* Main Row: All 4 fields in a single row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                lg:
                  formData.tripType === 'round-trip'
                    ? '1fr auto 1fr 0.7fr 0.7fr'
                    : '1fr auto 1fr 1fr',
              },
              gap: 2,
              alignItems: 'flex-end',
            }}
          >
            {/* From */}
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, mb: 1, color: '#1E293B' }}
              >
                From
              </Typography>
              <AirportDropdown
                value={formData.origin}
                onChange={(airport) => handleInputChange('origin', airport)}
                placeholder="Origin city or airport"
                airports={airports}
                disabled={loadingAirports}
                excludeAirport={formData.destination}
              />
            </Box>

            {/* Swap Button */}
            <IconButton
              onClick={swapLocations}
              disabled={loadingAirports}
              sx={{
                mb: '4px',
                bgcolor: '#3B82F6',
                color: 'white',
                '&:hover': { bgcolor: '#2563EB' },
              }}
            >
              <SwapHoriz />
            </IconButton>

            {/* To */}
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, mb: 1, color: '#1E293B' }}
              >
                To
              </Typography>
              <AirportDropdown
                value={formData.destination}
                onChange={(airport) =>
                  handleInputChange('destination', airport)
                }
                placeholder="Destination city or airport"
                airports={airports}
                disabled={loadingAirports}
                excludeAirport={formData.origin}
              />
            </Box>

            {/* Departure */}
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, mb: 1, color: '#1E293B' }}
              >
                Departure
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={formData.departureDate}
                onChange={(e) =>
                  handleInputChange('departureDate', e.target.value)
                }
                placeholder="dd/mm/yyyy"
              />
            </Box>

            {/* Return */}
            {formData.tripType === 'round-trip' && (
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, mb: 1, color: '#1E293B' }}
                >
                  Return
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) =>
                    handleInputChange('returnDate', e.target.value)
                  }
                  placeholder="dd/mm/yyyy"
                />
              </Box>
            )}
          </Box>

          {/* Second Row: Passengers, Cabin Class, Search */}
          <Grid container spacing={2} sx={{ mt: 2 }} alignItems="flex-end">
            <Grid item xs={12} sm={4}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, mb: 1, color: '#1E293B' }}
              >
                Passengers
              </Typography>
              <Button
                aria-describedby={id}
                variant="outlined"
                fullWidth
                onClick={handlePassengerClick}
                sx={{
                  justifyContent: 'flex-start',
                  py: '15.5px',
                  color: '#1E293B',
                  borderColor: '#CBD5E1',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#3B82F6',
                    bgcolor: '#EFF6FF',
                  },
                }}
                startIcon={<People sx={{ color: '#64748B' }} />}
              >
                {totalPassengers} Passenger{totalPassengers !== 1 ? 's' : ''}
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handlePassengerClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <Box sx={{ p: 2, width: 280 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography>Adults</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handlePassengerChange('adults', -1)}
                        disabled={formData.passengers.adults <= 1}
                      >
                        -
                      </IconButton>
                      <Typography>{formData.passengers.adults}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handlePassengerChange('adults', 1)}
                      >
                        +
                      </IconButton>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography>Children</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handlePassengerChange('children', -1)}
                        disabled={formData.passengers.children <= 0}
                      >
                        -
                      </IconButton>
                      <Typography>{formData.passengers.children}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handlePassengerChange('children', 1)}
                      >
                        +
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Popover>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, mb: 1, color: '#1E293B' }}
              >
                Cabin Class
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.cabinClass}
                  onChange={(e) =>
                    handleInputChange('cabinClass', e.target.value)
                  }
                >
                  <MenuItem value="economy">Economy</MenuItem>
                  <MenuItem value="premium-economy">Premium Economy</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="first">First Class</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <GradientButton
                type="submit"
                fullWidth
                size="large"
                startIcon={<Search />}
                disabled={loadingAirports || loadingFlights}
                sx={{ height: '56px', fontSize: '1rem' }}
              >
                {loadingFlights ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Search Flights'
                )}
              </GradientButton>
            </Grid>
          </Grid>

          {/* Third Row: Filters */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
              mt: 4,
            }}
          >
            <Chip label="Direct flights only" variant="outlined" size="small" />
            <Chip label="Flexible dates" variant="outlined" size="small" />
            <Chip label="Book with miles" variant="outlined" size="small" />
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
