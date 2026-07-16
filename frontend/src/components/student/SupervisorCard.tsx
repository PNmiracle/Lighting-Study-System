import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Link,
  Divider,
} from '@mui/material';
import { Home, Email, Description, LocationOn, School } from '@mui/icons-material';
import type { AssignmentDetail } from '../../types';
import { MatchLevel } from '../../types';
import IntentButtons from './IntentButtons';
import { formatRanking, truncateText } from '../../utils/helpers';

interface SupervisorCardProps {
  assignment: AssignmentDetail;
}

/**
 * 导师卡片
 * 信息 + 匹配度高亮 + 链接 + 三态按钮
 */
export default function SupervisorCard({ assignment }: SupervisorCardProps) {
  const { supervisor } = assignment;

  const getMatchLevelStyle = (matchLevel: MatchLevel | null) => {
    if (matchLevel === MatchLevel.HIGH) {
      return { bg: '#e8f5e9', color: '#2e7d32', label: '建议多看看' };
    }
    if (matchLevel === MatchLevel.MEDIUM) {
      return { bg: '#fff3e0', color: '#ed6c02', label: '可以备选' };
    }
    return null;
  };

  const matchStyle = getMatchLevelStyle(assignment.matchLevel);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* 头部：姓名 + 职称 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {supervisor.name}
            </Typography>
            {supervisor.title && (
              <Typography variant="body2" color="text.secondary">
                {supervisor.title}
              </Typography>
            )}
          </Box>
          {assignment.intentLocked && (
            <Chip
              label={assignment.intentLabel}
              size="small"
              sx={{
                bgcolor:
                  assignment.studentIntent === 'WANT_CONTACT'
                    ? '#e8f5e9'
                    : assignment.studentIntent === 'BACKUP'
                    ? '#fff3e0'
                    : '#f5f5f5',
                color:
                  assignment.studentIntent === 'WANT_CONTACT'
                    ? '#2e7d32'
                    : assignment.studentIntent === 'BACKUP'
                    ? '#ed6c02'
                    : '#9e9e9e',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {/* 信息行：学校 + 排名 + 地区 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
          {supervisor.university && (
            <Chip
              icon={<School fontSize="small" />}
              label={supervisor.university}
              size="small"
              variant="outlined"
            />
          )}
          {supervisor.qsRanking && (
            <Chip label={`QS ${formatRanking(supervisor.qsRanking)}`} size="small" color="primary" variant="outlined" />
          )}
          {supervisor.usnewsRanking && (
            <Chip
              label={`USNEWS ${formatRanking(supervisor.usnewsRanking)}`}
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
          {supervisor.location && (
            <Chip
              icon={<LocationOn fontSize="small" />}
              label={supervisor.location}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {supervisor.department && (
          <Typography variant="body2" color="text.secondary">
            院系：{supervisor.department}
          </Typography>
        )}

        {/* 匹配度高亮 */}
        {matchStyle && (
          <Box
            sx={{
              display: 'inline-block',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              bgcolor: matchStyle.bg,
              color: matchStyle.color,
              fontWeight: 600,
              fontSize: '0.875rem',
              alignSelf: 'flex-start',
            }}
          >
            🟢 {matchStyle.label}
          </Box>
        )}

        {/* 备注摘要 */}
        {assignment.notes && (
          <Box
            sx={{
              p: 1,
              bgcolor: '#f9f9f9',
              borderRadius: 1,
              border: '1px solid #f0f0f0',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              老师备注
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {truncateText(assignment.notes, 120)}
            </Typography>
          </Box>
        )}

        {/* 研究方向 */}
        {supervisor.researchArea && (
          <Typography variant="body2" color="text.secondary">
            <strong>研究方向：</strong>
            {truncateText(supervisor.researchArea, 80)}
          </Typography>
        )}

        <Divider sx={{ my: 0.5 }} />

        {/* 链接资源 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {supervisor.homepageUrl && (
            <Link href={supervisor.homepageUrl} target="_blank" rel="noopener" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}>
              <Home fontSize="small" /> 主页
            </Link>
          )}
          {supervisor.email && (
            <Link href={`mailto:${supervisor.email}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}>
              <Email fontSize="small" /> 邮箱
            </Link>
          )}
          {supervisor.phdApplicationUrl && (
            <Link href={supervisor.phdApplicationUrl} target="_blank" rel="noopener" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}>
              <Description fontSize="small" /> 申请信息
            </Link>
          )}
          {supervisor.otherInfoUrl && (
            <Link href={supervisor.otherInfoUrl} target="_blank" rel="noopener" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}>
              <Description fontSize="small" /> 其他信息
            </Link>
          )}
        </Box>

        {/* 底部三态按钮 */}
        <Box sx={{ mt: 'auto', pt: 1 }}>
          <IntentButtons assignment={assignment} />
        </Box>
      </CardContent>
    </Card>
  );
}
