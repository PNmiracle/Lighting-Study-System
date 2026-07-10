import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { supervisorsApi } from '../../api/supervisors';
import type { Supervisor } from '../../types';
import { debounce, formatRanking } from '../../utils/helpers';

interface SupervisorSearchPanelProps {
  onSelect: (supervisor: Supervisor) => void;
  selectedId?: string;
}

/**
 * 导师搜索面板
 * 支持模糊搜索（debounce 300ms）
 */
export default function SupervisorSearchPanel({ onSelect, selectedId }: SupervisorSearchPanelProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((q: string) => setDebouncedQuery(q), 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const { data, isLoading } = useQuery({
    queryKey: ['supervisor-search', debouncedQuery],
    queryFn: () =>
      supervisorsApi.search({
        q: debouncedQuery || undefined,
        pageSize: 50,
        sortBy: 'name',
        sortOrder: 'asc',
      }),
  });

  const supervisors = data?.items || [];

  return (
    <Box>
      <TextField
        fullWidth
        size="small"
        placeholder="搜索导师姓名、学校、研究方向..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : supervisors.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            {debouncedQuery ? '未找到匹配的导师' : '输入关键词搜索导师'}
          </Typography>
        ) : (
          <List dense disablePadding>
            {supervisors.map((supervisor) => (
              <ListItemButton
                key={supervisor.id}
                onClick={() => onSelect(supervisor)}
                selected={selectedId === supervisor.id}
                divider
                sx={{ py: 1 }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {supervisor.name}
                      </Typography>
                      {supervisor.title && (
                        <Chip label={supervisor.title} size="small" variant="outlined" sx={{ height: 20 }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary" component="span">
                      {supervisor.university || '未知学校'} · QS {formatRanking(supervisor.qsRanking)} ·{' '}
                      {supervisor.researchArea || '未填写方向'}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
