import React, { FC, useCallback, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import visuallyHidden from '@mui/utils/visuallyHidden';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Auction, { AUCTION_STATUS } from '@/utils/classes/Auction';
import { styled } from '@mui/material';
import { RootState } from '../../../lib/redux/rootReducer';
import {
  TableHeadCell,
  TableCustomHead,
  Wrapper,
  TableBodyCell,
  ActionSection,
  CustomPagination,
  Navigation,
  NavigationButton,
} from './styles';
import AuctionDataCampaingCell from './AuctionDataCampaingCell';
import { useTheme } from '@mui/styles';
import Image from 'next/image';
import { addAuction, removeAuctionById } from '@/lib/redux/auctionBasketSlice';
import { useDispatch, useSelector } from 'react-redux';
import CartPreview from '../CartPreview';

export interface AuctionData {
  id: number;
  contractStartTime: string;
  duration: string;
  campaign: number;
  price: number;
  status: AUCTION_STATUS;
}

export interface AuctionBasketData {
  id: number;
  contractTimeStart: string;
  contractTimeEnd: string;
  auctionTimeStart: string;
  priceStart: string;
  name: string;
  format: string;
}

function createData(
  id: number,
  contractStartTime: string,
  duration: string,
  campaign: number,
  price: number,
  status: AUCTION_STATUS,
): AuctionData {
  return {
    id,
    contractStartTime,
    duration,
    campaign,
    price,
    status,
  };
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof AuctionData | string;
  label: string;
  numeric: boolean;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === `desc`
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface IDataTableHead {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof AuctionData,
  ) => void;
  order: Order;
  orderBy: string;
  headCells: readonly HeadCell[];
}

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
    id: `campaign`,
    numeric: false,
    disablePadding: true,
    label: `Campaign`,
  },
  {
    id: `price`,
    numeric: false,
    disablePadding: true,
    label: `Price`,
  },
  {
    id: `status`,
    numeric: false,
    disablePadding: true,
    label: `Status`,
  },
];

const DataTableHead: FC<IDataTableHead> = ({
  onRequestSort,
  order,
  orderBy,
  headCells,
}) => {
  const createSortHandler =
    (property: keyof AuctionData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableCustomHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableHeadCell
            key={headCell.id}
            align={headCell.numeric ? `right` : `left`}
            padding={headCell.disablePadding ? `none` : `normal`}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : `asc`}
              onClick={createSortHandler(headCell.id as keyof AuctionData)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === `desc` ? `sorted descending` : `sorted ascending`}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableHeadCell>
        ))}
      </TableRow>
    </TableCustomHead>
  );
};

const StyledTableRow = styled(TableRow)`
  span.status {
    display: block;
  }
  button.buy {
    display: none;
  }
  span.remove {
    display: none;
    color: red;
    cursor: pointer;
  }
  &:hover {
    span.status {
      display: none;
    }
    button.buy {
      display: block;
    }
    span.remove {
      display: block;
    }
  }
  b {
    color: #bdb9c8;
    font-weight: 700;
    margin-right: 5px;
  }
`;

const BuyButton = styled(`button`)`
  width: 40px;
  height: 40px;
  background: linear-gradient(112.17deg, #f89724 0%, #e23f26 100%);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  margin-top: -11px;
  margin-bottom: -10.5px;
  cursor: pointer;
`;

interface Props {
  auctions: Auction[];
  name: string;
  format: string;
}

const ITEMS_PER_PAGE = 10;

const DataTable: React.FC<Props> = ({ auctions, name, format }) => {
  const [rows, setRows] = useState<AuctionData[]>([]);
  const theme = useTheme();
  const [campaignUris, setCampaignUris] = useState<any>(new Map());
  const [order, setOrder] = useState<Order>(`asc`);
  const [orderBy, setOrderBy] = useState<keyof AuctionData>(`id`);
  const [page, setPage] = useState<number>(1);

  const addCampaignUri = useCallback(
    (id: number, campaignUri: any) => {
      if (campaignUris.has(id)) return;

      const map = new Map(campaignUris);
      map.set(Number(id), campaignUri);

      setCampaignUris(map);
    },
    [campaignUris],
  );

  useEffect(() => {
    if (!auctions) return;
    const rowOut = [];
    for (let i = 0; i < auctions.length; i++) {
      const auction = auctions[i];
      const row = createData(
        Number(auction.sellerAuction.id),
        auction.auctionStartsIn(),
        auction.contractDuration(),
        Number(auction.buyerCampaign?.id) ?? Number.MAX_VALUE,
        auction.price(),
        auction.status,
      );

      auction.getBuyercampaignUri(addCampaignUri);
      rowOut.push(row);
    }

    setRows(rowOut);
  }, [auctions, addCampaignUri]);

  const getSellerAuctionForBasketFromId = (id: number) => {
    if (!auctions) return null;
    for (let i = 0; i < auctions.length; i++) {
      if (id === Number(auctions[i].sellerAuction.id)) {
        const {
          contractTimeStart,
          contractTimeEnd,
          auctionTimeStart,
          priceStart,
        } = auctions[i].sellerAuction;
        return {
          contractTimeStart,
          contractTimeEnd,
          auctionTimeStart,
          priceStart,
          id,
        };
      }
    }
    return null;
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof AuctionData,
  ) => {
    const isAsc = orderBy === property && order === `asc`;
    setOrder(isAsc ? `desc` : `asc`);
    setOrderBy(property);
  };

  function getColor(status: AUCTION_STATUS) {
    const primary = theme.palette.primary.main;
    if (false) {
      if (status === AUCTION_STATUS.active) return primary;
      if (status === AUCTION_STATUS.awaiting_approval) return primary;
      if (status === AUCTION_STATUS.bought) return `lightgrey`;
      if (status === AUCTION_STATUS.expired) return `grey`;
      if (status === AUCTION_STATUS.no_bids) return `grey`;
      if (status === AUCTION_STATUS.not_started) return `grey`;

      if (status === AUCTION_STATUS.finished) {
        // if (historical === true) return 'lightgrey';
        return `grey`;
      }
    } else {
      if (status === AUCTION_STATUS.active) return `#bdb9c8`;
      if (status === AUCTION_STATUS.awaiting_approval) return `lightgrey`;
      if (status === AUCTION_STATUS.bought) return `#837C99`;
      if (status === AUCTION_STATUS.expired) return `#bdb9c8`;
      if (status === AUCTION_STATUS.no_bids) return primary;
      if (status === AUCTION_STATUS.not_started) return `#D6C6B1;`;

      if (status === AUCTION_STATUS.finished) {
        // if (historical === true) return 'lightgrey';
        return `#bdb9c8`;
      }
    }

    return `grey`;
  }

  const dispatch = useDispatch();
  const addedAuctions = useSelector(
    (state: RootState) => state.auctionBasketReducer.auctions,
  );
  const idsInCart = addedAuctions.map((auction: { id: number }) => auction.id);
  if (!rows.length) {
    return <></>;
  }
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const count = Math.ceil(rows.length / ITEMS_PER_PAGE);
  return (
    <Wrapper>
      <CartPreview />
      <TableContainer>
        <Table size="small">
          <DataTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={headCells}
          />

          <TableBody>
            {stableSort(
              rows.slice(start, end),
              getComparator(order, orderBy),
            ).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              const canBid = row.status === AUCTION_STATUS.no_bids;
              const awaitingApproval =
                row.status === AUCTION_STATUS.awaiting_approval || canBid;
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
                  <AuctionDataCampaingCell
                    align="left"
                    status={row.status}
                    campaignUris={campaignUris}
                    id={row.campaign}
                  ></AuctionDataCampaingCell>
                  <TableBodyCell align="left">
                    <b>{row.price.toFixed(2)}</b>USDC
                  </TableBodyCell>
                  {!idsInCart.includes(row.id) ? (
                    <TableBodyCell align="left" color={getColor(row.status)}>
                      <span className={canBid ? `status` : ``}>
                        {row.status === AUCTION_STATUS.not_started
                          ? `Yet to start`
                          : row.status === AUCTION_STATUS.active
                          ? `Active`
                          : row.status === AUCTION_STATUS.bought
                          ? `Bought`
                          : row.status === AUCTION_STATUS.awaiting_approval
                          ? `Awaiting Approval`
                          : row.status === AUCTION_STATUS.expired
                          ? `Expired`
                          : row.status === AUCTION_STATUS.finished
                          ? `Finished`
                          : `No Bids`}
                      </span>
                      {canBid && (
                        <BuyButton
                          className="buy"
                          onClick={() =>
                            dispatch(
                              addAuction({
                                ...row,
                                name,
                                format,
                              }),
                            )
                          }
                        >
                          <Image
                            src="/icons/cart-white.svg"
                            alt="cart"
                            height={16}
                            width={16}
                          />
                        </BuyButton>
                      )}
                    </TableBodyCell>
                  ) : (
                    <TableBodyCell align="left" color="#28D659">
                      <span className={awaitingApproval ? `status` : ``}>
                        Added
                      </span>
                      {awaitingApproval && (
                        <span
                          className="remove"
                          onClick={() => dispatch(removeAuctionById(row.id))}
                        >
                          Remove
                        </span>
                      )}
                    </TableBodyCell>
                  )}
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ActionSection>
        <CustomPagination
          count={count}
          page={page}
          hideNextButton
          hidePrevButton
          onChange={(e, value) => setPage(value)}
        />
        <Navigation>
          <NavigationButton
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <NavigateBeforeIcon /> Prev
          </NavigationButton>
          <NavigationButton
            onClick={() => setPage(page + 1)}
            disabled={page === count}
          >
            Next
            <NavigateNextIcon />
          </NavigationButton>
        </Navigation>
      </ActionSection>
    </Wrapper>
  );
};

export default DataTable;

export { DataTableHead, StyledTableRow, stableSort, getComparator };
