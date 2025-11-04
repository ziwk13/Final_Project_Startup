// EmployeeDetail
// 직원 정보 컴포넌트
import React from "react";
import { Box, Typography, Divider, Avatar } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";

function EmployeeDetail({ selectedEmployee }) {
  if (!selectedEmployee) {

    return (
      <MainCard title="직원 상세" content={false} sx={{ height: "100%" }}>
        <Box
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
          }}
        >
          직원을 선택하세요.
        </Box>
      </MainCard>
    );
  }

  // 더미 데이터, 백엔드 DTO 모두 호환되게 key 안전하게 매핑
  const name = selectedEmployee.name || selectedEmployee.employeeName || "-";
  const position = selectedEmployee.position || selectedEmployee.positionName || "-";
  const department =
    selectedEmployee.department ||
    selectedEmployee.departmentName ||
    "-";
  const email = selectedEmployee.email || "-";
  const phoneNumber = selectedEmployee.phoneNumber || selectedEmployee.phone || "-";
  const hireDate = selectedEmployee.hireDate || "-";
  const profileImg = selectedEmployee.profileImg || selectedEmployee.profileUrl || "";

  return (
    <MainCard title="직원 상세" content={false} sx={{ height: "100%" }}>
      <Box sx={{ p: 3 }}>
        {/* 프로필 영역 */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            alt={name}
            src={profileImg}
            sx={{ width: 64, height: 64, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {position} / {department}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* 상세 정보 */}
        <Typography variant="body2">
          <strong>이메일:</strong> {email}
        </Typography>
        <Typography variant="body2">
          <strong>전화번호:</strong> {phoneNumber}
        </Typography>
        <Typography variant="body2">
          <strong>입사일:</strong> {hireDate}
        </Typography>


        <Divider sx={{ my: 2 }} />

        <Typography variant="body2">
          <strong>소속 부서:</strong>{department}
        </Typography>

      </Box>
    </MainCard>
  );
}

export default EmployeeDetail;
