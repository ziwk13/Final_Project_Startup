import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'store';
import { Box, Typography, IconButton, Stack, Button } from '@mui/material';
import { fetchSelectedWeekAttendance } from '../slices/attendanceSlice';
import dayjs from 'dayjs';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MainCard from 'ui-component/cards/MainCard';
import useAuth from 'hooks/useAuth';

export default function AttendanceWeekViewCard({ employeeId: propEmployeeId }) {
  const dispatch = useDispatch();
  const { selectedWeek, loading } = useSelector((state) => state.attendance);
  const { isLoggedIn, isRefreshing, isInitialized, user } = useAuth();

  //
  const employeeId = useMemo(() => propEmployeeId || user?.employeeId, [propEmployeeId, user?.employeeId]);

  //  기준 주차 (월요일 시작)
  const [weekStart, setWeekStart] = useState(dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD'));

  // 주차 이동 함수
  const handlePrevWeek = () => setWeekStart(dayjs(weekStart).subtract(7, 'day').format('YYYY-MM-DD'));
  const handleNextWeek = () => setWeekStart(dayjs(weekStart).add(7, 'day').format('YYYY-MM-DD'));
  const handleCurrentWeek = () => setWeekStart(dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD'));

  //  주차 변경 시 데이터 요청
  useEffect(() => {
    if (isInitialized && isLoggedIn && !isRefreshing && employeeId && weekStart) {
      dispatch(fetchSelectedWeekAttendance({ employeeId, weekStart }));
    }
  }, [weekStart]);

  // 데이터 정규화
  const records = useMemo(() => (selectedWeek?.records ? selectedWeek.records : []), [selectedWeek]);

  //  일자별 데이터 매핑
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = dayjs(weekStart).add(i, 'day');
    const record = records.find((r) => dayjs(r.attendanceDate).isSame(date, 'day'));

    const start = record?.startTime ? dayjs(record.startTime).format('HH:mm') : null;
    const end = record?.endTime ? dayjs(record.endTime).format('HH:mm') : null;
    const totalMinutes = record?.startTime && record?.endTime ? dayjs(record.endTime).diff(dayjs(record.startTime), 'minute') : 0;
    const total = totalMinutes > 0 ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m` : null;

    const isVacation = record?.workStatus === 'VACATION';
    const isHoliday = record?.workStatus === 'HOLIDAY';

    return {
      date,
      label: `${date.date()}일 (${['일', '월', '화', '수', '목', '금', '토'][date.day()]})`,
      start,
      end,
      total,
      isVacation,
      isHoliday
    };
  });

  const monday = dayjs(weekStart);
  const sunday = dayjs(weekStart).add(6, 'day');

  if (!isInitialized || isRefreshing) {
    return (
      <MainCard
        title="주간 근무 현황"
        sx={{
          borderRadius: '16px',
          p: 3,
          background: 'linear-gradient(145deg, #1a223f 0%, #111726 100%)',
          color: '#9CA3AF',
          textAlign: 'center'
        }}
      ></MainCard>
    );
  }

  //

  //  메인 렌더링
  return (
    <MainCard
      title="주간 근무 현황"
      sx={{
        borderRadius: '16px',
        p: 3,
        background: 'linear-gradient(145deg, #1a223f 0%, #111726 100%)',
        color: '#E5E7EB'
      }}
    >
      {/* ===== 상단 네비게이션 ===== */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, mt: 1, color: '#E5E7EB' }}>
        {/* 왼쪽: 주차 이동 버튼 */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={handlePrevWeek} sx={{ color: '#9CA3AF' }}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>

          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            {monday.format('YYYY.MM.DD')} ~ {sunday.format('YYYY.MM.DD')}
          </Typography>

          <IconButton onClick={handleNextWeek} sx={{ color: '#9CA3AF' }}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* 오른쪽: 오늘 버튼 */}
        <Button
          onClick={handleCurrentWeek}
          sx={{
            color: '#60A5FA',
            fontWeight: 600,
            fontSize: '0.95rem',
            '&:hover': { textDecoration: 'none', background: 'transparent' }
          }}
        >
          오늘
        </Button>
      </Stack>

      {/* 주간 표 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          backgroundColor: '#0d1325',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        {weekDays.map((day, i) => (
          <Box
            key={i}
            sx={{
              backgroundColor: '#16203a',
              p: 2,
              textAlign: 'center',
              borderRight: i !== 6 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              color: '#E5E7EB',
              minHeight: 100
            }}
          >
            <Typography variant="subtitle1" sx={{ color: '#9CA3AF', fontWeight: 500, mb: 0.5 }}>
              {day.label}
            </Typography>

            {day.isVacation ? (
              <Typography variant="h6" sx={{ color: '#60A5FA', fontWeight: 600, mt: 1 }}>
                연차
              </Typography>
            ) : day.isHoliday ? (
              <Typography variant="h6" sx={{ color: '#FBBF24', fontWeight: 600, mt: 1 }}>
                휴일
              </Typography>
            ) : day.start || day.end ? (
              <Box sx={{ mt: 1, fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                <Typography>출 : {day.start || '-'}</Typography>
                <Typography>퇴 : {day.end || ''}</Typography>
                <Typography>총 : {day.total || ''}</Typography>
              </Box>
            ) : (
              <Box sx={{ height: '3.2rem' }} />
            )}
          </Box>
        ))}
      </Box>
    </MainCard>
  );
}
