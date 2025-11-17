// 안전한 Date 파서 (마이크로초 제거)
function safeParseDate(date) {
  if (!date) return new Date();
  const trimmed = typeof date === 'string' ? date.split('.')[0] : date;
  return new Date(trimmed);
}

// 날짜
function formatKoreanDate(date) {
  const d = safeParseDate(date);
  const day = d.getDay();
  const week = ['일', '월', '화', '수', '목', '금', '토'];

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const dayNum = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${dayNum}(${week[day]})`;
}

// 날짜2
function formatDate(date) {
  const d = safeParseDate(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const dayNum = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${dayNum}`;
}

export default function ApprovalFormHeader({ title, draftUser, draftDept, draftDate, docNo, draftPosition, approvalLines }) {
  const displayDate = formatKoreanDate(draftDate);
  const displayDate2 = formatDate(draftDate);

  let approver = null;

  approver = [...approvalLines]
    .reverse()
    .find((line) => ['APPROVED', 'REJECTED', 'IN_PROGRESS', 'AWAITING', 'PENDING'].includes(line.approvalStatus?.value1));

  return (
    <>
      {/* 제목 */}
      <h1 className="approval-title">{title}</h1>

      {/* 헤더 전체 레이아웃 */}
      <div
        style={{
          display: 'flex',
          gap: approver ? '240px' : '350px',
          justifyContent: 'center',
          marginBottom: '20px'
        }}
      >
        {/* 왼쪽 기안자 정보 */}
        <table className="info-table" style={{ width: '400px' }}>
          <tbody>
            <tr>
              <td className="th">기안자</td>
              <td className="td">{draftUser}</td>
            </tr>
            <tr>
              <td className="th">소속</td>
              <td className="td">{draftDept}</td>
            </tr>
            <tr>
              <td className="th">기안일</td>
              <td className="td">{displayDate}</td>
            </tr>
            <tr>
              <td className="th">문서번호</td>
              <td className="td">{docNo}</td>
            </tr>
          </tbody>
        </table>

        {/* 오른쪽 결재선 */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <table className="sign-table-split">
            <tbody>
              <tr>
                <td className="sign-th-vertical" rowSpan={3}>
                  신청
                </td>
                <td className="sign-rank-horizontal">{draftPosition}</td>
              </tr>
              <tr>
                <td className="sign-name-horizontal">{draftUser}</td>
              </tr>
              <tr>
                <td className="sign-blank-horizontal" style={{ fontSize: '14px' }}>
                  {approver ? displayDate2 : ''}
                </td>
              </tr>
            </tbody>
          </table>

          {approver && (
            <table className="sign-table-split">
              <tbody>
                <tr>
                  <td className="sign-th-vertical" rowSpan={3}>
                    승인
                  </td>
                  <td className="sign-rank-horizontal">{approver.approver.position}</td>
                </tr>
                <tr>
                  <td className="sign-name-horizontal">{approver.approver.name}</td>
                </tr>
                <tr>
                  <td className="sign-blank-horizontal" style={{ fontSize: '14px' }}>
                    {approver.approvalDate ? formatDate(approver.approvalDate) : ''}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
