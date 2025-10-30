import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import { withAlpha } from 'utils/colorUtils';

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto } from '@tabler/icons-react';
import User1 from 'assets/images/users/avatar-4.png';
import User2 from 'assets/images/users/logo_coupang.png'
import User3 from 'assets/images/users/animal6.jpg'

function ListItemWrapper({ children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: withAlpha(theme.palette.grey[200], 0.3),
          ...theme.applyStyles('dark', { bgcolor: 'dark.900' })
        }
      }}
    >
      {children}
    </Box>
  );
}

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

export default function NotificationList() {
  const theme = useTheme();
  const containerSX = { gap: 2, pl: 7 };

  return (
    <List sx={{ width: '100%', maxWidth: { xs: 300, md: 330 }, py: 0 }}>
      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disablePadding
          secondaryAction={
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="caption">2분전</Typography>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar alt="권형택" src={User1} />
          </ListItemAvatar>
          <ListItemText primary="권형택" />
        </ListItem>
        <Stack sx={containerSX}>
          <Typography variant="subtitle2">알림 content</Typography>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Chip label="안읽음" color="error" size="small" sx={{ width: 'min-content' }} />
            <Chip label="새 알림" color="warning" size="small" sx={{ width: 'min-content' }} />
          </Stack>
        </Stack>
      </ListItemWrapper>
      {/* 2번째 알림 */}
      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disablePadding
          secondaryAction={
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="caption">2분전</Typography>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                color: 'success.dark',
                bgcolor: 'success.light',

                ...theme.applyStyles('dark', { bgcolor: 'dark.main' })
              }}
            >
              <IconBuildingStore stroke={1.5} size="20px" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={<Typography variant="subtitle1">게시판 알림</Typography>} />
        </ListItem>
        <Stack sx={containerSX}>
          <Typography variant="subtitle2">새로운 공지사항이 있습니다</Typography>
          <Chip label="안읽음" color="error" size="small" sx={{ width: 'min-content' }} />
        </Stack>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disablePadding
          secondaryAction={
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="caption">2 분전</Typography>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                color: 'primary.dark',
                bgcolor: 'primary.light',
                ...theme.applyStyles('dark', { bgcolor: 'dark.main' })
              }}
            >
              <IconMailbox stroke={1.5} size="20px" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={<Typography variant="subtitle1">메일이 도착 하였습니다.</Typography>} />
        </ListItem>
        <Stack sx={containerSX}>
          <Typography variant="subtitle2">프로젝트 진행 사항 전달 드립니다</Typography>
          <Button variant="contained" endIcon={<IconBrandTelegram stroke={1.5} size={20} />} sx={{ width: 'min-content' }}>
            Mail
          </Button>
        </Stack>
      </ListItemWrapper>

      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disablePadding
          secondaryAction={
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="caption">2 min ago</Typography>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar alt="김경진" src={User3} />
          </ListItemAvatar>
          <ListItemText primary={<Typography variant="subtitle1">김경진 </Typography>} />
        </ListItem>
        <Stack sx={containerSX}>
          <Typography variant="subtitle2">족발은 언제 올까요</Typography>
        </Stack>
      </ListItemWrapper>
    </List>
  );
}

ListItemWrapper.propTypes = { children: PropTypes.node };
