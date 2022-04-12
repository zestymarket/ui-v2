import React, { FC, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import visuallyHidden from '@mui/utils/visuallyHidden';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import styles from './index.module.scss';

interface Data {
  id: number;
  contractStartTime: number;
  duration: number;
  format: string;
  campaign: string;
  price: number;
  status: string;
}

function createData(
  id: number,
  contractStartTime: number,
  duration: number,
  format: string,
  campaign: string,
  price: number,
  status: string,
): Data {
  return {
    id,
    contractStartTime,
    duration,
    format,
    campaign,
    price,
    status,
  };
}

const rows = [
  createData(
    1294,
    1644631200,
    1,
    `The Frontpage (150x600)`,
    `Rebuff Reality`,
    15.68,
    `Active`,
  ),
  createData(
    1295,
    1644631200,
    1,
    `The Frontpage (150x600)`,
    `Rebuff Reality`,
    15.68,
    `Active`,
  ),
  createData(
    1296,
    1644631200,
    1,
    `The Frontpage (150x600)`,
    `Rebuff Reality`,
    15.68,
    `Active`,
  ),
  createData(
    1297,
    1644631200,
    1,
    `The Frontpage (150x600)`,
    `Rebuff Reality`,
    15.68,
    `Active`,
  ),
];

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
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

type Order = 'asc' | 'desc';

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
    property: keyof Data,
  ) => void;
  order: Order;
  orderBy: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: `id`,
    numeric: false,
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
    id: `format`,
    numeric: false,
    disablePadding: true,
    label: `Format`,
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
}) => {
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead className={styles.head}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            className={styles.headCell}
            key={headCell.id}
            align={headCell.numeric ? `right` : `left`}
            padding={headCell.disablePadding ? `none` : `normal`}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : `asc`}
              onClick={createSortHandler(headCell.id)}
              className={styles.headSortLabel}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === `desc` ? `sorted descending` : `sorted ascending`}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const DataTable = () => {
  const [order, setOrder] = useState<Order>(`asc`);
  const [orderBy, setOrderBy] = useState<keyof Data>(`id`);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === `asc`;
    setOrder(isAsc ? `desc` : `asc`);
    setOrderBy(property);
  };

  return (
    <div className={styles.wrapper}>
      <TableContainer className={styles.table}>
        <Table size="small">
          <DataTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />

          <TableBody className={styles.body}>
            {stableSort(rows, getComparator(order, orderBy)).map(
              (row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell
                      className={styles.bodyCell}
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.id}
                    </TableCell>
                    <TableCell className={styles.bodyCell} align="left">
                      {row.contractStartTime}
                    </TableCell>
                    <TableCell
                      className={styles.bodyCell}
                      align="left"
                    >{`${row.duration} day`}</TableCell>
                    <TableCell className={styles.bodyCell} align="left">
                      {row.format}
                    </TableCell>
                    <TableCell className={styles.bodyCell} align="left">
                      {row.campaign}
                    </TableCell>
                    <TableCell
                      className={styles.bodyCell}
                      align="left"
                    >{`${row.price} USDC`}</TableCell>
                    <TableCell className={styles.bodyCell} align="left">
                      {row.status}
                    </TableCell>
                  </TableRow>
                );
              },
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={styles.action}>
        <Pagination
          className={styles.pagination}
          count={10}
          hidePrevButton
          hideNextButton
        />
        <div className={styles.navigation}>
          <Button className={styles.button}>
            <NavigateBeforeIcon /> Prev
          </Button>
          <Button className={styles.button}>
            Next
            <NavigateNextIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
