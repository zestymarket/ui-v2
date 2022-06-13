import React, { useState } from 'react';
import { useTheme } from '@mui/styles';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import moment from 'moment';
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

interface Props {
  events: any;
}

const AuctionCalendar: React.FC<Props> = ({ events }) => {
  const theme = useTheme();

  const [currentView, setCurrentView] = useState<string>(`week`);

  const calendarProps = {
    fontFamily: `Inter`,
    height: `800px`,
    width: `100%`,
    '.rbc-btn-group > button': {
      '&:hover': {
        opacity: 0.8,
        cursor: `pointer`,
      },
      fontFamily: `Inter`,
      color: `black`,
      backgroundColor: theme.palette.primary.main,
    },
    '& .rbc-off-range-bg': {
      backgroundColor: theme.palette.background.paper,
    },
    '& .rbc-row-content': {
      pointerEvents: `none`,
    },
    '& .rbc-toolbar .rbc-toolbar-label': {
      padding: 0,
      fontSize: `small`,
    },
    '& .rbc-day-slot .rbc-events-container': {
      marginRight: 0,
    },
    '.rbc-month-view': {
      border: `unset`,
    },
  };

  return (
    <DnDCalendar
      selectable
      localizer={localizer}
      defaultDate={moment().toDate()}
      onView={(newView) => {
        setCurrentView(newView);
        if (newView === `week`) {
          // onCalendarNavigate(currentViewedDate, newView);
        }
      }}
      defaultView="month"
      view={currentView}
      startAccessor={currentView === `month` ? `startMonthly` : `start`}
      endAccessor={currentView === `month` ? `endMonthly` : `end`}
      views={[`month`, `week`]}
      style={calendarProps}
    />
  );
};

export default AuctionCalendar;
