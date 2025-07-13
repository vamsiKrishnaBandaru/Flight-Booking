import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import { GradientButton } from './ui/GradientButton';

export function ConfirmationDialog({
    open,
    title,
    onClose,
    onConfirm,
    confirmLabel = 'Confirm',
    cancelLabel = 'Back',
    loading = false,
    loadingLabel = 'Processing...',
    confirmIcon,
    alertMessage,
    alertSeverity = 'info',
    children,
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>
            <DialogContent>
                {alertMessage && (
                    <Alert severity={alertSeverity} sx={{ mb: 3 }}>
                        {alertMessage}
                    </Alert>
                )}
                {children}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button
                    onClick={onClose}
                    sx={{ color: '#64748B' }}
                    disabled={loading}
                >
                    {cancelLabel}
                </Button>
                <GradientButton
                    onClick={onConfirm}
                    disabled={loading}
                    startIcon={
                        loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            confirmIcon
                        )
                    }
                >
                    {loading ? loadingLabel : confirmLabel}
                </GradientButton>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog; 