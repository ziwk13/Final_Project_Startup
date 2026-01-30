import { Box, Button, Typography, Stack, TextField, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import postCommentAPI from "../api/postCommentAPI";
import { useState } from "react";

// 날짜 포맷
const formatDateTime = (datetime) => {
  if (!datetime) return "";
  const date = new Date(datetime);
  return date.toLocaleString("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export default function PostCommentItem({ comment, loginEmployeeId, refresh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  // 메뉴(anchor)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // 댓글 수정
  const handleUpdate = async () => {
    try {
      await postCommentAPI.updateComment(comment.commentId, {
        content: editContent
      });
      setIsEditing(false);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // 댓글 삭제
  const handleDelete = async () => {
    try {
      await postCommentAPI.deleteComment(comment.commentId);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
      
      {/* 작성자 + 더보기 메뉴 */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontWeight: 600 }}>
          {comment.employeename}
        </Typography>

        {/* 본인일 때만 점 메뉴 */}
        {comment.employeeId === loginEmployeeId && (
          <>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon fontSize="small" />
            </IconButton>

            {/* 여기서는 절대 Fragment 사용 불가!! */}
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              {!isEditing && (
                <MenuItem
                  onClick={() => {
                    setIsEditing(true);
                    handleMenuClose();
                  }}
                >
                  수정
                </MenuItem>
              )}

              {!isEditing && (
                <MenuItem
                  onClick={() => {
                    handleDelete();
                    handleMenuClose();
                  }}
                >
                  삭제
                </MenuItem>
              )}

              {isEditing && (
                <MenuItem
                  onClick={() => {
                    handleUpdate();
                    handleMenuClose();
                  }}
                >
                  완료
                </MenuItem>
              )}

              {isEditing && (
                <MenuItem
                  onClick={() => {
                    setIsEditing(false);
                    handleMenuClose();
                  }}
                >
                  취소
                </MenuItem>
              )}
            </Menu>
          </>
        )}
      </Stack>

      {/* 댓글 내용 or 수정창 */}
      {!isEditing ? (
        <Typography sx={{ mt: 1 }}>{comment.content}</Typography>
      ) : (
        <TextField
          fullWidth
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          sx={{ mt: 1 }}
        />
      )}

      {/* 작성 시간 (오른쪽 아래 정렬) */}
      <Stack direction="row" justifyContent="flex-end">
        <Typography sx={{ fontSize: "0.75rem", color: "gray", mt: 0.5 }}>
          {formatDateTime(comment.createdAt)}
        </Typography>
      </Stack>
    </Box>
  );
}
