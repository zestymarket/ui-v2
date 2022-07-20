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
import { AUCTION_STATUS } from '@/utils/classes/Auction';
import Auction from '@/utils/classes/Auction';
import { styled } from '@mui/material';
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
import { useTheme } from '@mui/styles';

export interface AuctionData {
  id: number;
  contractStartTime: string;
  contractEndTime: string;
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
  contractEndTime: string,
  price: number,
  status: AUCTION_STATUS,
): AuctionData {
  return {
    id,
    contractStartTime,
    contractEndTime,
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
    id: `contractEndTime`,
    numeric: false,
    disablePadding: true,
    label: `Contract End Time`,
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
  // {
  //   id: `billboard`,
  //   numeric: false,
  //   disablePadding: true,
  //   label: `Billboard`,
  // },
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

interface Props {
  campaignAuctions: Auction[];
}

const DataTable: React.FC<Props> = ({ campaignAuctions }) => {
  const [rows, setRows] = useState<AuctionData[]>([]);
  const theme = useTheme();
  const [campaignUris, setCampaignUris] = useState<any>(new Map());
  const [order, setOrder] = useState<Order>(`asc`);
  const [orderBy, setOrderBy] = useState<keyof AuctionData>(`id`);

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
    if (!campaignAuctions) return;
    const rowOut = [];
    for (let i = 0; i < campaignAuctions.length; i++) {
      const auction = campaignAuctions[i];
      const row = createData(
        auction.id,
        auction.contractStartDateTime(),
        auction.contractEndDateTime(),
        auction.price(),
        auction.status,
      );
      rowOut.push(row);
    }

    setRows(rowOut);
  }, [campaignAuctions, addCampaignUri]);

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

  return (
    <Wrapper>
      <TableContainer>
        <Table size="small">
          <DataTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            headCells={headCells}
          />

          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map(
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
                    <TableBodyCell align="left">{`${row.contractEndTime}`}</TableBodyCell>
                    <TableBodyCell align="left">
                      <b>{row.price.toFixed(2)}</b>USDC
                    </TableBodyCell>

                    <TableBodyCell align="left" color={getColor(row.status)}>
                      <span>
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
                    </TableBodyCell>
                  </StyledTableRow>
                );
              },
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {rows.length > 10 && (
        <ActionSection>
          <CustomPagination count={10} hidePrevButton hideNextButton />
          <Navigation>
            <NavigationButton>
              <NavigateBeforeIcon /> Prev
            </NavigationButton>
            <NavigationButton>
              Next
              <NavigateNextIcon />
            </NavigationButton>
          </Navigation>
        </ActionSection>
      )}
    </Wrapper>
  );
};

export default DataTable;

export { DataTableHead, StyledTableRow, stableSort, getComparator };
