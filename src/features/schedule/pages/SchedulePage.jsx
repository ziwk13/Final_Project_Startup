import { useEffect, useRef, useState } from 'react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

// third party
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';

// project imports
import Toolbar from '../components/Toolbar';
import AddEventForm from '../components/AddEventForm';
import CalendarStyled from '../components/CalendarStyled';
import Loader from 'ui-component/Loader';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';

import { dispatch, useSelector } from 'store';
import { getEvents, addEvent, updateEvent, removeEvent } from '../slices/scheduleSlice'; // ✅ 변경됨
import useAuth from 'hooks/useAuth';

// assets
import AddAlarmTwoToneIcon from '@mui/icons-material/AddAlarmTwoTone';

// ==============================|| APPLICATION CALENDAR ||============================== //

export default function Calendar() {
  const calendarRef = useRef(null);
  const matchSm = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);

  // 로그인 정보
  const { user } = useAuth();
  const employeeId = user?.employeeId || user?.id;

  // Redux store에서 event 데이터 가져오기
  const scheduleState = useSelector((state) => state.schedule || state.schdule || {});
  const events = scheduleState.events || [];

  // 🧭 일정 조회
  useEffect(() => {
    if (employeeId) {
      dispatch(getEvents(employeeId)).then(() => setLoading(false)); // ✅ getSchedules → getEvents
    }
  }, [dispatch, employeeId]);

  // 캘린더 기본 세팅
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(matchSm ? 'listWeek' : 'dayGridMonth');

  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 📅 Toolbar 핸들러
  const handleDateToday = () => {
    const calendarEl = calendarRef.current?.getApi();
    calendarEl?.today();
    setDate(calendarEl?.getDate() ?? new Date());
  };

  const handleViewChange = (newView) => {
    const calendarEl = calendarRef.current?.getApi();
    calendarEl?.changeView(newView);
    setView(newView);
  };

  useEffect(() => {
    handleViewChange(matchSm ? 'listWeek' : 'dayGridMonth');
  }, [matchSm]);

  const handleDatePrev = () => {
    const calendarEl = calendarRef.current?.getApi();
    calendarEl?.prev();
    setDate(calendarEl?.getDate() ?? new Date());
  };

  const handleDateNext = () => {
    const calendarEl = calendarRef.current?.getApi();
    calendarEl?.next();
    setDate(calendarEl?.getDate() ?? new Date());
  };

  // 📆 일정 선택/추가/수정/삭제 핸들러
  const handleRangeSelect = (arg) => {
    calendarRef.current?.getApi().unselect();
    setSelectedRange({ start: arg.start, end: arg.end });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventSelect = (arg) => {
    const found = events.find((e) => e.scheduleId === Number(arg.event.id));
    setSelectedEvent(found ?? null);
    setSelectedRange(null);
    setIsModalOpen(true);
  };

  const handleEventUpdate = ({ event }) => {
    const updated = {
      scheduleId: Number(event.id),
      title: event.title,
      startTime: event.start ? event.start.toISOString() : undefined,
      endTime: event.end ? event.end.toISOString() : undefined
    };
    dispatch(updateEvent(updated.scheduleId, updated)); // ✅ updateSchedule → updateEvent
  };

  // ➕ 일정 생성
  const handleEventCreate = (data) => {
    const newEvent = {
      title: data.title,
      content: data.description || '',
      categoryCode: data.categoryCode || 'SCH_CATEGORY_MEETING',
      colorCode: data.colorCode || 'COLOR_BLUE',
      employeeId,
      startTime: data.start instanceof Date ? data.start.toISOString() : data.start,
      endTime: data.end instanceof Date ? data.end.toISOString() : data.end
    };
    dispatch(addEvent(newEvent)); // ✅ addSchedule → addEvent
    handleModalClose();
  };

  // ✏️ 일정 수정
  const handleUpdateEvent = (scheduleId, update) => {
    const payload = {
      scheduleId,
      ...update,
      startTime: update.start instanceof Date ? update.start.toISOString() : update.start,
      endTime: update.end instanceof Date ? update.end.toISOString() : update.end
    };
    dispatch(updateEvent(scheduleId, payload)); // ✅ updateSchedule → updateEvent
    handleModalClose();
  };

  // ❌ 일정 삭제
  const handleEventDelete = (scheduleId) => {
    dispatch(removeEvent(scheduleId)); // ✅ removeSchedule → removeEvent
    handleModalClose();
  };

  const handleAddClick = () => {
    setSelectedEvent(null);
    setSelectedRange(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedRange(null);
  };

  if (loading) return <Loader />;

  return (
    <MainCard
      title="일정목록"
      secondary={
        <Button color="secondary" variant="contained" onClick={handleAddClick}>
          <AddAlarmTwoToneIcon fontSize="small" sx={{ mr: 0.75 }} />
          일정 추가
        </Button>
      }
    >
      <CalendarStyled>
        <Toolbar
          date={date}
          view={view}
          onClickNext={handleDateNext}
          onClickPrev={handleDatePrev}
          onClickToday={handleDateToday}
          onChangeView={handleViewChange}
        />
        <SubCard>
          <FullCalendar
            ref={calendarRef}
            plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            initialDate={date}
            events={events.map((e) => ({
              id: e.scheduleId,
              title: e.title,
              start: e.startTime,
              end: e.endTime,
              backgroundColor: '#60A5FA'
            }))}
            selectable
            editable
            droppable
            weekends
            height={matchSm ? 'auto' : 720}
            headerToolbar={false}
            allDayMaintainDuration
            eventResizableFromStart
            select={handleRangeSelect}
            eventDrop={handleEventUpdate}
            eventClick={handleEventSelect}
            eventResize={handleEventUpdate}
            eventTimeFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
          />
        </SubCard>
      </CalendarStyled>

      {/* 일정 등록/수정 다이얼로그 */}
      <Dialog maxWidth="sm" fullWidth onClose={handleModalClose} open={isModalOpen} slotProps={{ paper: { sx: { p: 0 } } }}>
        {isModalOpen && (
          <AddEventForm
            event={selectedEvent}
            range={selectedRange}
            onCancel={handleModalClose}
            handleDelete={handleEventDelete}
            handleCreate={handleEventCreate}
            handleUpdate={handleUpdateEvent}
          />
        )}
      </Dialog>
    </MainCard>
  );
}
