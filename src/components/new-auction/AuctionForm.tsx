import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Button from '../Button';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ZestyDateTimePicker from '../ZestyDateTimePicker';

interface Props {
  event: any;
  onClose: () => void;
  onSave: (startDate: Date, endDate: Date, price: number) => void;
}

interface BackdropProps {
  visible: boolean;
}

const StyledBackground = styled(Box, {
  shouldForwardProp: (prop) => prop !== `visible`,
})<BackdropProps>(({ theme, visible }) => ({
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

const StyledBackdrop = styled(Grid, {
  shouldForwardProp: (prop) => prop !== `visible`,
})<BackdropProps>(({ theme, visible }) => ({
  boxShadow: `0px 0px 5px #F89C24`,
  background: theme.palette.background.default,
  position: `absolute`,
  height: 350,
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
});

const AuctionForm: React.FC<Props> = ({ event, onClose, onSave }) => {
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

  return (
    <StyledBackground
      visible={!!event}
      onClick={() => {
        onClose();
      }}
    >
      <StyledBackdrop
        justifyContent={`space-between`}
        visible={!!event}
        direction={`column`}
      >
        <Grid>
          <StyledHeader>Starts</StyledHeader>
          <ZestyDateTimePicker date={currentEventStartDate} />
        </Grid>
        <Grid>
          <StyledHeader>Ends</StyledHeader>
          <ZestyDateTimePicker date={currentEventEndDate} />
        </Grid>
        <Grid>
          <StyledHeader>Price</StyledHeader>
          <StyledTextField
            placeholder="https://yourdomain.com/pageurl"
            variant="outlined"
            value={`Test`}
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
      </StyledBackdrop>
    </StyledBackground>
  );
};

export default AuctionForm;
