import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { Link, Grid, Typography, styled } from '@mui/material';

const NotificationTitle = styled(Typography)({
  fontSize: 16,
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 400,
  lineHeight: `22px`,
  marginLeft: 4,
});
// const NotificationLink = styled(Link)({
//   fontSize: 16,
//   fontFamily: `Inter`,
//   fontStyle: `normal`,
//   fontWeight: 400,
//   lineHeight: `22px`,
//   marginLeft: 4,
// });

const AcceptLink = styled(Link)({
  fontSize: 16,
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 400,
  display: `flex`,
  alignItems: `center`,
  lineHeight: `22px`,
  marginLeft: 4,
  color: `#28D659`,
  margin: `auto`,
});

const RejectLink = styled(Link)({
  fontSize: 16,
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 400,
  display: `flex`,
  alignItems: `center`,
  lineHeight: `22px`,
  marginLeft: 4,
  color: `#D64728`,
});
const StyledContent = styled(Typography)(({ theme }) => ({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 400,
  fontSize: `15px`,
  lineHeight: `18px`,
  color: `#E5E5E5`,
}));

const StyledName = styled(Typography)(({ theme }) => ({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 600,
  fontSize: `12px`,
  lineHeight: `15px`,
  letterSpacing: `0.1em`,
  color: `#837C99`,
}));

export default function Bid() {
  return (
    <Grid container spacing={1} direction="column" sx={{ width: `150%` }}>
      <Grid item>
        <NotificationTitle>
          <b>$100</b> are now claimable
        </NotificationTitle>
      </Grid>
      <Grid item>
        <Grid container spacing={2} direction="row" sx={{ height: `100%` }}>
          <Grid item>
            <StyledName>Start Time </StyledName>
            <StyledContent>Mar 21, 2022</StyledContent>
          </Grid>
          <Grid item>
            <StyledName>Duration</StyledName>
            <StyledContent>8 days</StyledContent>
          </Grid>
          <Grid item>
            <StyledName>Price</StyledName>
            <StyledContent>90 USDC</StyledContent>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={2} direction="row" sx={{ height: `100%` }}>
          <Grid item>
            <AcceptLink>
              <DoneIcon /> Accept
            </AcceptLink>
          </Grid>
          <Grid item>
            <RejectLink>
              <ClearIcon /> Reject
            </RejectLink>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
