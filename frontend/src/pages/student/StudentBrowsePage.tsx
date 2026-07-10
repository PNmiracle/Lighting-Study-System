import { useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import { useStudentAssignments } from '../../hooks/useAssignments';
import ProgressBar from '../../components/student/ProgressBar';
import FilterTabs, { type FilterType } from '../../components/student/FilterTabs';
import SupervisorCard from '../../components/student/SupervisorCard';
import type { AssignmentDetail } from '../../types';
import { StudentIntent } from '../../types';

/**
 * 学生导师浏览页
 * 进度统计栏 + 筛选标签 + 导师卡片网格
 */
export default function StudentBrowsePage() {
  const { data: assignments, isLoading } = useStudentAssignments();
  const [filter, setFilter] = useState<FilterType>('ALL');

  // 计算各筛选标签的数量
  const counts = useMemo<Record<FilterType, number>>(() => {
    if (!assignments) return { ALL: 0, WANT_CONTACT: 0, BACKUP: 0, SKIP: 0, PENDING: 0 };
    return {
      ALL: assignments.length,
      WANT_CONTACT: assignments.filter((a) => a.studentIntent === StudentIntent.WANT_CONTACT).length,
      BACKUP: assignments.filter((a) => a.studentIntent === StudentIntent.BACKUP).length,
      SKIP: assignments.filter((a) => a.studentIntent === StudentIntent.SKIP).length,
      PENDING: assignments.filter((a) => !a.studentIntent).length,
    };
  }, [assignments]);

  // 按筛选条件过滤
  const filteredAssignments = useMemo<AssignmentDetail[]>(() => {
    if (!assignments) return [];
    if (filter === 'ALL') return assignments;
    if (filter === 'PENDING') return assignments.filter((a) => !a.studentIntent);
    return assignments.filter((a) => a.studentIntent === filter);
  }, [assignments, filter]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        我的导师推荐
      </Typography>

      {/* 进度统计栏 */}
      {assignments && <ProgressBar assignments={assignments} />}

      {/* 筛选标签 */}
      <Box sx={{ mt: 3, mb: 2 }}>
        <FilterTabs value={filter} onChange={setFilter} counts={counts} />
      </Box>

      {/* 导师卡片网格 */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : filteredAssignments.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">
            {assignments && assignments.length > 0 ? '该筛选条件下暂无导师' : '老师还未为您推荐导师'}
          </Typography>
          {assignments && assignments.length > 0 && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              请尝试切换筛选条件
            </Typography>
          )}
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredAssignments.map((assignment) => (
            <Grid item xs={12} sm={6} md={4} key={assignment.id}>
              <SupervisorCard assignment={assignment} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
