import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  TextField,
  Box,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { usePromptTemplates } from '../../../hooks/usePromptTemplates';
import type { PromptTemplate } from '../../../types';

interface PromptTemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (template: PromptTemplate) => void;
}

const CATEGORIES = ['全部', '通用', '理工科', '人文社科', '商科'];

export default function PromptTemplateSelector({ open, onClose, onSelect }: PromptTemplateSelectorProps) {
  const [search, setSearch] = useState('');
  const [categoryTab, setCategoryTab] = useState(0);

  const category = categoryTab === 0 ? undefined : CATEGORIES[categoryTab];
  const { data: templates = [], isLoading } = usePromptTemplates({ category: category || undefined, search: search || undefined });

  const filteredTemplates = search
    ? templates.filter(
        (t) =>
          t.name.includes(search) || t.content.includes(search)
      )
    : templates;

  const handleSelect = (template: PromptTemplate) => {
    onSelect(template);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>选择提示词模板</DialogTitle>
      <DialogContent>
        <Tabs
          value={categoryTab}
          onChange={(_, v) => setCategoryTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 1 }}
        >
          {CATEGORIES.map((cat) => (
            <Tab key={cat} label={cat} sx={{ fontSize: '0.8rem' }} />
          ))}
        </Tabs>

        <TextField
          fullWidth
          size="small"
          placeholder="搜索模板..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 1.5 }}
        />

        {isLoading ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            加载中...
          </Typography>
        ) : filteredTemplates.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            {search ? '未找到匹配的模板' : '暂无模板'}
          </Typography>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredTemplates.map((template) => (
              <ListItemButton key={template.id} onClick={() => handleSelect(template)} sx={{ borderRadius: 1, mb: 0.5 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {template.name}
                      </Typography>
                      {template.category && (
                        <Chip label={template.category} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {template.content}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
      </DialogActions>
    </Dialog>
  );
}
