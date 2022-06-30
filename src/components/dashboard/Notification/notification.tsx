import React from 'react';

import {
  Card,
  CardContent,
  Link,
  Grid,
  Typography,
  styled,
} from '@mui/material';

import PaymentIcon from '@mui/icons-material/Payment';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import NewBid from './Bid';

const StyledCard = styled(Card)({
  position: `relative`,
  maxWidth: 900,
  overflow: `hidden`,
  width: `900px`,
  height: `100%`,
  borderBottom: `1px solid #FFFFFF`,
});

const StyledCardContent = styled(CardContent)({
  borderBottom: `1px solid #FFFFFF`,
  width: `980px`,
});

const StyledStepIcon = styled(`div`)<{ isCompleted: boolean }>(({ theme }) => ({
  width: 35,
  height: 35,
  borderRadius: `50%`,
  borderWidth: 1,
  borderStyle: `solid`,
  borderColor: `#EF4B23`,
  display: `flex`,
  justifyContent: `center`,
  alignItems: `center`,
}));

const NotificationTitle = styled(Typography)({
  fontSize: 16,
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 400,
  lineHeight: `22px`,
  marginLeft: 4,
});
const NotificationLink = styled(Link)({
  fontSize: 14,
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 400,
  lineHeight: `22px`,
  marginLeft: 4,
});

const NotificationCard = () => {
  return (
    <div>
      <StyledCard>
        <StyledCardContent>
          <Grid container spacing={3} direction="row" sx={{ height: `100%` }}>
            <Grid item>
              <StyledStepIcon>
                <AddCircleOutlineIcon fontSize="medium" />
              </StyledStepIcon>
            </Grid>
            <Grid item>
              <NewBid />
            </Grid>
          </Grid>
        </StyledCardContent>
      </StyledCard>
      <StyledCard>
        <StyledCardContent>
          <Grid container spacing={3} direction="row" sx={{ height: `100%` }}>
            <Grid item>
              <StyledStepIcon>
                <PaymentIcon fontSize="medium" />
              </StyledStepIcon>
            </Grid>
            <Grid item>
              <Grid container direction="column" sx={{ height: `100%` }}>
                <Grid item>
                  <NotificationTitle>
                    <b>$100</b> are now claimable
                  </NotificationTitle>
                </Grid>
                <Grid item>
                  <NotificationLink>Collect Now ➜</NotificationLink>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </StyledCardContent>
      </StyledCard>
      <StyledCard>
        <StyledCardContent>
          <Grid container spacing={3} direction="row" sx={{ height: `100%` }}>
            <Grid item>
              <StyledStepIcon>
                <EventBusyIcon fontSize="medium" />
              </StyledStepIcon>
            </Grid>
            <Grid item>
              <Grid container direction="column" sx={{ height: `100%` }}>
                <Grid item>
                  <NotificationTitle>
                    <b>Auction 1284</b> is now expired.
                  </NotificationTitle>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </StyledCardContent>
      </StyledCard>
    </div>
  );
};

export default NotificationCard;
