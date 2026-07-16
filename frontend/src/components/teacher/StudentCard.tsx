import { Card, CardContent, Typography, Box } from '@mui/material';
import { Person } from '@mui/icons-material';
import StatusBadge from '../common/StatusBadge';
import type { StudentSummary } from '../../types';

interface StudentCardProps {
  student: StudentSummary;
  selected: boolean;
  onClick: () => void;
}

/**
 * 学生卡片
 * 显示姓名 + 导师数 + 状态徽章
 */
export default function StudentCard({ student, selected, onClick }: StudentCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: selected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        bgcolor: selected ? '#e3f2fd' : '#fff',
        '&:hover': {
          borderColor: '#1976d2',
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
        },
      }}
    >
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Person fontSize="small" color="action" />
          <Typography variant="body1" fontWeight={600} noWrap>
            {student.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            {student.assignmentCount} 位导师
          </Typography>
          <StatusBadge status={student.feedbackStatus} />
        </Box>
      </CardContent>
    </Card>
  );
}
