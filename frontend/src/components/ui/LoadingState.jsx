import { Box, CircularProgress, Typography } from '@mui/material';

export function LoadingState({ message = 'Loading...', fullHeight = true }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullHeight ? '100vh' : 'auto',
        bgcolor: '#EFF7FB',
        p: 2,
      }}
    >
      <CircularProgress size={24} />
      {message && <Typography sx={{ ml: 2 }}>{message}</Typography>}
    </Box>
  );
}

export default LoadingState; 