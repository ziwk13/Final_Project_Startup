import { useEffect, useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';

// third party 추후 인스톨 후 구현 예정
// import EmojiPicker, { SkinTones } from 'emoji-picker-react';

// project imports
import { useChat } from 'contexts/ChatContext';
import ChatDrawer from '../components/ChatDrawer';
import CreateChatRoomModal from '../components/CreateChatRoomModal';
import { createRoom } from '../api/Chat';
import useAuth from 'hooks/useAuth';
import { appDrawerWidth as drawerWidth } from 'store/constant';
import OrganizationModal from '../../organization/components/OrganizationModal';

// assets

// drawer content element
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  paddingLeft: open ? theme.spacing(3) : 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.shorter
  }),
  marginLeft: `-${drawerWidth}px`,
  [theme.breakpoints.down('lg')]: {
    paddingLeft: 0,
    marginLeft: 0
  },
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.shorter
    }),
    marginLeft: 0
  })
}));

// ==============================|| APPLICATION CHAT ||============================== //

export default function ChatMainPage() {
  const chatCtx = useChat();
  const [data, setData] = useState([]);
  const [isChatLoading, startTransition] = useTransition();


  const { user: authUser } = useAuth();
  const theme = useTheme();
  const [openChatDrawer, setOpenChatDrawer] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openOrgModal, setOpenOrgModal] = useState(false); // (Modal B) 사원 선택용
  const [initialUsersForCreateModal, setInitialUsersForCreateModal] = useState([]); // Modal A에 전달할 사용자
  const { openChatWithUser } = useChat();

  const user = chatCtx?.selectedUser;
  const goBackToUserList = chatCtx?.goBackToUserList;

  // 플러스 버튼 클릭 시 실행될 핸들러(조직도 모달)
  const handleStartNewChat = () => {
    setOpenOrgModal(true);
  };

  // 조직도 모달 닫기 핸들러
  const handleCloseOrgModal = () => {
    setOpenOrgModal(false);
  };

  // 조직도 모달 적용 버튼 클릭시
  const handleOrgModalApply = async (orgList) => {
    const selectedEmployees = orgList[0]?.empList || [];
    setOpenOrgModal(false);

    if (selectedEmployees.length === 0) {
      return;
    }
    // 1명 선택: 즉시 1:1 채팅방 생성
    if (selectedEmployees.length === 1) {
      const otherUser = selectedEmployees[0];
      const finalRoomName = `${otherUser.name} ${otherUser.position}`;
      const userIds = [otherUser.employeeId];

      try {
        const roomData = {
          displayName: finalRoomName,
          inviteeEmployeeIds: userIds
        };
        const newRoom = await createRoom(roomData);

        const mappedNewRoom = {
          id: newRoom.chatRoomId,
          name: newRoom.name,
          avatar: newRoom.profile,
          lastMessage: '',
          unReadChatCount: 0,
          online_status: 'available'
        };
        openChatWithUser(mappedNewRoom)  // 생성된 채팅방으로 바로 이동
      } catch (error) {
        console.error("1:1 채팅방 생성 실패", error);
      }
    } else {
      // 2명 이상 선택: 그룹 채팅 모달 열기
      setInitialUsersForCreateModal(selectedEmployees);
      setOpenCreateModal(true);
    }
  };

  // 새 채팅방 생성 모달 닫기 핸들러
  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    setInitialUsersForCreateModal([]);
  };

  useEffect(() => {
    if (user) {
      setData([]);
      startTransition(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
        });
      });
    }
  }, [user]);

  const handleOnSend = (messageText) => {
    const d = new Date();
    const newMessage = {
      from: authUser.name,
      to: user.name,
      text: messageText,
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setData((prevState) => [...prevState, newMessage]);
  };

  // // handle emoji
  // const onEmojiClick = (emojiObject, event) => {
  //   setMessage(message + emojiObject.emoji);
  // };

  // const [anchorElEmoji, setAnchorElEmoji] = React.useState(); /** No single type can cater for all elements */
  // const handleOnEmojiButtonClick = (event) => {
  //   setAnchorElEmoji(anchorElEmoji ? null : event?.currentTarget);
  // };

  // const emojiOpen = Boolean(anchorElEmoji);
  // const emojiId = emojiOpen ? 'simple-popper' : undefined;
  // const handleCloseEmoji = () => {
  //   setAnchorElEmoji(null);
  // };

  return (
    <>
      <ChatDrawer
        openChatDrawer={openChatDrawer}
        onStartNewChat={handleStartNewChat}

        selectedUser={user}
        isHistoryLoading={isChatLoading}
        chatHistoryData={data}
        onSendMessage={handleOnSend}
        onCloseChat={goBackToUserList} // '뒤로가기' 용도
      />
      <CreateChatRoomModal
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        preSelectedUsers={initialUsersForCreateModal}
      />
      <OrganizationModal
        open={openOrgModal}
        onClose={handleCloseOrgModal}
        list={[{ name: '초대자', empList: [] }]}
        setList={handleOrgModalApply}
      />
    </>
  );
}