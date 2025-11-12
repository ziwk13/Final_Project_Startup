import { Box, Typography, useTheme } from '@mui/material';

export default function WorkProgressBar({
  currentMinutes = 0, // 이번 주 누적 근무시간
  targetMinutes = 2400 // 목표 근무시간 (기본 40h)
}) {
  const theme = useTheme();

  const percent = Math.min((currentMinutes / targetMinutes) * 100, 100);
  const remainingMinutes = Math.max(targetMinutes - currentMinutes, 0);

  const currentHours = Math.floor(currentMinutes / 60);
  const currentMins = currentMinutes % 60;
  const remainHours = Math.floor(remainingMinutes / 60);
  const remainMins = remainingMinutes % 60;

  // 진행 바 색상 정의
  const progressGradient =
    percent >= 100
      ? `linear-gradient(90deg, ${theme.palette.success.light}, ${theme.palette.success.main})`
      : `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`;

  return (
    <Box sx={{ width: '100%', p: 1 }}>
      {/* 상단 텍스트 */}
      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.3, color: 'text.primary' }}>
        주간누적 {currentHours}시간 {currentMins}분 / 40시간
      </Typography>

      <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
        이번주 {remainHours}시간 {remainMins}분 더 필요해요.
      </Typography>

      {/* 진행 바 */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 20,
          borderRadius: 12,
          backgroundColor: theme.palette.action.hover,
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            width: `${percent}%`,
            height: '80%',
            background: progressGradient,
            borderRadius: 12,
            transition: 'width 0.6s ease'
          }}
        />
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'text.primary',
            fontWeight: 600
          }}
        >
          {percent >= 100 ? '완료' : `${Math.round(percent)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
