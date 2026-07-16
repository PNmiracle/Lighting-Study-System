import { Button, Box } from '@mui/material';
import { CheckCircle, Star, SkipNext } from '@mui/icons-material';
import type { AssignmentDetail } from '../../types';
import { StudentIntent } from '../../types';
import { useMarkIntent } from '../../hooks/useAssignments';

interface IntentButtonsProps {
  assignment: AssignmentDetail;
}

/**
 * 三态意向按钮组件
 * 想联系 / 备选 / 跳过
 * 锁定后按钮全部禁用，高亮当前选择
 * 跳过不锁定，可改
 */
export default function IntentButtons({ assignment }: IntentButtonsProps) {
  const markIntent = useMarkIntent();

  const handleClick = (intent: StudentIntent) => {
    if (assignment.intentLocked) return;
    markIntent.mutate({ id: assignment.id, intent });
  };

  const isLocked = assignment.intentLocked;
  const currentIntent = assignment.studentIntent;

  const buttons = [
    {
      intent: StudentIntent.WANT_CONTACT,
      label: '想联系',
      icon: <CheckCircle fontSize="small" />,
      color: '#2e7d32',
      bgColor: '#e8f5e9',
      active: currentIntent === StudentIntent.WANT_CONTACT,
    },
    {
      intent: StudentIntent.BACKUP,
      label: '备选',
      icon: <Star fontSize="small" />,
      color: '#ed6c02',
      bgColor: '#fff3e0',
      active: currentIntent === StudentIntent.BACKUP,
    },
    {
      intent: StudentIntent.SKIP,
      label: '跳过',
      icon: <SkipNext fontSize="small" />,
      color: '#9e9e9e',
      bgColor: '#f5f5f5',
      active: currentIntent === StudentIntent.SKIP,
    },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {buttons.map((btn) => {
        const isActive = btn.active;
        const isDisabled = isLocked && !isActive;

        return (
          <Button
            key={btn.intent}
            size="small"
            startIcon={btn.icon}
            variant={isActive ? 'contained' : 'outlined'}
            disabled={isDisabled || markIntent.isPending}
            onClick={() => handleClick(btn.intent)}
            sx={{
              minWidth: 90,
              borderColor: btn.color,
              color: isActive ? '#fff' : btn.color,
              bgcolor: isActive ? btn.color : 'transparent',
              '&:hover': {
                bgcolor: isActive ? btn.color : btn.bgColor,
                borderColor: btn.color,
              },
              '&.Mui-disabled': {
                bgcolor: isActive ? btn.color : 'transparent',
                color: isActive ? '#fff' : '#bdbdbd',
                borderColor: isActive ? btn.color : '#e0e0e0',
                opacity: isActive ? 1 : 0.5,
              },
            }}
          >
            {btn.label}
          </Button>
        );
      })}
    </Box>
  );
}
