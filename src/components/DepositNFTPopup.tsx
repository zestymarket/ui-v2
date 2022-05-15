import React, { useState } from 'react';
import {
  Backdrop,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Button from './Button';
import { useZestyMarketUSDC, useZestyNFT } from '@/utils/hooks';

interface PopupProps {
  open: boolean;
  onClose: () => void;
}

interface StepProps {
  title: string;
  icon: string;
  stepCount: number;
  isCompleted?: boolean;
  completedLabel: string;
  buttonLabel: string;
  buttonDisabled?: boolean;
  onSelect: () => void;
}

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    padding: 32,
    width: 440,
    backgroundColor: `#fff`,
  },
});

const StyledBackdrop = styled(Backdrop, {
  name: `MuiModal`,
  slot: `Backdrop`,
  overridesResolver: (props, styles) => {
    return styles.backdrop;
  },
})({
  zIndex: -1,
  background: `rgba(19, 16, 30, 0.8)`,
  backdropFilter: `blur(18px)`,
  webkitBackdropFilter: `blur(18px)`,
});

const StyledTitle = styled(DialogTitle)({
  color: `#050407`,
  fontSize: 26,
  fontWeight: 700,
  padding: `0 0 24px`,
});

const StyledIconButton = styled(IconButton)({
  position: `absolute`,
  right: 16,
  top: 16,
  backgroundColor: `#837C99`,
  borderRadius: `50%`,
  padding: 4,
  color: `#fff`,
  '& svg': {
    height: 16,
    width: 16,
  },
});

const StyledContent = styled(DialogContent)({
  padding: `32px 0 0`,
});

const StyledFooterTitle = styled(Typography)({
  fontSize: 15,
  color: `#050407`,
  marginTop: 40,
  marginBottom: 4,
});

const StyledFooterLink = styled(Typography)(({ theme }) => ({
  fontSize: 15,
  fontWeight: 600,
  color: theme.palette.secondary.main,
}));

const StyledStep = styled(Grid)({
  borderBottom: `1px solid rgba(131, 124, 153, 0.2)`,
  padding: `12px 0`,
  userSelect: `none`,
  cursor: `pointer`,
  '.imageContainer': {
    transition: `padding-left 0.3s ease`,
  },
});
const StyledStepIcon = styled(`div`)<{ isCompleted: boolean }>(
  ({ theme, isCompleted }) => ({
    width: 40,
    height: 40,
    borderRadius: `50%`,
    borderWidth: isCompleted ? 0 : 1,
    borderStyle: `solid`,
    borderColor: theme.palette.primary.contrastText,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
    background: isCompleted
      ? `linear-gradient(227.67deg, #EF4B23 -60.77%, #F68823 78.53%)`
      : `none`,
  }),
);
const StyledStepTitle = styled(Typography)({
  color: `#5F5777`,
  fontSize: 15,
});
const StyledStepSubtitle = styled(Typography)({
  color: `#050407`,
  fontSize: 15,
  fontWeight: 600,
  marginBottom: 8,
});
const StyledCompleteLabel = styled(Typography)({
  color: `#28D659`,
  fontSize: 15,
  fontWeight: 600,
  marginLeft: 4,
});

const Step: React.FC<StepProps> = ({
  title,
  icon,
  stepCount,
  isCompleted,
  completedLabel,
  buttonLabel,
  buttonDisabled,
  onSelect,
}) => {
  return (
    <StyledStep container onClick={onSelect}>
      <Grid className={`imageContainer`} item>
        <StyledStepIcon isCompleted={!!isCompleted}>
          <img src={icon} alt={title} width={16} height={16} />
        </StyledStepIcon>
      </Grid>
      <Grid item flex={1} marginLeft={2}>
        <StyledStepTitle>Step {stepCount}</StyledStepTitle>
        <StyledStepSubtitle>{title}</StyledStepSubtitle>
        {isCompleted ? (
          <Stack flexDirection="row" alignItems="center">
            <img
              src="/icons/check.svg"
              alt="step-complete"
              width={16}
              height={16}
            />
            <StyledCompleteLabel>{completedLabel}</StyledCompleteLabel>
          </Stack>
        ) : (
          <Button
            sx={{ marginLeft: 0 }}
            disabled={buttonDisabled}
            onClick={onSelect}
          >
            {buttonLabel}
          </Button>
        )}
      </Grid>
    </StyledStep>
  );
};

// todo: take from props
const SPACE_ID = 50;
const DepositNFTPopup: React.FC<PopupProps> = ({ open, onClose }) => {
  const zestyMarketUSDC = useZestyMarketUSDC(true);
  const zestyNFT = useZestyNFT(true);

  const [isApproved, setIsApproved] = useState(false);
  const [isDeposited, setIsDeposited] = useState(false);

  const onApprove = async () => {
    const res = await zestyNFT.approve(zestyMarketUSDC.address, SPACE_ID);
    setIsApproved(true);
    await res.wait();
  };

  const onDeposit = async () => {
    const res = await zestyMarketUSDC.sellerNFTDeposit(SPACE_ID, 1);
    setIsDeposited(true);
    await res.wait();
  };

  return (
    <StyledDialog
      BackdropComponent={StyledBackdrop}
      BackdropProps={{
        timeout: 500,
      }}
      open={open}
      onClose={onClose}
    >
      <StyledTitle>
        Deposit NFT
        <StyledIconButton aria-label="close" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </StyledIconButton>
      </StyledTitle>
      <StyledContent>
        <DialogContentText>
          Please approve and deposit to use your space:
        </DialogContentText>
        <Step
          stepCount={1}
          title="Give permission to access your wallet"
          icon={isApproved ? `/icons/key-white.svg` : `/icons/key.svg`}
          isCompleted={isApproved}
          buttonLabel="Approve"
          completedLabel="Approved"
          onSelect={onApprove}
        />
        <Step
          stepCount={2}
          title="Deposit NFT"
          icon={
            isDeposited
              ? `/icons/crypto-wallet-white.svg`
              : `/icons/crypto-wallet.svg`
          }
          isCompleted={!!isDeposited}
          buttonLabel="Deposit"
          completedLabel="Deposited"
          buttonDisabled={!isApproved}
          onSelect={onDeposit}
        />

        <StyledFooterTitle>
          Do you have any questions about depositing?
        </StyledFooterTitle>
        <StyledFooterLink>See how it works</StyledFooterLink>
      </StyledContent>
    </StyledDialog>
  );
};

export default DepositNFTPopup;
