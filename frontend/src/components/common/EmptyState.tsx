import { Box, Typography, Button } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

/**
 * 空状态占位组件
 */
export default function EmptyState({
  title = '暂无数据',
  description = '',
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Box sx={{ color: 'text.disabled', mb: 2 }}>
        {icon || <InboxOutlined sx={{ fontSize: 64 }} />}
      </Box>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 2 }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} size="small">
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
