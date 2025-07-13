import { Box, Grid, TextField, Typography } from '@mui/material';

export function PassengerForm({
  index,
  passenger,
  onChange,
  errors = {},
}) {
  const handleChange = (field, value) => {
    onChange(index, field, value);
  };

  return (
    <Box>
      <Typography sx={{ fontWeight: 500, mb: 2, color: '#1E293B' }}>
        Passenger {index + 1}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={passenger.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
            required
            inputProps={{
              maxLength: 50,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={passenger.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
            required
            inputProps={{
              maxLength: 50,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="date"
            label="Date of Birth"
            value={passenger.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            InputLabelProps={{ shrink: true }}
            required
            inputProps={{
              max: new Date().toISOString().split('T')[0],
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default PassengerForm; 