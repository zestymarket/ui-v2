import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { styled, TextField } from '@mui/material';
import moment from 'moment';

interface Props {
  date: moment.Moment;
  minDate?: moment.Moment;
  maxDate?: moment.Moment;
  onChange?: any;
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
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateTimePicker
        maxDate={maxDate || moment().year(2100)}
        minDate={minDate || moment()}
        disablePast
        ampm={false}
        value={date}
        onChange={onChange}
        renderInput={(params: any) => <StyledTextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default ZestyDateTimePicker;
