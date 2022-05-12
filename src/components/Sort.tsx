import React from 'react';
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

export enum SORT {
  ENDING_SOON = `ENDING_SOON`,
  LOWEST_PRICE = `LOWEST_PRICE`,
  HIGHEST_VOLUME = `HIGHEST_VOLUME`,
}

interface SortProps {
  selectedSort: SORT;
  onChangeSort: (sort: SORT) => void;
}

const SORT_OPTIONS = [
  { label: `Ending Soon`, key: SORT.ENDING_SOON },
  { label: `Lowest Price`, key: SORT.LOWEST_PRICE },
  { label: `Highest Volume`, key: SORT.HIGHEST_VOLUME },
];

const StyledSelect = styled(Select)(({ theme }) => ({
  borderColor: theme.palette.text.secondary,
  color: theme.palette.text.secondary,
  borderRadius: 30,
  fontSize: 12,
  textTransform: `uppercase`,
  marginLeft: 10,

  '& .MuiSelect-select': {
    paddingTop: 8,
    paddingBottom: 8,
  },
  '& fieldset': {
    borderColor: theme.palette.text.secondary,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.text.secondary,
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  backgroundColor: `transparent`,
}));

const Sort: React.FC<SortProps> = ({ selectedSort, onChangeSort }) => {
  const handleChange = (event: SelectChangeEvent<any>) => {
    onChangeSort(event.target.value as SORT);
  };

  return (
    <Stack direction="row" alignItems="center">
      <Typography color="text.secondary">Sort by</Typography>
      <StyledSelect
        variant="outlined"
        inputProps={{ 'aria-label': `Without label` }}
        MenuProps={{ variant: `menu` }}
        value={selectedSort}
        IconComponent={KeyboardArrowDown}
        onChange={handleChange}
      >
        {SORT_OPTIONS.map((option) => (
          <StyledMenuItem key={option.key} value={option.key}>
            {option.label}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </Stack>
  );
};

export default Sort;
