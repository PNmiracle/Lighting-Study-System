import { Box, Skeleton } from '@mui/material';

interface LoadingSkeletonProps {
  type?: 'table' | 'cards' | 'page';
  rows?: number;
}

/**
 * 加载骨架屏
 * 支持表格、卡片、页面级骨架
 */
export default function LoadingSkeleton({ type = 'page', rows = 5 }: LoadingSkeletonProps) {
  if (type === 'table') {
    return (
      <Box>
        <Skeleton variant="rectangular" height={48} sx={{ mb: 1 }} />
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={40} sx={{ mb: 0.5 }} />
        ))}
      </Box>
    );
  }

  if (type === 'cards') {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
        ))}
      </Box>
    );
  }

  // page
  return (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" width={120} height={80} sx={{ borderRadius: 1 }} />
        ))}
      </Box>
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
    </Box>
  );
}
