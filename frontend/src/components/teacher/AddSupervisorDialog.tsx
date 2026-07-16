import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Tabs,
  Tab,
  TextField,
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import SupervisorSearchPanel from './SupervisorSearchPanel';
import { supervisorsApi } from '../../api/supervisors';
import type { Supervisor, CreateSupervisorInput } from '../../types';
import { toast } from 'sonner';

interface AddSupervisorDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (supervisor: Supervisor, notes: string, matchLevel: string | null) => void;
}

/**
 * 添加导师弹窗
 * Tab 1: 从导师库搜索选择
 * Tab 2: 手动录入新导师
 */
export default function AddSupervisorDialog({ open, onClose, onConfirm }: AddSupervisorDialogProps) {
  const [tab, setTab] = useState(0);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [notes, setNotes] = useState('');
  const [matchLevel, setMatchLevel] = useState<string | null>(null);

  // 新建导师表单
  const [newSupervisor, setNewSupervisor] = useState<CreateSupervisorInput>({
    name: '',
    title: '',
    location: '',
    university: '',
    qsRanking: undefined,
    usnewsRanking: undefined,
    department: '',
    homepageUrl: '',
    email: '',
    phdApplicationUrl: '',
    researchArea: '',
  });
  const [creating, setCreating] = useState(false);

  const handleClose = () => {
    setTab(0);
    setSelectedSupervisor(null);
    setNotes('');
    setMatchLevel(null);
    setNewSupervisor({
      name: '',
      title: '',
      location: '',
      university: '',
      qsRanking: undefined,
      usnewsRanking: undefined,
      department: '',
      homepageUrl: '',
      email: '',
      phdApplicationUrl: '',
      researchArea: '',
    });
    onClose();
  };

  const handleCreateAndSelect = async () => {
    if (!newSupervisor.name.trim()) {
      toast.error('导师姓名不能为空');
      return;
    }
    setCreating(true);
    try {
      const created = await supervisorsApi.create(newSupervisor);
      setSelectedSupervisor(created);
      setTab(0);
      toast.success('导师已创建，请填写推荐备注');
    } catch {
      // handled by interceptor
    } finally {
      setCreating(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedSupervisor) {
      toast.error('请先选择或创建一位导师');
      return;
    }
    onConfirm(selectedSupervisor, notes, matchLevel);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>添加导师推荐</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tab label="从导师库选择" />
          <Tab label="手动录入新导师" />
        </Tabs>

        {tab === 0 && (
          <Box>
            <SupervisorSearchPanel onSelect={setSelectedSupervisor} selectedId={selectedSupervisor?.id} />

            {selectedSupervisor && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  已选择：{selectedSupervisor.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedSupervisor.university} · {selectedSupervisor.researchArea}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              推荐备注
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="填写推荐理由、研究方向匹配度等..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={matchLevel === 'HIGH' ? 'contained' : 'outlined'}
                color="success"
                size="small"
                onClick={() => setMatchLevel(matchLevel === 'HIGH' ? null : 'HIGH')}
              >
                建议多看看
              </Button>
              <Button
                variant={matchLevel === 'MEDIUM' ? 'contained' : 'outlined'}
                color="warning"
                size="small"
                onClick={() => setMatchLevel(matchLevel === 'MEDIUM' ? null : 'MEDIUM')}
              >
                可以备选
              </Button>
            </Box>
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="导师姓名 *"
                  value={newSupervisor.name}
                  onChange={(e) => setNewSupervisor({ ...newSupervisor, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="职称"
                  value={newSupervisor.title}
                  onChange={(e) => setNewSupervisor({ ...newSupervisor, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="学校"
                  value={newSupervisor.university}
                  onChange={(e) => setNewSupervisor({ ...newSupervisor, university: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="地区"
                  value={newSupervisor.location}
                  onChange={(e) => setNewSupervisor({ ...newSupervisor, location: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="QS 排名"
                  value={newSupervisor.qsRanking ?? ''}
                  onChange={(e) =>
                    setNewSupervisor({
                      ...newSupervisor,
                      qsRanking: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="USNEWS 排名"
                  value={newSupervisor.usnewsRanking ?? ''}
                  onChange={(e) =>
                    setNewSupervisor({
                      ...newSupervisor,
                      usnewsRanking: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="院系"
                  value={newSupervisor.department}
                  onChange={(e) => setNewSupervisor({ ...newSupervisor, department: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="研究方向"
                  value={newSupervisor.researchArea}
                  onChange={(e) => setNewSupervisor({ ...newSupervisor, researchArea: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="主页 URL"
                  value={newSupervisor.homepageUrl}
                  onChange={(e) => setNewSupervisor({ ...newSupervisor, homepageUrl: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="邮箱"
                  value={newSupervisor.email}
                  onChange={(e) => setNewSupervisor({ ...newSupervisor, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="博士申请 URL"
                  value={newSupervisor.phdApplicationUrl}
                  onChange={(e) =>
                    setNewSupervisor({ ...newSupervisor, phdApplicationUrl: e.target.value })
                  }
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={handleCreateAndSelect} disabled={creating}>
                {creating ? '创建中...' : '创建并选择'}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          取消
        </Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!selectedSupervisor}>
          确认推荐
        </Button>
      </DialogActions>
    </Dialog>
  );
}
