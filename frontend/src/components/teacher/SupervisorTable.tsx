import { useState } from 'react';
import {
  Box,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Typography,
} from '@mui/material';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit, Delete, Lock } from '@mui/icons-material';
import type { AssignmentDetail } from '../../types';
import { MatchLevel, StudentIntent } from '../../types';
import { formatRanking, truncateText } from '../../utils/helpers';
import ConfirmDialog from '../common/ConfirmDialog';
import { useDeleteAssignment, useUnlockIntent } from '../../hooks/useAssignments';
import { toast } from 'sonner';

interface SupervisorTableProps {
  assignments: AssignmentDetail[];
  loading: boolean;
  onEdit: (assignment: AssignmentDetail) => void;
}

/**
 * 导师紧凑表格（MUI DataGrid）
 * 列：导师姓名 / 学校 / QS / USNEWS / 院系 / 备注 / 意向 / 操作
 */
export default function SupervisorTable({ assignments, loading, onEdit }: SupervisorTableProps) {
  const deleteAssignment = useDeleteAssignment();
  const unlockIntent = useUnlockIntent();
  const [confirmDelete, setConfirmDelete] = useState<AssignmentDetail | null>(null);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteAssignment.mutateAsync(confirmDelete.id);
      setConfirmDelete(null);
    } catch {
      // handled by interceptor
    }
  };

  const handleUnlock = async (id: string) => {
    try {
      await unlockIntent.mutateAsync(id);
    } catch {
      // handled by interceptor
    }
  };

  const getIntentChip = (assignment: AssignmentDetail) => {
    if (!assignment.studentIntent) {
      return <Chip label="未标记" size="small" variant="outlined" sx={{ color: '#9e9e9e' }} />;
    }

    const colors: Record<string, { bg: string; color: string }> = {
      [StudentIntent.WANT_CONTACT]: { bg: '#e8f5e9', color: '#2e7d32' },
      [StudentIntent.BACKUP]: { bg: '#fff3e0', color: '#ed6c02' },
      [StudentIntent.SKIP]: { bg: '#f5f5f5', color: '#9e9e9e' },
    };

    const c = colors[assignment.studentIntent] || { bg: '#f5f5f5', color: '#9e9e9e' };

    return (
      <Chip
        label={assignment.intentLabel}
        size="small"
        sx={{ bgcolor: c.bg, color: c.color, fontWeight: 600 }}
      />
    );
  };

  const getMatchLevelChip = (matchLevel: MatchLevel | null) => {
    if (!matchLevel) return <Typography variant="body2" color="text.disabled">-</Typography>;
    const colors: Record<string, { bg: string; color: string }> = {
      [MatchLevel.HIGH]: { bg: '#e8f5e9', color: '#2e7d32' },
      [MatchLevel.MEDIUM]: { bg: '#fff3e0', color: '#ed6c02' },
    };
    const c = colors[matchLevel];
    return (
      <Chip
        label={matchLevel === MatchLevel.HIGH ? '建议多看看' : '可以备选'}
        size="small"
        sx={{ bgcolor: c.bg, color: c.color, fontWeight: 600 }}
      />
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: '导师姓名',
      width: 140,
      valueGetter: (_, row) => (row as AssignmentDetail).supervisor.name,
    },
    {
      field: 'university',
      headerName: '学校',
      width: 160,
      valueGetter: (_, row) => (row as AssignmentDetail).supervisor.university || '-',
    },
    {
      field: 'qsRanking',
      headerName: 'QS',
      width: 70,
      valueGetter: (_, row) => formatRanking((row as AssignmentDetail).supervisor.qsRanking),
    },
    {
      field: 'usnewsRanking',
      headerName: 'USNEWS',
      width: 80,
      valueGetter: (_, row) => formatRanking((row as AssignmentDetail).supervisor.usnewsRanking),
    },
    {
      field: 'department',
      headerName: '院系',
      width: 140,
      valueGetter: (_, row) => truncateText((row as AssignmentDetail).supervisor.department, 20),
    },
    {
      field: 'matchLevel',
      headerName: '匹配度',
      width: 110,
      renderCell: (params) => {
        const assignment = params.row as AssignmentDetail;
        return getMatchLevelChip(assignment.matchLevel);
      },
    },
    {
      field: 'notes',
      headerName: '备注',
      width: 200,
      valueGetter: (_, row) => truncateText((row as AssignmentDetail).notes, 40),
    },
    {
      field: 'intent',
      headerName: '意向',
      width: 100,
      renderCell: (params) => getIntentChip(params.row as AssignmentDetail),
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 120,
      type: 'actions',
      getActions: (params) => {
        const assignment = params.row as AssignmentDetail;
        const actions: React.ReactElement[] = [
          <GridActionsCellItem
            icon={<Edit fontSize="small" />}
            label="编辑"
            onClick={() => onEdit(assignment)}
          />,
          <GridActionsCellItem
            icon={<Delete fontSize="small" />}
            label="删除"
            onClick={() => setConfirmDelete(assignment)}
            color="error"
          />,
        ];

        if (assignment.intentLocked) {
          actions.push(
            <GridActionsCellItem
              icon={
                <Tooltip title="解锁意向">
                  <Lock fontSize="small" color="warning" />
                </Tooltip>
              }
              label="解锁"
              onClick={() => handleUnlock(assignment.id)}
            />
          );
        }

        return actions;
      },
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={assignments}
        columns={columns}
        getRowId={(row) => (row as AssignmentDetail).id}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{
          '& .MuiDataGrid-cell': { py: 0.5 },
          '& .MuiDataGrid-columnHeader': { bgcolor: '#f5f5f5' },
        }}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="删除推荐记录"
        content={`确定要删除「${confirmDelete?.supervisor.name}」的推荐记录吗？此操作不可撤销。`}
        confirmText="删除"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </Box>
  );
}
