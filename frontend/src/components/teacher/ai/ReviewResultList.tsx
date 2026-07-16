import { Box, Typography, Chip, Card, CardContent, Link } from '@mui/material';
import { CheckCircle, Cancel, OpenInNew } from '@mui/icons-material';
import type { ResultSupervisorEntry } from '../../../types';

interface ReviewResultListProps {
  results: ResultSupervisorEntry[];
  selectedIds: Set<string>;
  onToggleSelect: (supervisorId: string) => void;
}

export default function ReviewResultList({ results, selectedIds, onToggleSelect }: ReviewResultListProps) {
  return (
    <Box sx={{ overflowY: 'auto', maxHeight: '60vh', pr: 0.5 }}>
      {results.map((entry) => {
        const isSelected = selectedIds.has(entry.supervisorId) || selectedIds.size === 0;
        const matchColor = entry.matchScore >= 0.7 ? 'success.main' : entry.matchScore >= 0.4 ? 'warning.main' : 'error.main';

        return (
          <Card
            key={entry.supervisorId}
            sx={{
              mb: 1,
              cursor: 'pointer',
              border: isSelected ? '2px solid #1976d2' : '2px solid transparent',
              opacity: isSelected ? 1 : 0.5,
              transition: 'all 0.2s',
            }}
            onClick={() => onToggleSelect(entry.supervisorId)}
          >
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              {/* 姓名 + 匹配度 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  {entry.supervisorName}
                </Typography>
                <Chip
                  label={`${Math.round(entry.matchScore * 100)}%`}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 22,
                    bgcolor: matchColor,
                    color: '#fff',
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* 学校 */}
              {entry.university && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  {entry.university}
                </Typography>
              )}

              {/* 匹配理由 */}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.4 }}>
                {entry.matchNotes}
              </Typography>

              {/* 选中标记 */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                {isSelected ? (
                  <CheckCircle fontSize="small" color="primary" />
                ) : (
                  <Cancel fontSize="small" color="disabled" />
                )}
              </Box>
            </CardContent>
          </Card>
        );
      })}

      {results.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          暂无 AI 搜索结果
        </Typography>
      )}
    </Box>
  );
}
