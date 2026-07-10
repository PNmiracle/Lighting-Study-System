import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Group, Person, School, Assignment as AssignmentIcon, TrendingUp } from '@mui/icons-material';
import type { StatsOverview } from '../../types';

interface StatCardsProps {
  stats: StatsOverview | undefined;
}

/**
 * 统计卡片组
 * 学生数 / 老师数 / 导师数 / 平均推荐数 / 反馈率
 */
export default function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      label: '学生总数',
      value: stats?.totalStudents ?? 0,
      icon: <Group />,
      color: '#1976d2',
      bgColor: '#e3f2fd',
    },
    {
      label: '老师总数',
      value: stats?.totalTeachers ?? 0,
      icon: <Person />,
      color: '#7b1fa2',
      bgColor: '#f3e5f5',
    },
    {
      label: '导师库规模',
      value: stats?.totalSupervisors ?? 0,
      icon: <School />,
      color: '#2e7d32',
      bgColor: '#e8f5e9',
    },
    {
      label: '推荐记录总数',
      value: stats?.totalAssignments ?? 0,
      icon: <AssignmentIcon />,
      color: '#e65100',
      bgColor: '#fff3e0',
    },
    {
      label: '平均推荐数',
      value: stats?.avgAssignmentsPerStudent ?? 0,
      icon: <TrendingUp />,
      color: '#00838f',
      bgColor: '#e0f7fa',
      suffix: '条/人',
    },
    {
      label: '学生反馈率',
      value: stats?.feedbackRate ?? 0,
      icon: <TrendingUp />,
      color: '#c62828',
      bgColor: '#ffebee',
      suffix: '%',
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid item xs={6} sm={4} md={2} key={card.label}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: card.bgColor,
                  color: card.color,
                  mb: 1,
                }}
              >
                {card.icon}
              </Box>
              <Typography variant="h5" fontWeight={700} sx={{ color: card.color }}>
                {card.value}
                {card.suffix && (
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    {card.suffix}
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
