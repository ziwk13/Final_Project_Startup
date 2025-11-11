import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); 

  const toggleChat = () => setIsChatOpen((prev) => !prev);
  
  const openChatWithUser = (user) => {
    setSelectedUser(user);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedUser(null); // 닫을 때 유저 선택도 초기화
  };

  // "뒤로 가기" (사용자 목록으로) 전용 함수를 새로 만듭니다.
  const goBackToUserList = () => {
    setSelectedUser(null);
  };

  return (
    // 새로 만든 함수를 context value에 추가합니다.
    <ChatContext.Provider value={{ isChatOpen, selectedUser, toggleChat, openChatWithUser, closeChat, goBackToUserList }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};