import { Box, Container, Typography } from '@mui/material';
import { Warning } from '@mui/icons-material';
import { GradientButton } from './GradientButton';

export function ErrorState({
  title = 'An Error Occurred',
  message = 'Something went wrong. Please try again.',
  actionLabel = 'Go Back',
  actionIcon,
  onAction,
  fullHeight = true,
}) {
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
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Warning sx={{ fontSize: 64, color: '#DC2626', mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {message}
        </Typography>
        {onAction && (
          <GradientButton
            onClick={onAction}
            startIcon={actionIcon}
          >
            {actionLabel}
          </GradientButton>
        )}
      </Container>
    </Box>
  );
}

export default ErrorState; 