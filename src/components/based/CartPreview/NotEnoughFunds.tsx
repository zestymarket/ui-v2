import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function NotEnoughFunds({ onCancel }: { onCancel: () => void }) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    onCancel();
    setOpen(false);
  };

  function handleBuyUSDC() {
    window.open(`https://buy.moonpay.com/?defaultCurrencyCode=usdc_polygon`);
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`You do not have enough USDC.`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please buy more USDC.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleBuyUSDC} autoFocus>
            Buy USDC
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
