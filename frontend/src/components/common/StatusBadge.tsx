import { Chip } from '@mui/material';
import { FeedbackStatus } from '../../types';
import { FEEDBACK_STATUS_LABELS, FEEDBACK_STATUS_COLORS } from '../../utils/constants';

/**
 * 状态徽章组件
 * 显示学生的反馈状态：搜索中 / 待反馈 / 已反馈
 */
interface StatusBadgeProps {
  status: FeedbackStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const label = FEEDBACK_STATUS_LABELS[status] || status;
  const color = FEEDBACK_STATUS_COLORS[status] || 'default';

  return (
    <Chip
      label={label}
      size="small"
      color={color}
      variant="outlined"
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        borderWidth: 1.5,
      }}
    />
  );
}
