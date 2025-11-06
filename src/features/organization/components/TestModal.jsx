import { useState } from "react";
import OrganizationModal from "./OrganizationModal";

export default function TestModal() {
  const [open, setOpen] = useState(true);

  // 임시 테스트용 데이터
  const [list, setList] = useState([
    {
      name: "수신자",
      empList: [
        { name: "홍길동", positionName: "대리", departmentName: "영업팀" },
        { name: "김민수", positionName: "사원", departmentName: "마케팅팀" }
      ]
    },
    {
      name: "참조자",
      empList: [
        { name: "권형택", positionName: "조장", departmentName: "구디" }
      ]
    },
    {
      name: "숨은참조",
      empList: [
        { name: "이영희", positionName: "과장", departmentName: "인사팀" }
      ]
    }
  ]);

  return (
    <OrganizationModal
      open={open}
      onClose={() => setOpen(false)}
      list={list}
      setList={setList}
    />
  );
}
