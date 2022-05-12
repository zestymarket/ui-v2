import React from 'react';
import { Chip, styled } from '@mui/material';
import { Format, FormatCategories } from '@/utils/formats';

export type FormatOption = Format | 'All';
const formatOptions: FormatOption[] = [`All` as FormatOption].concat(
  Object.keys(FormatCategories).map((key) => key.split(` `)[0] as FormatOption),
);

export const isFilterNameInFormatOptions = (filterName: FormatOption) => {
  return !!formatOptions.find((option) => option === filterName);
};

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

interface FilterProps {
  name: FormatOption;
  selected: boolean;
  onSelect: (name: FormatOption) => void;
}

const Filter: React.FC<FilterProps> = ({ name, selected, onSelect }) => {
  const onClick = () => onSelect(name);
  const variant = selected ? `filled` : `outlined`;
  return (
    <StyledChip
      label={name}
      variant={variant}
      color="primary"
      onClick={onClick}
    />
  );
};

interface FormatFiltersProps {
  selectedFilters: FormatOption[];
  onSetFilters: (filters: FormatOption[]) => void;
}

const FormatFilters: React.FC<FormatFiltersProps> = ({
  selectedFilters,
  onSetFilters,
}) => {
  const onSelect = (name: FormatOption) => {
    if (name === `All`) {
      return onSetFilters([]);
    }
    const newFilters = [...selectedFilters];
    if (selectedFilters.includes(name)) {
      const index = selectedFilters.indexOf(name);
      newFilters.splice(index, 1);
    } else {
      newFilters.push(name);
    }
    return onSetFilters(newFilters);
  };

  return (
    <>
      {formatOptions.map((option) => {
        let isSelected = selectedFilters.includes(option);
        if (option === `All` && selectedFilters.length === 0) {
          isSelected = true;
        }
        return (
          <Filter
            key={option}
            name={option}
            selected={isSelected}
            onSelect={onSelect}
          />
        );
      })}
    </>
  );
};

export default FormatFilters;
