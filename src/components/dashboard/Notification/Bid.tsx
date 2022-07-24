import React from 'react';
// import DoneIcon from '@mui/icons-material/Done';
// import ClearIcon from '@mui/icons-material/Clear';
import { Link, Grid, Typography, styled } from '@mui/material';
import Button from '@/components/Button';
import { useRouter } from 'next/router';

interface BidProps {
  auctionLink: Element;
  price: string;
  txLink: string;
  id: string;
}
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

// const AcceptLink = styled(Link)({
//   fontSize: 16,
//   fontFamily: `Inter`,
//   fontStyle: `normal`,
//   fontWeight: 400,
//   display: `flex`,
//   alignItems: `center`,
//   lineHeight: `22px`,
//   marginLeft: 4,
//   color: `#28D659`,
//   margin: `auto`,
// });

// const RejectLink = styled(Link)({
//   fontSize: 16,
//   fontFamily: `Inter`,
//   fontStyle: `normal`,
//   fontWeight: 400,
//   display: `flex`,
//   alignItems: `center`,
//   lineHeight: `22px`,
//   marginLeft: 4,
//   color: `#D64728`,
// });
const StyledContent = styled(Typography)({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 400,
  fontSize: `13px`,
  lineHeight: `18px`,
  color: `#E5E5E5`,
});

const StyledName = styled(Typography)({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 600,
  fontSize: `12px`,
  lineHeight: `15px`,
  letterSpacing: `0.1em`,
  color: `#837C99`,
});
const Bid: React.FC<BidProps> = ({ auctionLink, price, txLink, id }) => {
  const router = useRouter();

  return (
    <Grid container spacing={1} direction="column" sx={{ width: `150%` }}>
      <Grid item>
        <NotificationTitle>
          <>New auction offer on {auctionLink}</>
        </NotificationTitle>
      </Grid>
      <Grid item>
        <Grid container spacing={2} direction="row" sx={{ height: `100%` }}>
          <Grid item>
            <StyledName>Price</StyledName>
            <StyledContent>{price}</StyledContent>
          </Grid>
          <Grid item>
            <StyledName>Transaction Link</StyledName>

            <StyledContent>
              <a href={txLink}>Transaction Link ➜</a>
            </StyledContent>
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Grid container spacing={2} direction="row" sx={{ height: `100%` }}>
          <Grid item>
            <Button
              onClick={() => {
                router.push(id);
              }}
            >
              Approve or Reject
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default Bid;
