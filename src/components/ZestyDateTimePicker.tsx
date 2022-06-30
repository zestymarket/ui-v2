import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TextField } from '@mui/material';

interface Props {
  date: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: any;
}

const ZestyDateTimePicker: React.FC<Props> = ({
  date,
  minDate,
  maxDate,
  onChange,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DateTimePicker
        maxDate={maxDate || new Date(`2100`)}
        minDate={minDate || new Date()}
        disablePast
        ampm={false}
        value={date}
        onChange={onChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default ZestyDateTimePicker;
