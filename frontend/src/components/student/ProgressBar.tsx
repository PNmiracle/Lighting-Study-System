import { Box, Typography } from '@mui/material';
import { CheckCircle, Star, Search as SearchIcon } from '@mui/icons-material';
import type { AssignmentDetail } from '../../types';
import { StudentIntent } from '../../types';

interface ProgressBarProps {
  assignments: AssignmentDetail[];
}

/**
 * 进度统计栏
 * 想联系 X / 备选 Y / 待查看 Z
 */
export default function ProgressBar({ assignments }: ProgressBarProps) {
  const wantContact = assignments.filter((a) => a.studentIntent === StudentIntent.WANT_CONTACT).length;
  const backup = assignments.filter((a) => a.studentIntent === StudentIntent.BACKUP).length;
  const pending = assignments.filter((a) => !a.studentIntent).length;
  const skip = assignments.filter((a) => a.studentIntent === StudentIntent.SKIP).length;

  const items = [
    { label: '想联系', count: wantContact, color: '#2e7d32', bgColor: '#e8f5e9', icon: <CheckCircle /> },
    { label: '备选', count: backup, color: '#ed6c02', bgColor: '#fff3e0', icon: <Star /> },
    { label: '待查看', count: pending, color: '#1976d2', bgColor: '#e3f2fd', icon: <SearchIcon /> },
    { label: '暂不考虑', count: skip, color: '#9e9e9e', bgColor: '#f5f5f5', icon: <SearchIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: 2,
            bgcolor: item.bgColor,
          }}
        >
          <Box sx={{ color: item.color, display: 'flex', alignItems: 'center' }}>{item.icon}</Box>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: item.color, lineHeight: 1 }}>
              {item.count}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.label}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
