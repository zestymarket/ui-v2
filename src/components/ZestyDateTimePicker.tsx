import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled, TextField } from '@mui/material';

interface Props {
  date: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: any;
  onError?: any;
}

const StyledTextField = styled(TextField)({
  width: `100%`,
  minHeight: 26,
  '& fieldset': {
    borderColor: `#ffffff30`,
    borderRadius: 8,
  },
  '& .MuiInputBase-input': {
    padding: 10,
    fontFamily: `Inter`,
    fontStyle: `normal`,
    fontWeight: 400,
    fontSize: `15px`,
    lineHeight: `18px`,
  },
  '& .MuiIconButton-root': {
    color: `white`,
    '& :hover': {
      color: `grey`,
    },
  },
});

const ZestyDateTimePicker: React.FC<Props> = ({
  date,
  minDate,
  maxDate,
  onChange,
  onError,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        maxDate={maxDate || new Date(`2100`)}
        minDate={minDate || new Date()}
        disablePast
        ampm={false}
        value={date}
        onChange={onChange}
        onError={onError}
        renderInput={(params: any) => <StyledTextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default ZestyDateTimePicker;
