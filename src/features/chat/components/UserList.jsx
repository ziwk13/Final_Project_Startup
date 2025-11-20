import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';

// project imports
import UserAvatar from './UserAvatar';

// assets
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';

export default function UserList({ users, setUser, onLeave }) {
  const theme = useTheme();

  // 메뉴 제어를 위한 상태
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  // 메뉴 열기
  const handleMenuClick = (event, roomId) => {
    event.stopPropagation(); // 리스트 클릭 방지
    setAnchorEl(event.currentTarget);
    setSelectedRoomId(roomId);
  };

  // 메뉴 닫기
  const handleMenuClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
    setSelectedRoomId(null);
  };

  // 나가기 버튼 클릭
  const handleLeaveClick = (event) => {
    event.stopPropagation();
    if (onLeave && selectedRoomId) {
      onLeave(selectedRoomId); // ChatDrawer로 ID 전달
    }
    handleMenuClose();
  };

  return (
    <>
      <List component="nav">
        {users.map((user) => (
          <ListItem
            key={user.id}
            disablePadding
            divider
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="more"
                onClick={(e) => handleMenuClick(e, user.id)}
                sx={{ color: theme.palette.text.secondary }}
              >
                <MoreHorizTwoToneIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemButton
              onClick={() => setUser(user)}
              sx={{ pr: 7 }} // secondaryAction 공간 확보
            >
              <ListItemAvatar>
                <UserAvatar user={user} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Grid container spacing={1} component="span" sx={{ alignItems: 'center' }}>
                    <Grid component="span" size="grow">
                      <Stack direction="row" alignItems="center" spacing={0.5} component="span">
                        <Typography
                          variant="h5"
                          component="span"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                            color: 'inherit',
                            minWidth: 0
                          }}
                        >
                          {user.name}
                        </Typography>
                        {/* 인원수 표시 */}
                        {user.memberCount > 0 && (
                          <Typography
                            variant="body2"
                            component="span"
                            color="textSecondary"
                            sx={{ whiteSpace: 'nowrap' }}
                          >
                            {user.memberCount}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                }
                secondary={
                  <Grid container spacing={1} component="span" sx={{ alignItems: 'center' }}>
                    <Grid component="span" size="grow">
                      <Typography
                        variant="caption"
                        component="span"
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                      >
                        {user.lastMessage || '대화 내용 없음'}
                      </Typography>
                    </Grid>
                    <Grid component="span">
                      {user.unReadChatCount !== 0 && (
                        <Chip
                          label={user.unReadChatCount}
                          component="span"
                          color="secondary"
                          size="small"
                          sx={{ 
                            height: 20, 
                            minWidth: 20,
                            '& .MuiChip-label': { px: 0.5 }
                           }}
                        />
                      )}
                    </Grid>
                  </Grid>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* 드롭다운 메뉴 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleLeaveClick}>채팅방 나가기</MenuItem>
      </Menu>
    </>
  );
}

UserList.propTypes = {
  users: PropTypes.array,
  setUser: PropTypes.func,
  onLeave: PropTypes.func
};