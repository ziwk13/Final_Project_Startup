import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import AttendanceBasicCard from '../components/chart-data/AttendanceBasicCard';
import AttendanceSummaryCard from '../components/AttendanceSummaryCard';
import AttendanceWeekViewCard from '../components/AttendanceWeekViewCard';
import { Grid } from '@mui/material';

// ==============================|| DEFAULT DASHBOARD ||============================== //

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flexGrow: 1,
        overflow: 'visible'
      }}
    >
      {/* 근태 카드 */}
      <Box sx={{ flexShrink: 0 }}>
        <AttendanceBasicCard isLoading={isLoading} />
      </Box>
      {/* 주간 근무 카드 */}
      <Box item xs={12}>
        <AttendanceWeekViewCard />
      </Box>
      {/* 근무 요약 카드 */}
      <Box sx={{ flexShrink: 0 }}>
        <AttendanceSummaryCard />
      </Box>
    </Box>
  );
}
