// 조직도 모달
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
  IconButton,
  Icon
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";
import { gridSpacing } from "store/constant";
import MainCard from "ui-component/cards/MainCard";
import EmployeeDetail from "./EmployeeDetailBase";
import EmployeeList from "./EmployeeList";
import OrganizationTree from "./OrganizationTree";

export default function OrganizationModal({ open, onClose, list = [], setList }) {
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      disableScrollLock
      // 둥근 모서리 고정 + 외곽 높이 고정 + 외곽 스크롤 금지
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px !important",
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
      PaperProps={{
        sx: {
          minWidth: "60vw",
          // width: "60vw",
          maxWidth: "60vw",
          height: "85vh", // 원래 유지하던 값 그대로
          // background: "transparent",
          boxShadow: "none",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "1.4rem",
        }}
      >
        조직도
      </DialogTitle>

      <Divider sx={{ mb: 2}} />

      <DialogContent
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid
          container
          spacing={gridSpacing}
          justifyContent="center"
          wrap="nowrap"
          sx={{
            flex: 1,
            flexWrap: "nowrap",
            alignItems: "stretch",
            overflow: "hidden", //그리드 레벨에서도 외부 스크롤 차단
            minHeight: "400px",
          }}
        >
          {/* 부서 */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              height: "100%",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden", // 컬럼 외부 스크롤 차단
            }}
          >
            <MainCard
              title="부서"
              content={false}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                border: "1px solid",
                '& .MuiCardHeader-root': {
                  padding: 1.5
                }
              }}
            >
              {/* 이 박스 안에서만 스크롤 */}
              <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                <OrganizationTree setSelectedDept={setSelectedDept} />
              </Box>
            </MainCard>
          </Grid>

          {/* 직원 목록 */}
          <Grid 
            size={{ xs: 12, md: 4 }}
            sx={{
              height: "100%",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* 가운데 컬럼도 독립 스크롤 */}
            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
              <EmployeeList
                selectedDept={selectedDept?.commonCodeId}
                setSelectedEmployee={setSelectedEmployee}
              />
            </Box>
            </Grid>
            {/* 화살표 */}
            <Grid
              size={{ md: 1}}
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}>
            {list.length > 0 && (
              <>
                {/* 수신자 */}
                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    top:"7%",
                    transform: "translate(-50%)",
                }}
                >
                  <IconButton
                  color="primary"
                  onClick={() => console.log("수신자 추가")}
                >
                  <ArrowForwardIcon />
                 </IconButton>
                </Box>

                {/* 수신자 X */}
                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "18%",
                    transform: "translate(-50%)",
                  }}>
                    <IconButton
                    color="error"
                    onClick={() => console.log("수신자 전체 삭제")}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>


                {/* 참조자 */}
                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "41%",
                    transform: "translate(-50%)",
                  }}>
                    <IconButton
                    color="primary"
                    onClick={() => console.log("참조자 추가")}
                  >
                      <ArrowForwardIcon />
                    </IconButton>
                  </Box>

                  {/* 참조자 */}
                  <Box
                  sx={{
                    position: "absolute",
                    right:0,
                    top: "52%",
                    transform: "translate(-50%)",
                  }}>
                    <IconButton
                    color="error"
                    onClick={() => console.log("참조자 전체 삭제")}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  {/* 숨은 참조 추가 */}
                  <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "75%",
                    transform: "translate(-50%)",
                  }}>
                    <IconButton
                    color="primary"
                    onClick={() => console.log("숨은 참조 추가")}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </Box> 

                  {/* 숨은 참조 X */}
                  <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "86%",
                    transform: 'translate(-50%)',
                  }}>
                    <IconButton
                    color="error"
                    onClick={() => console.log("숨은 참조 전체 삭제")}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
              </>
            )}
            </Grid>
                
          {/* 직원 상세 */}
          <Grid
            size={{ xs: 12, md: 3 }}
            sx={{
              height: "100%",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* 오른쪽 컬럼도 독립 스크롤 */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflow: "hidden", // 스크롤 제거
                display: "flex",
                flexDirection: list.length === 0 ? "column" : "column", // list가 있을 때만 가로 3분할
                justifyContent: "space-between", 
                gap: list.length === 0 ? 0 : 1,
            }}>

              {list.length === 0 ? (
                <EmployeeDetail employee={selectedEmployee} />
              ) : (
               list.map((item, id) => (  // 각 item은 수신자/참조자/숨은참조 역할
                <MainCard
                key={id}
                title={item.name} // 수신자, 참조자
                content={false}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid",
                  '& .MuiCardHeader-root': {
                  padding: 1.5
                }
                }}>
                  <Box sx={{
                      flex: 1,
                      minHeight: 0,
                      display: item.empList.length === 0 ? "flex" : "block",
                      alignItems: item.empList.length === 0 ? "center" : "unset", // unset : 초기 상태로.
                      justifyContent: item.empList.length === 0 ? "center" : "unset"
                     }}>
                    {item.empList && item.empList.length > 0 ? (
                      item.empList.map((emp, i) => (
                        <Typography key={i} variant="body2">
                          - {emp.name}, ({emp.positionName}, {emp.departmentName})
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" textAlign={"center"}>
                        직원이 없습니다.
                      </Typography>
                    ) }
                  </Box>
                </MainCard>
               ) ) 
            )
          } 
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
