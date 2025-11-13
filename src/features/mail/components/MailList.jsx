import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteMail, moveMail, getMailList } from '../api/mailAPI';


// material-ui
import {Box, Pagination, MenuItem, Menu, Checkbox, Grid, Button} from '@mui/material';

// project imports
import MailContents from './MailContents';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CommonDataGrid from '../../list/components/CommonDataGrid';

export default function MailList({mailboxType}) {
	const [selectedMailIds, setSelectedMailIds] = useState([]);		// boxId 목록
	const [selectedMailData, setSelectedMailData] = useState([]); // mail 객체 목록
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [size, setSize] = useState(10);
  const [anchorEl, setAnchorEl] = React.useState(null);
	const [reload, setReload] = useState(false);
	const [rows, setRows] = useState([]);
	const [columns, setColumns] = useState([]);

	const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

	const handleSelectedIdsChange = (ids, mailObjects) => {
		setSelectedMailIds(ids);
		setSelectedMailData(mailObjects || []);
	};

	// 메일 재작성
	const handleRewrite = () => {
		if(selectedMailData.length !== 1) {
			alert("재작성할 메일을 하나만 선택하세요.");
			return;
		}

		const mailId = selectedMailData[0].mailId;
		navigate(`/mail/write/${mailId}`);
	}
	
	// 메일함 이동
	const handleMove = async (mailboxType) => {
		if (selectedMailIds.length === 0) {
			alert("이동할 메일을 선택하세요.");
			return;
		}

		try {
			await moveMail(selectedMailIds, mailboxType);  // 메일함 이동(개인보관함, 휴지통)
			setSelectedMailIds([]);
			setReload(prev => !prev);
		} catch (err) {
			console.error(err);
			alert("이동 실패");
		}
	};

	// 메일 삭제
	const handleDelete = async (mailboxType) => {
		if (selectedMailIds.length === 0) {
			alert("삭제할 메일을 선택하세요.");
			return;
		}

		try {
			await deleteMail(selectedMailIds, mailboxType);
			setSelectedMailIds([]);
			setReload(prev => !prev);
		} catch (err) {
			console.error(err);
			alert("삭제 실패");
		}
	}

	// 메일 리스트 조회
	const loadList = () => {
		getMailList(mailboxType, page, size)
			.then((res) => {
				const list = res.content.map((mail) => ({
					id : mail.boxId,
					...mail,
					senderReceiver :
						mailboxType === "SENT" ? mail.receivers?.join(', ') || "수신자 없음" : mail.senderName
				}));

				setRows(list);
				setTotalPages(res.totalPages);
				setSelectedMailIds([]);
				setSelectedMailData([]);
			})
			.catch(console.error);
	}

	// 체크박스 선택 (단일)
	const handleSelectOne = (row) => {
		setSelectedMailIds((prev) => {
			const updated = prev.includes(row.boxId) ? prev.filter((id) => id !== row.boxId) : [...prev, row.boxId];
			const target = rows.filter((r) => updated.includes(r.boxId));
			setSelectedMailData(target);
			return updated;
		})
	}
	
	// 체크박스 선택 (전체)
	const handleSelectAll = () => {
		if(selectedMailIds.length === rows.length) {
			setSelectedMailIds([]);
			setSelectedMailData([]);
		} else {
			const all = rows.map((r) => r.boxId);
			const allObjects = [...rows];
			setSelectedMailIds(all);
			setSelectedMailData(allObjects);
		}
	}

	useEffect(() => {
		setSelectedMailIds([]);
		setSelectedMailData([]);
		setPage(0);
	}, [mailboxType]);

	useEffect(() => {
		setSelectedMailIds([]);
	}, [page, size]);

	// 리스트 호출 useEffect
	useEffect(() => {
		loadList();
	}, [mailboxType, page, size, reload]);

	// 리스트 테이블 정의
	useEffect(() => {
		setColumns([
			{
				field: 'checkbox',
				headerName: '',
				width: 60,
				sortable: false,
				renderHeader: () => (
					<Checkbox
						checked={selectedMailIds.length === rows.length && rows.length > 0}
						indeterminate={
							selectedMailIds.length > 0 &&
							selectedMailIds.length < rows.length
						}
						onChange={handleSelectAll}
					/>
				),
				renderCell: (params) => (
					<Checkbox
						checked={selectedMailIds.includes(params.row.boxId)}
						onClick={(e) => {
							e.stopPropagation();
							handleSelectOne(params.row);
						}}
					/>
				)
			},
			{
				field: 'isRead',
				headerName: '',
				width: 50,
				renderCell: (params) =>
					params.row.isRead ? (
						<span style={{ color: '#1976d2' }}>📨</span>
					) : (
						<span>✉️</span>
					)
			},
			{
				field: 'senderReceiver',
				headerName: mailboxType === 'SENT' ? '받는 사람' : '보낸 사람',
				flex: 1,
				minWidth: 150
			},
			{ field: 'title', headerName: '제목', flex: 2 },
			{
				field: 'receivedAt',
				headerName: '받은 날짜',
				width: 180,
				valueFormatter: (params) =>
					new Date(params.value).toLocaleString('ko-KR', {
						year: '2-digit',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit',
						hour12: false
					})
			}
		]);
	}, [rows, selectedMailIds, mailboxType]);

  return (
    <MainCard
      title={
        <Grid container spacing={gridSpacing} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{display:"flex", gap:"5px"}}>
						<Button variant="contained" onClick={() => navigate(`/mail/write`)}>작성</Button>
						{mailboxType === "SENT" && <Button variant="contained" onClick={handleRewrite}>재작성</Button>}
						{mailboxType !== "MYBOX" && <Button variant="contained" onClick={() => handleMove("MYBOX")}>개인보관함으로 이동</Button>}
						{mailboxType !== "TRASH" && <Button variant="contained" onClick={() => handleMove("TRASH")}>휴지통으로 이동</Button>}
						{mailboxType === "TRASH" && <Button variant="contained" onClick={() => handleDelete("TRASH")}>영구삭제</Button>}
					</Box>
          <Grid>
						<Box sx={{display:"flex"}}>
							<Button size="large" sx={{ color: 'grey.900' }} color="secondary" endIcon={<ExpandMoreRoundedIcon />} onClick={handleClick}>
								{size}개씩 보기
							</Button>
							{anchorEl && (
								<Menu
									id="menu-user-list-style1"
									anchorEl={anchorEl}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={handleClose}
									variant="selectedMenu"
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right'
									}}
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right'
									}}
								>
									<MenuItem onClick={() => {setSize(10); setPage(0); handleClose();}}>10개씩 보기</MenuItem>
									<MenuItem onClick={() => {setSize(20); setPage(0); handleClose();}}>20개씩 보기</MenuItem>
									<MenuItem onClick={() => {setSize(30); setPage(0); handleClose();}}>30개씩 보기</MenuItem>
								</Menu>
							)}
						</Box>
          </Grid>
        </Grid>
      }
      content={false}
    >
      {/* <CommonDataGrid rows={rows} columns={columns} loading={false} onRowClick={(params) => navigate(`/mail/detail/${params.row.mailId}`)}/> */}
				<MailContents mailboxType = {mailboxType} onSelectedIdsChange={handleSelectedIdsChange} page={page} setPage={setPage} setTotalPages={setTotalPages} size={size} reload={reload}/>
      
			<Grid sx={{ p: 3 }} size={12}>
        <Grid container spacing={gridSpacing} sx={{ justifyContent: 'center' }}>
          <Grid>
            <Pagination count={totalPages} page={page + 1} onChange={(e, value) => setPage(value - 1)} color="primary" />
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
}
