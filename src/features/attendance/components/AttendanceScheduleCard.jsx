// ==============================|| AttendanceScheduleCard.jsx ||============================== //

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'store';
import { getEvents } from 'features/schedule/slices/scheduleSlice';
import MainCard from 'ui-component/cards/MainCard';
import { Typography, Box, Divider } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';

dayjs.locale('ko');

export default function AttendanceScheduleCard() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { events, loading } = useSelector((state) => state.schedule);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.employeeId) {
      dispatch(getEvents(user.employeeId));
    }
  }, [dispatch, user]);

  const startOfWeek = dayjs().startOf('week').add(1, 'day');
  const endOfWeek = startOfWeek.add(6, 'day');

  const thisWeekEvents = useMemo(() => {
    return events.filter((event) => {
      const start = dayjs(event.startTime);
      return start.isAfter(startOfWeek.startOf('day')) && start.isBefore(endOfWeek.endOf('day'));
    });
  }, [events]);

  return (
    <MainCard
      title="이번 주 일정"
      sx={{
        height: '100%',
        borderRadius: '16px',
        p: 0.1,
        background: 'rgba(255,255,255,0.03)',
        color: '#60A5FA',
        overflowY: 'auto'
      }}
    >
      {loading ? (
        <Typography variant="body2" color="text.secondary">
          불러오는 중...
        </Typography>
      ) : thisWeekEvents.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          이번 주 등록된 일정이 없습니다.
        </Typography>
      ) : (
        thisWeekEvents.map((e, index) => (
          <Box key={e.scheduleId || index} sx={{ mb: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                cursor: 'pointer',
                '&:hover': { color: '#60A5FA' }
              }}
              onClick={() => navigate(`/schedule?modal=edit&id=${e.scheduleId}`)}
            >
              {e.title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              {dayjs(e.startTime).format('MM/DD HH:mm')} ~ {dayjs(e.endTime).format('MM/DD HH:mm')}
            </Typography>
            {index < thisWeekEvents.length - 1 && <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.05)' }} />}
          </Box>
        ))
      )}
    </MainCard>
  );
}
