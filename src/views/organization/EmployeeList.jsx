import React, { useEffect, useState } from "react";
import { organizationAPI } from "../../api/organizationApi";
import { List, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";

export default function EmployeeList({ selectedDept, setSelectedEmployee }) {
    const [ employees, setEmployees ] = useState([]);

    useEffect(() => {
        if (!selectedDept) return;
        organizationAPI
        .getEmployeesByDeptCode(selectedDept)
        .then((data) => setEmployees(data || []))
        .catch((err) => 
            console.error("직원 목록 가져오기 실패", err));
        
    }, [selectedDept]);

    return (
            <Paper sx={{ height: "100%", p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>직원 목록</Typography>
            {employees.length === 0 ? (
                <Typography color="text.secondary">직원이 없습니다.</Typography>
            ) : (
                <List>
                    {employees.map((emp) => (
                        <ListItemButton key={emp.employeeId} onClick={() => setSelectedEmployee(emp)}>
                            <ListItemText
                            primary={emp.name}
                            secondary={`${emp.position} / ${emp.deptName}`}
                            />
                        </ListItemButton>
                    ))}
                </List>
            )}
        </Paper>
    );
}