import React, { useEffect, useState } from 'react';
import { Grid, TableContainer, Table, TableBody } from '@mui/material';
import { useSelector } from 'react-redux';
import { PageContext } from '../lib/context/page';
import { RootState } from '../lib/redux/rootReducer';
import { TableBodyCell } from '@/components/based/AuctionDataTable/styles';
import {
  DataTableHead,
  stableSort,
  getComparator,
  StyledTableRow,
  AuctionData,
  Order,
  HeadCell,
} from '@/components/based/AuctionDataTable';

const headCells: readonly HeadCell[] = [
  {
    id: `id`,
    numeric: true,
    disablePadding: true,
    label: `ID`,
  },
  {
    id: `contractStartTime`,
    numeric: false,
    disablePadding: true,
    label: `Contract Start Time`,
  },
  {
    id: `duration`,
    numeric: false,
    disablePadding: true,
    label: `Duration`,
  },
  {
    id: `space`,
    numeric: false,
    disablePadding: true,
    label: `Space`,
  },
  {
    id: `price`,
    numeric: false,
    disablePadding: true,
    label: `Price`,
  },
];

const ReviewOrderPage = () => {
  const { setPageName } = React.useContext(PageContext);
  const [order, setOrder] = useState<Order>(`asc`);
  const [orderBy, setOrderBy] = useState<keyof AuctionData>(`id`);
  const auctions = useSelector(
    (state: RootState) => state.auctionBasketReducer.auctions,
  );
  const total = auctions.reduce((sum, auction) => (sum += auction.price), 0);
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof AuctionData,
  ) => {
    const isAsc = orderBy === property && order === `asc`;
    setOrder(isAsc ? `desc` : `asc`);
    setOrderBy(property);
  };

  useEffect(() => {
    //   if (query.verified) {
    //     enqueueSnackbar(`Your email address has been successfully verified!`, {
    //       variant: `success`,
    //     });
    //   }
    setPageName(`Review Order`);
  }, [setPageName]);

  return (
    <Grid
      container
      direction="column"
      alignItems="stretch"
      style={{ maxWidth: `1400px`, margin: `auto` }}
    >
      <h2>Space Details</h2>
      <TableContainer>
        <Table size="small">
          <DataTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={headCells}
          />

          <TableBody>
            {stableSort(auctions, getComparator(order, orderBy)).map(
              (row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <StyledTableRow hover tabIndex={-1} key={row.id}>
                    <TableBodyCell
                      align="right"
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.id}
                    </TableBodyCell>
                    <TableBodyCell align="left">
                      {row.contractStartTime}
                    </TableBodyCell>
                    <TableBodyCell align="left">{`${row.duration}`}</TableBodyCell>
                    <TableBodyCell align="left">{`${
                      (row as any).spaceName
                    }`}</TableBodyCell>
                    <TableBodyCell align="left">
                      <b>{row.price.toFixed(2)}</b>USDC
                    </TableBodyCell>
                  </StyledTableRow>
                );
              },
            )}
            <StyledTableRow tabIndex={-1}>
              <TableBodyCell style={{ borderBottom: 0 }} />
              <TableBodyCell style={{ borderBottom: 0 }} />
              <TableBodyCell style={{ borderBottom: 0 }} />
              <TableBodyCell align="left">
                <b>TOTAL</b>
              </TableBodyCell>
              <TableBodyCell align="left">
                <b>{total.toFixed(2)}</b>USDC
              </TableBodyCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <h2>Campaign Details</h2>
    </Grid>
  );
};

export default ReviewOrderPage;
