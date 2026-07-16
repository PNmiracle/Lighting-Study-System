import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import StatCards from '../../components/admin/StatCards';
import TeacherManageTab from '../../components/admin/TeacherManageTab';
import StudentManageTab from '../../components/admin/StudentManageTab';
import client from '../../api/client';
import type { StatsOverview } from '../../types';

/**
 * 管理员控制台
 * 统计概览 + 老师管理 Tab + 学生管理 Tab
 */
export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);

  const { data: stats, isLoading } = useQuery<StatsOverview>({
    queryKey: ['stats-overview'],
    queryFn: () => client.get('/stats/overview'),
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        管理员控制台
      </Typography>

      {/* 统计概览 */}
      {isLoading ? (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ mb: 3 }}>
          <StatCards stats={stats} />
        </Box>
      )}

      {/* Tab 切换 */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
          >
            <Tab label="老师管理" />
            <Tab label="学生管理" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tabValue === 0 && <TeacherManageTab />}
            {tabValue === 1 && <StudentManageTab />}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
