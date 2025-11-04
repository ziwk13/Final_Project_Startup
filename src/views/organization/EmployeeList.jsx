// EmployeeList 
// 직원 목록 컴포넌트
// - 좌측 부서 트리에서 부서를 클릭했을 때, 해당 부서의 직원들을 불러와 보여줌.

import { List, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { organizationAPI } from "../../api/organizationApi";

// 컴포넌트
export default function EmployeeList({ selectedDept, setSelectedEmployee }) {
    // 직원 목록 데이터를 저장할 state
    const [employees, setEmployees] = useState([]);
    const [activeId, setActiveId] = useState(null);

    // 1. 부서가 선택될 때마다 직원 목록을 새로 불러옴
    useEffect(() => {
        if (!selectedDept) return;  // 선택된 부서가 없으면 API 호출 X
        organizationAPI
            .getEmployeesByDeptCode(selectedDept)  // 백엔드 API 요청
            .then((data) => {
                console.log("받아온 직원 데이터:", data);
                // 데이터가 배열 형태인지 검증하고, 아니면 빈 배열로 초기화
                setEmployees(Array.isArray(data) ? data : []);
                setActiveId(null);
            })
            .catch((err) =>
                console.error("직원 목록 가져오기 실패", err));
    }, [selectedDept]);  // 의존성 배열 -> selectedDept가 변경될 때마다 실행됨.

    // 2. 렌더링
    return (
        // 직원목록 , 인원 수 표시
        <Paper sx={{ height: "100%", p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>직원 목록
                <Typography component="span" color="text.secondary" variant="body2">
                    ({employees.length}명)
                </Typography>
            </Typography>
            {employees.length === 0 ? (
                <Typography color="text.secondary">직원이 없습니다.</Typography>
            ) : (
                // 직원 리스트
                <List>
                    {employees.map((emp) => {
                        const id = emp.employeeId || emp.id;
                        return (
                            <ListItemButton
                                key={id}
                                onClick={() => {
                                    setActiveId(id);

                                    const mappedEmp = {
                                        employeeId: emp.employeeId || emp.id,
                                        name: emp.name || "-",
                                        position: emp.position || "-",
                                        department: emp.deptName ||
                                            emp.departmentName ||
                                            emp.department || "-",
                                        email: emp.email || "-",
                                        phoneNumber: emp.phoneNumber || "-",
                                        hireDate: emp.hireDate || "-",
                                        profileImg: emp.profileImg || ""
                                    };

                                    setSelectedEmployee(mappedEmp)
                                }}
                                sx={{
                                    pl: 2,
                                    mb: 0.5,
                                    borderRadius: 1,
                                    backgroundColor:
                                        activeId === id
                                            ? "rgba(145, 125, 240, 0.25)" // 클릭된 항목만 진한 보라색
                                            : "transparent",
                                    "&:hover": {
                                        backgroundColor:
                                            activeId === id
                                                ? "rgba(145, 125, 240, 0.25)" // 클릭된 건 hover 시 그대로
                                                : "rgba(145, 125, 240, 0.1)", // 안 클릭된 건 hover 시 연한색
                                    },
                                    transition: "background-color 0.15s ease-in-out",
                                }}
                            >
                                <ListItemText
                                    primary={`-  ${emp.name}`}
                                    secondary={`${emp.position}`}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
            )}
        </Paper>
    );
}