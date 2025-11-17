import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddApproval from '../components/AddApproval';
import { getApprovalDetail } from '../api/approvalAPI';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

export default function ApprovalDetailPage() {
  const { docId } = useParams();
  const [detailData, setDetailData] = useState(null);

  const breadcrumbItems = [{ label: '홈', link: '/' }, { label: '전자결재', link: '/approval' }, { label: '결재 상세' }];

  useEffect(() => {
    async function fetchDetail() {
      const result = await getApprovalDetail(docId);

      setDetailData(result);
    }
    fetchDetail();
  }, [docId]);

  if (!detailData) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <>
      <Breadcrumbs title="결재 상세" breadcrumbItems={breadcrumbItems} />
      <AddApproval readOnly={true} initialData={detailData} />
    </>
  );
}
