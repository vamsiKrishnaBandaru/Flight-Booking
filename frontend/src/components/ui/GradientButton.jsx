import React from 'react';
import { Button } from '@mui/material';

export const GradientButton = (props) => {
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        background: 'linear-gradient(to right, #3B82F6, #7DD3FC)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        textTransform: 'none',
        fontWeight: 600,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
          background: 'linear-gradient(to right, #3B82F6, #7DD3FC)', // Keep gradient on hover
          transform: 'scale(1.02)',
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
        ...props.sx, // Allow overriding styles
      }}
    />
  );
};
