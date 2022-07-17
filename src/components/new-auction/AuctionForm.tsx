import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Button from '../Button';
import ZestyDateTimePicker from '../ZestyDateTimePicker';
import InputAdornment from '@mui/material/InputAdornment';

const today = new Date();
today.setHours(0, 0, 0, 0);

interface Props {
  event: any;
  onClose: () => void;
  onDelete: () => void;
  onSave: (startDate: Date, endDate: Date, price: number) => void;
}

interface BackdropProps {
  visible: boolean;
}

const StyledBackground = styled(Box, {
  shouldForwardProp: (prop) => prop !== `visible`,
})<BackdropProps>(({ visible }) => ({
  backgroundColor: `#00000057`,
  width: `100%`,
  height: `100%`,
  zIndex: 10,
  top: 0,
  position: `fixed`,
  transition: `opacity 0.5s`,
  opacity: visible ? 1 : 0,
  pointerEvents: visible ? `unset` : `none`,
}));

const StyledBackdrop = styled(Grid)(({ theme }) => ({
  boxShadow: `0px 0px 5px #F89C24`,
  background: theme.palette.background.default,
  position: `absolute`,
  height: 400,
  width: 250,
  padding: 20,
  margin: 20,
  marginTop: 100,
  borderRadius: `8px`,
  zIndex: 10,
  display: `flex`,
}));

const StyledHeader = styled(Typography)({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 600,
  fontSize: `15px`,
  lineHeight: `18px`,
  paddingBottom: 8,
});

const StyledTextField = styled(TextField)({
  width: `100%`,
  minHeight: 26,
  '& fieldset': {
    borderColor: `#ffffff30`,
    borderRadius: 8,
  },
  '& .MuiInputBase-input': {
    padding: 10,
    fontFamily: `Inter`,
    fontStyle: `normal`,
    fontWeight: 400,
    fontSize: `15px`,
    lineHeight: `18px`,
  },
  '& p': {
    color: `white`,
  },
});

const StyledDelete = styled(`div`)({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  textAlign: `center`,
  fontWeight: 600,
  fontSize: `15px`,
  lineHeight: `18px`,
  cursor: `pointer`,
  userSelect: `none`,
  textDecoration: `underline`,
});

const AuctionForm: React.FC<Props> = ({ event, onClose, onDelete, onSave }) => {
  const [currentEventStartDate, setCurrentEventStartDate] = useState<Date>(
    new Date(),
  );
  const [currentEventEndDate, setCurrentEventEndDate] = useState<Date>(
    new Date(Date.now() + 3600 * 1000 * 24),
  );
  const [currentEventPrice, setCurrentEventPrice] = useState<number>(0);

  useEffect(() => {
    if (event) {
      setCurrentEventStartDate(event.start);
      setCurrentEventEndDate(event.end);
      setCurrentEventPrice(event.price);
    }
  }, [event]);

  const bgClassName = `auction-form-bg`;

  return (
    <StyledBackground
      visible={!!event}
      className={bgClassName}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).classList.contains(bgClassName)) {
          onClose();
        }
      }}
    >
      <StyledBackdrop justifyContent={`space-between`} direction={`column`}>
        <Grid>
          <StyledHeader>Starts</StyledHeader>
          <ZestyDateTimePicker
            date={currentEventStartDate}
            onChange={(e: Date) => {
              if (e >= currentEventEndDate) {
                setCurrentEventEndDate(
                  new Date(e.getTime() + 60 * 60 * 24 * 1000),
                );
              }
              setCurrentEventStartDate(e);
            }}
          />
        </Grid>
        <Grid>
          <StyledHeader>Ends</StyledHeader>
          <ZestyDateTimePicker
            date={currentEventEndDate}
            onChange={(e: Date) => {
              if (e <= currentEventStartDate) {
                // Mitigates creation of dates in the past
                const newDate = new Date(e.getTime() - 60 * 60 * 24 * 1000);
                if (newDate < today) {
                  setCurrentEventStartDate(today);
                  e = new Date(today.getTime() + 60 * 60 * 24 * 1000);
                } else {
                  setCurrentEventStartDate(newDate);
                }
              }
              setCurrentEventEndDate(e);
            }}
          />
        </Grid>
        <Grid>
          <StyledHeader>Price</StyledHeader>
          <StyledTextField
            placeholder="https://yourdomain.com/pageurl"
            variant="outlined"
            value={currentEventPrice}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">USDC</InputAdornment>
              ),
            }}
            onChange={(e: any) => {
              if (isNaN(e.target.value)) {
                return;
              }
              setCurrentEventPrice(parseInt(e.target.value) || 0);
            }}
          />
        </Grid>
        <Button
          onClick={() => {
            onSave(
              currentEventStartDate,
              currentEventEndDate,
              currentEventPrice,
            );
          }}
        >
          Create Auction
        </Button>
        <StyledDelete onClick={onDelete}>Remove event</StyledDelete>
      </StyledBackdrop>
    </StyledBackground>
  );
};

export default AuctionForm;
