import { Box, Tabs, Tab } from '@mui/material';

export type FilterType = 'ALL' | 'WANT_CONTACT' | 'BACKUP' | 'SKIP' | 'PENDING';

interface FilterTabsProps {
  value: FilterType;
  onChange: (value: FilterType) => void;
  counts: Record<FilterType, number>;
}

/**
 * 筛选标签栏
 * 全部 / 想联系 / 备选 / 待查看 / 暂不考虑
 */
export default function FilterTabs({ value, onChange, counts }: FilterTabsProps) {
  const tabs: { label: string; value: FilterType }[] = [
    { label: `全部 (${counts.ALL || 0})`, value: 'ALL' },
    { label: `想联系 (${counts.WANT_CONTACT || 0})`, value: 'WANT_CONTACT' },
    { label: `备选 (${counts.BACKUP || 0})`, value: 'BACKUP' },
    { label: `待查看 (${counts.PENDING || 0})`, value: 'PENDING' },
    { label: `暂不考虑 (${counts.SKIP || 0})`, value: 'SKIP' },
  ];

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={value}
        onChange={(_, v) => onChange(v)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
    </Box>
  );
}
