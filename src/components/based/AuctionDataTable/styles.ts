import { Button, Pagination, TableCell, TableHead } from '@mui/material';
import { styled } from '@mui/system';

export const Wrapper = styled(`div`)({});

export const TableCustomHead = styled(TableHead)({
  background: `#181522`,
  borderRadius: 8,
});

export const TableHeadCell = styled(TableCell)({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 600,
  fontSize: 12,
  lineHeight: `15px`,
  letterSpacing: `0.1em`,
  textTransform: `uppercase`,
  color: `#837c99`,
  border: `none`,
  padding: `13px 21px`,
});

export const TableBodyCell = styled(TableCell)({
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 400,
  fontSize: 15,
  lineHeight: `18px`,
  color: `#bdb9c8`,
  padding: `22px 21px`,
  borderBottom: `1px solid rgba(131, 124, 153, 0.18)`,
});

export const ActionSection = styled(`section`)({
  display: `flex`,
  alignItems: `center`,
  justifyContent: `space-between`,
  margin: `30px 0`,
});

export const CustomPagination = styled(Pagination)({
  '& button': {
    width: 40,
    height: 30,
    border: `1px solid rgba(131, 124, 153, 0.4)`,
    borderRadius: 8,
    transition: `all 0.3s`,
    fontFamily: `Inter`,
    fontStyle: `normal`,
    fontWeight: 500,
    fontSize: 12,
    lineHeight: `15px`,
    display: `flex`,
    alignItems: `center`,
    textAlign: `center`,
    letterSpacing: `0.02em`,
    textTransform: `uppercase`,
    color: `#bdb9c8`,

    '&.Mui-selected': {
      background: `linear-gradient(112.17deg, #f89724 0%, #e23f26 100%)`,
      border: `transparent`,
      borderRadius: 4,
      color: `white`,
    },
  },
});

export const Navigation = styled(`div`)({
  display: `flex`,
  alignItems: `center`,
});

export const NavigationButton = styled(Button)({
  width: 70,
  height: 30,
  border: `1px solid rgba(131, 124, 153, 0.4)`,
  boxSizing: `border-box`,
  borderRadius: 8,
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 500,
  fontSize: 12,
  lineHeight: `15px`,
  display: `flex`,
  alignItems: `center`,
  letterSpacing: `0.02em`,
  textTransform: `uppercase`,
  color: `#bdb9c8`,
  marginRight: 10,
  transition: `all 0.3s`,

  '&:active': {
    background: `linear-gradient(112.17deg, #f89724 0%, #e23f26 100%)`,
    border: `transparent`,
    borderRadius: 4,
    color: `white`,

    '& svg': {
      color: `white !important`,
    },
  },

  '& svg': {
    width: 18,
    height: 18,
    color: `#837c99`,
    marginLeft: `-5`,
  },

  '&:last-child': {
    marginRight: 0,

    '& svg': {
      marginLeft: 0,
      marginRight: -5,
    },
  },
});
