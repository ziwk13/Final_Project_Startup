import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import AttachmentDropzone from 'features/attachment/components/AttachmentDropzone';

export default function SyncHRModal({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          maxWidth: '50vw',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.4rem' }}>
          {'인사연동'}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          CSV 파일로 업로드해 주세요.
        </Typography>
      </DialogTitle>
      <Divider sx={{ mb: 2 }} />

      <DialogContent sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '0 24px' }}>
        <AttachmentDropzone />
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 2, pt: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}