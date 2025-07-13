import React from 'react';
import { Autocomplete, TextField, Box, Typography } from '@mui/material';
import { Flight } from '@mui/icons-material';

export function AirportDropdown({
  value,
  onChange,
  placeholder,
  airports,
  disabled,
  excludeAirport,
}) {
  const filteredAirports = airports.filter(
    (airport) => !excludeAirport || airport.id !== excludeAirport.id,
  );

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      options={filteredAirports}
      getOptionLabel={(option) =>
        `${option.code} - ${option.city}, ${option.country}`
      }
      isOptionEqualToValue={(option, val) => option.id === val.id}
      disabled={disabled}
      renderOption={(props, option) => {
        const { key, ...restProps } = props;
        return (
          <Box component="li" key={key} {...restProps}>
            <Flight sx={{ mr: 2, transform: 'rotate(45deg)' }} />
            <Box>
              <Typography variant="body1">
                {option.code} - {option.city}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {option.name}
              </Typography>
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} placeholder={placeholder} variant="outlined" />
      )}
    />
  );
}
