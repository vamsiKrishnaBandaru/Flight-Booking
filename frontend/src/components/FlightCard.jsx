import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  Flight,
  AccessTime,
  FlightTakeoff,
  FlightLand,
} from '@mui/icons-material';

const FlightCard = ({ flight, onSelect }) => {
  const formatTime = (time) => {
    if (!time) return '--:--';
    try {
      return new Date(time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return '--:--';
    }
  };

  const formatDate = (time) => {
    if (!time) return '';
    try {
      return new Date(time).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const calculateDuration = (departure, arrival) => {
    if (!departure || !arrival) return '--h --m';
    try {
      const diff = new Date(arrival) - new Date(departure);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } catch {
      return '--h --m';
    }
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return '$--';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Safe property access with fallbacks
  const airline = flight?.airline || 'Unknown Airline';
  const flightNumber = flight?.flightNumber || 'N/A';
  const originCode = flight?.origin?.code || 'N/A';
  const destinationCode = flight?.destination?.code || 'N/A';
  const originCity = flight?.origin?.city || 'Unknown';
  const destinationCity = flight?.destination?.city || 'Unknown';
  const cabinClass = flight?.cabinClass || 'Economy';
  const availableSeats = flight?.availableSeats || 0;
  const departureTime = flight?.departureTime;
  const arrivalTime = flight?.arrivalTime;
  const price = flight?.price || 0;

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderColor: '#1976d2',
        },
        cursor: 'pointer',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left: Airline & Flight Info */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              minWidth: 200,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: '#1976d2',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Flight sx={{ color: 'white', fontSize: 18 }} />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: '#333' }}
              >
                {airline}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                {flightNumber}
              </Typography>
            </Box>
          </Box>

          {/* Center: Flight Route & Times */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              flex: 1,
              mx: 3,
            }}
          >
            {/* Departure */}
            <Box sx={{ textAlign: 'left', minWidth: 80 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: '#333', lineHeight: 1 }}
              >
                {formatTime(departureTime)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: '#333' }}
              >
                {originCode}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                {originCity}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#999', display: 'block' }}
              >
                {formatDate(departureTime)}
              </Typography>
            </Box>

            {/* Flight Path */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                position: 'relative',
              }}
            >
              <FlightTakeoff sx={{ color: '#1976d2', fontSize: 16 }} />
              <Box
                sx={{
                  flex: 1,
                  height: 2,
                  bgcolor: '#e0e0e0',
                  mx: 1,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: 'white',
                    px: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: '#666', fontSize: '0.7rem' }}
                  >
                    {calculateDuration(departureTime, arrivalTime)}
                  </Typography>
                </Box>
              </Box>
              <FlightLand sx={{ color: '#1976d2', fontSize: 16 }} />
            </Box>

            {/* Arrival */}
            <Box sx={{ textAlign: 'right', minWidth: 80 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: '#333', lineHeight: 1 }}
              >
                {formatTime(arrivalTime)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: '#333' }}
              >
                {destinationCode}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                {destinationCity}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#999', display: 'block' }}
              >
                {formatDate(arrivalTime)}
              </Typography>
            </Box>
          </Box>

          {/* Right: Price & Action */}
          <Box sx={{ textAlign: 'right', minWidth: 150 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: '#1976d2', mb: 0.5 }}
            >
              {formatPrice(price)}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#666', display: 'block', mb: 1 }}
            >
              per person • {cabinClass}
            </Typography>

            {flight?.isNearbyDate && (
              <Chip
                label="Alternative Date"
                size="small"
                sx={{
                  bgcolor: '#fff3cd',
                  color: '#856404',
                  fontSize: '0.7rem',
                  height: 20,
                  mb: 1,
                }}
              />
            )}

            {availableSeats <= 5 && availableSeats > 0 && (
              <Typography
                variant="caption"
                sx={{ color: '#d32f2f', display: 'block', mb: 1 }}
              >
                Only {availableSeats} left
              </Typography>
            )}

            <Button
              variant="contained"
              size="small"
              onClick={() => onSelect(flight)}
              sx={{
                bgcolor: '#1976d2',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1,
                px: 3,
                py: 0.8,
                '&:hover': {
                  bgcolor: '#1565c0',
                },
              }}
            >
              Select Flight
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FlightCard;
