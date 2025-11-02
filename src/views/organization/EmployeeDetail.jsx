// src/views/organization/EmployeeDetail.jsx
import React from "react";
import { Paper, Typography, Divider } from "@mui/material";

export default function EmployeeDetail({ selectedEmployee }) {
  if (!selectedEmployee)
    return (
      <Paper sx={{ height: "100%", p: 2 }}>
        <Typography color="text.secondary">직원을 선택하세요.</Typography>
      </Paper>
    );

  const { name, position, deptName, email, phone } = selectedEmployee;

  return (
    <Paper sx={{ height: "100%", p: 2 }}>
      <Typography variant="h6">{name}</Typography>
      <Divider sx={{ my: 1 }} />
      <Typography>직급: {position}</Typography>
      <Typography>부서: {deptName}</Typography>
      <Typography>이메일: {email}</Typography>
      <Typography>전화번호: {phone}</Typography>
      <Typography>입사일: 2024-01-01</Typography>
    </Paper>
  );
}
