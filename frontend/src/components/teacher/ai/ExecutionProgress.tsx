import { Box, Typography, LinearProgress, Stepper, Step, StepLabel } from '@mui/material';
import { PROCESSING_NODE_LABELS } from '../../../utils/constants';

interface ExecutionProgressProps {
  processingNode: string | null;
  aiFeedback: string | null;
}

const NODE_ORDER = [
  'searching_supervisors',
  'filling_supervisor_info',
  'verifying_links',
  'self_checking',
  'done',
];

export default function ExecutionProgress({ processingNode, aiFeedback }: ExecutionProgressProps) {
  const currentIndex = processingNode ? NODE_ORDER.indexOf(processingNode) : -1;
  const progressPercent = processingNode === 'done' ? 100 : currentIndex >= 0 ? ((currentIndex + 1) / NODE_ORDER.length) * 100 : 0;

  // 解析反馈日志（按换行分割）
  const logLines = aiFeedback
    ? aiFeedback.split('\n').filter((line) => line.trim())
    : [];

  return (
    <Box>
      {/* 进度条 */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            AI 执行进度
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progressPercent)}%
          </Typography>
        </Box>
        <LinearProgress
          variant={processingNode === 'done' ? 'determinate' : 'indeterminate'}
          value={progressPercent}
          sx={{ height: 6, borderRadius: 3 }}
        />
      </Box>

      {/* 步骤指示器 */}
      <Stepper activeStep={currentIndex} alternativeLabel sx={{ mb: 2 }}>
        {NODE_ORDER.map((node) => (
          <Step key={node}>
            <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.7rem' } }}>
              {PROCESSING_NODE_LABELS[node] || node}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* 实时日志 */}
      {logLines.length > 0 && (
        <Box
          sx={{
            bgcolor: '#f5f5f5',
            borderRadius: 1,
            p: 1.5,
            maxHeight: 200,
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
          }}
        >
          {logLines.map((line, idx) => (
            <Typography
              key={idx}
              variant="caption"
              component="div"
              sx={{
                fontFamily: 'monospace',
                color: line.includes('[失败]') || line.includes('[超时]')
                  ? 'error.main'
                  : line.includes('[完成]')
                  ? 'success.main'
                  : 'text.secondary',
              }}
            >
              {line}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}
