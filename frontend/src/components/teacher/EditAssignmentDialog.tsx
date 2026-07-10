import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import type { AssignmentDetail } from '../../types';
import { MatchLevel } from '../../types';

interface EditAssignmentDialogProps {
  open: boolean;
  assignment: AssignmentDetail | null;
  onClose: () => void;
  onConfirm: (id: string, data: { notes: string; matchLevel: MatchLevel | null }) => void;
}

/**
 * 编辑推荐记录弹窗
 * 编辑备注 + 选择匹配度
 */
export default function EditAssignmentDialog({
  open,
  assignment,
  onClose,
  onConfirm,
}: EditAssignmentDialogProps) {
  const [notes, setNotes] = useState('');
  const [matchLevel, setMatchLevel] = useState<MatchLevel | null>(null);

  useEffect(() => {
    if (assignment) {
      setNotes(assignment.notes || '');
      setMatchLevel(assignment.matchLevel);
    }
  }, [assignment]);

  const handleConfirm = () => {
    if (!assignment) return;
    onConfirm(assignment.id, { notes, matchLevel });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>编辑推荐记录</DialogTitle>
      <DialogContent>
        {assignment && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              导师：{assignment.supervisor.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              {assignment.supervisor.university} · {assignment.supervisor.researchArea}
            </Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                匹配度
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={matchLevel === MatchLevel.HIGH ? 'contained' : 'outlined'}
                  color="success"
                  size="small"
                  onClick={() => setMatchLevel(matchLevel === MatchLevel.HIGH ? null : MatchLevel.HIGH)}
                >
                  建议多看看
                </Button>
                <Button
                  variant={matchLevel === MatchLevel.MEDIUM ? 'contained' : 'outlined'}
                  color="warning"
                  size="small"
                  onClick={() =>
                    setMatchLevel(matchLevel === MatchLevel.MEDIUM ? null : MatchLevel.MEDIUM)
                  }
                >
                  可以备选
                </Button>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="推荐备注"
              placeholder="填写推荐理由、职称、研究方向、匹配度说明等..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          取消
        </Button>
        <Button onClick={handleConfirm} variant="contained">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}
