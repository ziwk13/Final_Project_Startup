import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import AttachmentDropzone from 'features/attachment/components/AttachmentDropzone';

// material-ui
import { useColorScheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { ThemeMode } from 'config';
import { gridSpacing } from 'store/constant';
import ReactQuill from 'features/editor/components/ReactQuill';


// animation
function Transition(props) {
  return <Slide direction="up" {...props} />;
}

// 메일 API 함수 호출
import { sendMail, detailMail  } from '../api/mailAPI';

export default function MailWrite() {
	const navigate = useNavigate();
	const {mailId} = useParams();
	const isRewrite = !!mailId;

	// 요청할 메일 정보 데이터
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [to, setTo] = useState('');
	const [cc, setCc] = useState('');
	const [bcc, setBcc] = useState('');
  const [attachments, setAttachments] = useState([]);


  const [open, setOpen] = useState(false);
  const { colorScheme } = useColorScheme();

  const [ccBccValue, setCcBccValue] = useState(false);
  const handleCcBccChange = (event) => {
	setCcBccValue((prev) => !prev);
  };

  let composePosition = {};

  const [position, setPosition] = useState(true);
  if (!position) {
	composePosition = {
	  '& .MuiDialog-container': {
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		'& .MuiPaper-root': { mb: 0, borderRadius: '12px 12px 0px 0px', maxWidth: 595 }
	  }
	};
  }

	const handleSendMail = async () => {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('content', content);
    formData.append('to', to);
    formData.append('cc', cc);
    formData.append('bcc', bcc);

    // Dropzone 파일 중 서버파일이 아닌 것만 실제 업로드
    attachments.forEach(file => {
      if (!file.isServerFile) {
        formData.append('files', file);
      }
    });

    try {
      await sendMail(formData);
      navigate('/mail/list/INBOX');
    } catch (err) {
      console.error(err);
      alert('메일 발송 중 오류가 발생했습니다.');
    }
  };

	// 재작성일 때: 기존 메일 detail 불러오기
  useEffect(() => {
    if (!isRewrite) return;

    detailMail(mailId)
      .then(res => {
        const data = res.data.data;

        setTitle(data.title);
        setContent(data.content);
        setTo(data.to?.join(', ') || '');
        setCc(data.cc?.join(', ') || '');
        setBcc(data.bcc?.join(', ') || '');

        // 기존 첨부파일 Dropzone에 맞게 가공
        if (data.attachments) {
          setAttachments(
            data.attachments.map(file => ({
              ...file,
              isServerFile: true // 기존 파일임 표시
            }))
          );
        }
      })
      .catch(console.error);
  }, [mailId]);

  return (
	<Grid container spacing={gridSpacing}>
		<Grid size={12}>
			<MainCard>
				<Grid container spacing={gridSpacing}>
				<Grid size={12}>
					<Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
					<Button variant="contained" onClick={handleSendMail}>발송</Button>

					<Link
						component={RouterLink}
						to="#"
						color={colorScheme === ThemeMode.DARK ? 'primary' : 'secondary'}
						onClick={handleCcBccChange}
						underline="hover"
					>
						CC & BCC
					</Link>
					</Box>
				</Grid>
				<Grid size={12}>
					<TextField fullWidth label="제목" value={title} onChange = {e => setTitle(e.target.value)}/>
				</Grid>
				<Grid size={12}>
					<TextField fullWidth label="수신자" value={to} onChange = {e => setTo(e.target.value)}/>
				</Grid>
				<Grid sx={{ display: ccBccValue ? 'block' : 'none' }} size={12}>
					<Collapse in={ccBccValue}>
					{ccBccValue && (
						<Grid container spacing={gridSpacing}>
							<Grid size={12}>
								<TextField fullWidth label="참조" value={cc} onChange = {e => setCc(e.target.value)}/>
							</Grid>
							<Grid size={12}>
								<TextField fullWidth label="숨은 참조" value={bcc} onChange = {e => setBcc(e.target.value)}/>
							</Grid>
						</Grid>
					)}
					</Collapse>
				</Grid>

				{/* quill editor */}
				<Grid size={12}>
					<ReactQuill value={content} onChange = {setContent} />
				</Grid>
				<Grid size={12}>
					<AttachmentDropzone attachments={attachments} setAttachments={setAttachments} height={"150px"}/>
				</Grid>
				</Grid>
			</MainCard>
		</Grid>
	</Grid>
  );
}
