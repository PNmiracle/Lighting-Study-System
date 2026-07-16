import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

/**
 * 通用确认弹窗
 */
interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'error' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = '确认操作',
  content,
  confirmText = '确认',
  cancelText = '取消',
  confirmColor = 'primary',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <WarningAmber color={confirmColor === 'error' ? 'error' : 'warning'} fontSize="small" />
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} color="inherit" variant="text">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
