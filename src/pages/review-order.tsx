import React, { useState, useEffect, useContext } from 'react';
import { Button, Grid } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/system';
import { useWeb3React } from '@web3-react/core';
import { getClient } from '@/lib/graphql';
import { PageContext } from '../lib/context/page';
import { addAuction } from '../lib/redux/auctionBasketSlice';

const StyledHeader = styled(Grid)({
  padding: `10px 50px`,
});

const ReviewOrderPage = () => {
  const { setPageName } = React.useContext(PageContext);
  const auctions = useSelector((state) => state.auctionBasketReducer.auctions);
  const dispatch = useDispatch();

  useEffect(() => {
    //   if (query.verified) {
    //     enqueueSnackbar(`Your email address has been successfully verified!`, {
    //       variant: `success`,
    //     });
    //   }
    setPageName(`Review Order`);
  }, []);

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
