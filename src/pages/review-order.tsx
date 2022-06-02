import React, { useEffect } from 'react';
import { Button, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { PageContext } from '../lib/context/page';
import { addAuction } from '../lib/redux/auctionBasketSlice';
import { RootState } from '../lib/redux/rootReducer';

const ReviewOrderPage = () => {
  const { setPageName } = React.useContext(PageContext);
  const auctions = useSelector(
    (state: RootState) => state.auctionBasketReducer.auctions,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    //   if (query.verified) {
    //     enqueueSnackbar(`Your email address has been successfully verified!`, {
    //       variant: `success`,
    //     });
    //   }
    setPageName(`Review Order`);
  }, [setPageName]);

  const mockAuction = { id: 1, data: `two` };

  return (
    <Grid
      container
      direction="column"
      alignItems="stretch"
      style={{ maxWidth: `1400px`, margin: `auto` }}
    >
      <Button onClick={() => dispatch(addAuction(mockAuction))}></Button>
      <ul>
        {auctions.map((item, i) => (
          <li key={i}>item.id</li>
        ))}
      </ul>
    </Grid>
  );
};

export default ReviewOrderPage;
