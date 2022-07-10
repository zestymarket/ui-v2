import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/styles';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import { useSnackbar } from 'notistack';
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

import AuctionForm from '@/components/new-auction/AuctionForm';
import { Grid, styled } from '@mui/material';
import Button from '../Button';
import { useZestyMarketUSDC } from '@/utils/hooks';
import { SECONDS_IN_30MIN, SECONDS_IN_DAY } from '@/utils/timeConstants';
import { parseUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';

interface Props {
  filteredAuctions: any;
  id: string[] | string | undefined;
}

const MAX_AUCTIONS = 50;

const today = new Date();
today.setHours(0, 0, 0, 0);

const AuctionGridContainer = styled(`div`)({
  width: `100%`,
});

const AuctionGrid = styled(Grid)({
  maxWidth: 1400,
  alignItems: `flex-start`,
  margin: `30px auto`,
});

const AuctionConfirmButton = styled(Button)({
  display: `block`,
  marginLeft: `auto`,
  marginRight: 0,
  marginTop: 20,
});

const dateOptions: Intl.DateTimeFormatOptions = {
  month: `short`,
  day: `numeric`,
};

const AuctionCalendar: React.FC<Props> = ({ filteredAuctions, id }) => {
  const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [events, setEvents] = useState<any>([]);
  const [currentView, setCurrentView] = useState<string>(`month`);
  const [currentViewedDate, setCurrentViewedDate] = useState<Date>(new Date());
  const [focusedEvent, setFocusedEvent] = useState<any>(null);
  const [currentEventStartDate, setCurrentEventStartDate] =
    useState<Date | null>(null);
  const [currentEventEndDate, setCurrentEventEndDate] = useState<Date | null>(
    null,
  );
  const [currentEventPrice, setCurrentEventPrice] = useState<number>(0);

  const [weeklyFilteredEvents, setWeeklyFilteredEvents] = useState<any>([]);
  const [newTimeslotPrice, setNewTimeslotPrice] = useState<number>(0);
  const [saleStart, setSaleStart] = useState<string>(`Now`); // TODO: convert to enum
  const [idCounter, setIdCounter] = useState<number>(1);
  const [cachedMonths, setCachedMonths] = useState<string[]>([]);
  const [numRemoteEvents, setNumRemoteEvents] = useState<number>(0);

  const zestyMarketUSDC = useZestyMarketUSDC(true);

  const calendarProps = {};

  const setToSundayStart = (date: Date) => {
    const day = date.getDay();
    if (day !== 0) date.setHours(-24 * day);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const setToSaturdayEnd = (date: Date) => {
    const day = date.getDay();
    if (day !== 6) date.setHours(24 * (6 - day));
    date.setHours(23, 59, 59, 999);
    return date;
  };

  /**
   * Sets the start and end dates for the monthly auction query (the date's month +/- a week).
   * @param  {[Date]}  date [A day within the month to query for]
   */
  const getAuctionsForMonth = async (date: Date) => {
    const monthYear = date.getMonth() + `.` + date.getFullYear();
    if (cachedMonths.includes(monthYear)) return;

    const cachedMonthsCopy = [...cachedMonths];
    cachedMonthsCopy.push(monthYear);
    setCachedMonths(cachedMonthsCopy);

    const startDate = new Date(date.getTime());
    startDate.setDate(-7);
    const endDate = new Date(date.getTime());
    endDate.setDate(38);
  };

  const isWithinWeek = (event: any, weekStart: Date, weekEnd: Date) => {
    if (
      (event.start >= weekStart && event.start <= weekEnd) ||
      (event.end >= weekStart && event.end <= weekEnd) ||
      (event.start <= weekStart && event.end >= weekEnd)
    )
      return true;
    return false;
  };

  const setWeekViewEvents = (startDate: Date, endDate: Date) => {
    const newEvents = [...events];
    const filteredEvents = newEvents.filter((event) =>
      isWithinWeek(event, startDate, endDate),
    );

    let createdEvents: any = [];

    for (let i = 0; i < filteredEvents.length; i++) {
      const event = filteredEvents[i];
      createdEvents = createdEvents.concat(
        createWeeklyEvents(startDate, endDate, event),
      );
    }

    setWeeklyFilteredEvents(createdEvents);
  };

  const onCalendarNavigate = (date: Date, view: any) => {
    view = view || currentView;
    if (view === `month`) {
      getAuctionsForMonth(date);
    } else if (view === `week`) {
      const weekStart = new Date(date.getTime());
      const weekEnd = new Date(date.getTime());
      setToSundayStart(weekStart);
      setToSaturdayEnd(weekEnd);
      setWeekViewEvents(weekStart, weekEnd);
    }
    setCurrentViewedDate(date);
  };

  useEffect(() => {
    if (currentView === `week`) {
      onCalendarNavigate(currentViewedDate, currentView);
    }
  }, [events, currentView]);

  useEffect(() => {
    if (!filteredAuctions) return;

    let newEvents: any = events.filter((event: any) => !event.external);
    for (let i = 0; i < filteredAuctions.length; i++) {
      if (!filteredAuctions[i]) continue;
      const start = new Date(filteredAuctions[i].contractTimeStart * 1000);
      const startMonthly = new Date(start);
      startMonthly.setUTCHours(0, 0, 0, 0);
      const end = new Date(filteredAuctions[i].contractTimeEnd * 1000);
      const endMonthly = new Date(end);
      endMonthly.setUTCHours(0, 0, 0, 0);
      const newEvent = createEvent({ start, end }, true);
      newEvent.startMonthly = startMonthly;
      newEvent.endMonthly = endMonthly;
      newEvents.push(newEvent);
      const overlaps = getOverlappingDates({ start, end, event: newEvent });
      newEvents = newEvents.filter((evt: any) => {
        return !overlaps.includes(evt);
      });
    }
    setNumRemoteEvents(newEvents.length);
    setEvents(newEvents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredAuctions]);

  const createEvent = (
    { start, end }: { start: Date; end: Date },
    external = false,
  ) => {
    const price = newTimeslotPrice;
    const diff = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    let title = `${diffDays} day${diffDays === 1 ? `` : `s`}`;
    // TODO: Price recommendation could be used here in the future.

    if (external) {
      start.setMinutes(start.getMinutes() + start.getTimezoneOffset(), 0);
      end.setMinutes(end.getMinutes() + end.getTimezoneOffset(), 0);
    } else {
      title += ` (${price.toFixed(2)} USDC)`;
    }

    const obj = {
      title,
      start,
      end,
      startMonthly: start,
      endMonthly: end,
      id: idCounter,
      price,
      external,
    };
    setIdCounter(idCounter + 1);
    return obj;
  };

  const isSameDay = (first, second) => {
    return first.getDate() === second.getDate();
  };

  const createWeeklyEvents = (weekStart, weekEnd, realEvent) => {
    const { start, end } = realEvent;
    const price = realEvent.price;
    // TODO: Display like Mon 1 PM - Tue 2 PM
    const title =
      start.toLocaleDateString(`en-US`, dateOptions) +
      ` - ` +
      end.toLocaleDateString(`en-US`, dateOptions);

    const currentStart = new Date(Math.max(start, weekStart));
    const currentEnd = new Date(Math.min(end, weekEnd));
    let currentEndOfDay;
    if (isSameDay(currentStart, currentEnd)) {
      currentEndOfDay = currentEnd;
    } else {
      currentEndOfDay = new Date(currentStart);
      currentEndOfDay.setHours(23, 59, 59, 999);
    }
    let diff = currentEnd.getTime() - currentStart.getTime();

    const returnArray = [];

    while (diff > 10) {
      const obj = {
        title,
        start: new Date(currentStart),
        end: new Date(currentEndOfDay),
        startMonthly: null,
        endMonthly: null,
        id: realEvent.id,
        price,
        external: realEvent.external,
        realEvent,
        isFirst: false,
        isLast: false,
      };

      returnArray.push(obj);

      diff -= currentEndOfDay.getTime() - currentStart.getTime();

      if (diff > 10) {
        currentStart.setHours(currentStart.getHours() + 24);
        currentStart.setHours(0, 0, 0, 0);

        currentEndOfDay.setHours(currentEndOfDay.getHours() + 24);
        if (currentEndOfDay > currentEnd) currentEndOfDay = currentEnd;
      }
    }

    if (returnArray.length) {
      returnArray[0].isFirst = true;
      returnArray[returnArray.length - 1].isLast = true;
    }

    return returnArray;
  };

  const deleteTimeslot = (event: any) => {
    const newEvents = [...events];
    const eventIndex = events.findIndex(
      (element: any) => element.id == event.id,
    );
    newEvents.splice(eventIndex, 1);
    setEvents(newEvents);
  };

  const datesOverlap = ({
    start,
    end,
    event,
  }: {
    start: Date;
    end: Date;
    event: any;
  }) => {
    for (let i = 0; i < events.length; i++) {
      if (event && event.id === events[i].id) continue;
      const currentStart = events[i].start;
      const currentEnd = events[i].end;
      // Checks if two dates overlap
      if (
        (start > currentStart && start < currentEnd) ||
        (end > currentStart && end < currentEnd) ||
        (currentStart > start && currentStart < end) ||
        (currentEnd > start && currentEnd < end)
      ) {
        return true;
      }
    }
    return false;
  };

  const isDateOverlapped = (date: Date) => {
    for (let i = 0; i < events.length; i++) {
      const currentStart = events[i].start;
      const currentEnd = events[i].end;
      // Checks if two dates overlap
      if (currentStart <= date && date <= currentEnd) {
        return true;
      }
    }
    return false;
  };

  const getOverlappingDates = ({ start, end, event }: any) => {
    const returnEvents: any = [];
    for (let i = 0; i < events.length; i++) {
      if ((event && event.id === events[i]?.id) || events[i].external) continue;
      const currentStart = events[i].start;
      const currentEnd = events[i].end;
      // Checks if two dates overlap
      if (
        (start >= currentStart && start < currentEnd) ||
        (end > currentStart && end <= currentEnd) ||
        (currentStart >= start && currentStart < end) ||
        (currentEnd > start && currentEnd <= end)
      ) {
        returnEvents.push(events[i]);
      }
    }
    return returnEvents;
  };

  const onTimeslotResized = (data: any) => {
    if (datesOverlap(data)) {
      return enqueueSnackbar(`Dates can't overlap!`, {
        variant: `error`,
      });
    }

    const { start, end, event } = data;

    if (start < today || end < today) {
      return enqueueSnackbar(`Dates can't be in the past!`, {
        variant: `error`,
      });
    }

    const newEvents = [...events];
    const eventIndex = events.findIndex(
      (element: any) => element.id == event.id,
    );

    const newEvent = { ...newEvents[eventIndex] };
    const diff = Math.abs(end - start);
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    const title = `${diffDays} day${diffDays === 1 ? `` : `s`}`;

    newEvent.title = title;
    if (event.realEvent) {
      newEvent.start = event.isFirst ? start : newEvent.start;
      newEvent.end = event.isLast ? end : newEvent.end;
    } else {
      newEvent.start = start;
      newEvent.end = end;
    }

    newEvent.startMonthly.setTime(start.getTime());
    newEvent.startMonthly.setHours(0, 0, 0, 0);
    newEvent.endMonthly.setTime(end.getTime());
    newEvent.endMonthly.setHours(0, 0, 0, 0);

    newEvents[eventIndex] = newEvent;
    setEvents(newEvents);

    if (currentView === `week`) {
      onCalendarNavigate(currentViewedDate, currentView);
    }
  };

  const onTimeslotMoved = (data: any) => {
    const { start, end, event } = data;
    if (start < today) {
      return enqueueSnackbar(`Start date can't be in the past.`, {
        variant: `error`,
      });
    }

    if (datesOverlap(data)) {
      return enqueueSnackbar(`Dates can't overlap`, {
        variant: `error`,
      });
    }

    const newEvents = [...events];
    const eventIndex = events.findIndex(
      (element: any) => element.id == event.id,
    );
    const newEvent = { ...newEvents[eventIndex] };

    let diff = Math.abs(event.end - event.start);
    let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    let title = `${diffDays} day${diffDays === 1 ? `` : `s`}`;

    if (event.realEvent) {
      diff = start - event.realEvent.start;
      diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      newEvent.end = new Date(event.realEvent.end.getTime() + diff);
      if (datesOverlap({ start, end: newEvent.end, event })) {
        return enqueueSnackbar(`Dates can't overlap`, {
          variant: `error`,
        });
      }
      title = `${diffDays} day${diffDays === 1 ? `` : `s`}`;
      event.realEvent.title = title;
    } else {
      newEvent.end = end;
    }

    newEvent.start = start;
    newEvent.startMonthly.setTime(start.getTime());
    newEvent.startMonthly.setHours(0, 0, 0, 0);
    newEvent.endMonthly.setTime(newEvent.end.getTime());
    newEvent.endMonthly.setHours(0, 0, 0, 0);
    newEvent.title = title;
    newEvents[eventIndex] = newEvent;
    setEvents(newEvents);
    if (currentView === `week`) {
      onCalendarNavigate(currentViewedDate, currentView);
    }
  };

  const onTimeslotCreated = (data: any) => {
    if (events.length - filteredAuctions.length >= MAX_AUCTIONS) {
      return enqueueSnackbar(`You have created the max amount of time slots.`, {
        variant: `error`,
      });
    }

    const { start, end } = data;
    if (start < today) {
      return enqueueSnackbar(`Start date can't be in the past.`, {
        variant: `error`,
      });
    }

    if (datesOverlap(data)) {
      return enqueueSnackbar(`There is already an Auction for this time.`, {
        variant: `error`,
      });
    }

    setCurrentEventStartDate(start);
    setCurrentEventEndDate(end);

    const newEvents = [...events];
    const newEvent = createEvent(data);
    const startMonthly = new Date(start);
    const endMonthly = new Date(end);
    newEvent.startMonthly = startMonthly;
    newEvent.endMonthly = endMonthly;
    newEvents.push(newEvent);
    setEvents(newEvents);
    setFocusedEvent(newEvent);
  };

  const timeslotStyleGetter = (event: any) => {
    const index = events.indexOf(event);
    // const style = {
    //   '--price': `'` + event.price + `'`,
    // };
    return {
      className: event.external
        ? `rbc-external-timeslot`
        : `rbc-timeslot ${index % 2 && `light`}`,
    };
  };

  const onTimeslotClicked = (event: any) => {
    // In case it is an event in the weekly view
    event = event.realEvent || event;
    setFocusedEvent(event);
  };

  const onTimeslotChangeConfirmed = (
    startDate: Date,
    endDate: Date,
    price: number,
  ) => {
    const newEvents = [...events];
    const eventIndex = events.findIndex(
      (element: any) => element.id == focusedEvent?.id,
    );
    const newEvent = { ...newEvents[eventIndex] };

    newEvent.price = price;

    const newStart = startDate;
    // newStart.setHours(0, 0, 0, 0);
    const newEnd = endDate;
    // newEnd.setHours(0, 0, 0, 0);

    if (newEnd <= newStart) {
      return enqueueSnackbar(`End can't happen before start.`, {
        variant: `error`,
      });
    }

    if (datesOverlap({ start: newStart, end: newEnd, event: newEvent })) {
      return enqueueSnackbar(
        `There is overlap with another Auction for this timeframe.`,
        {
          variant: `error`,
        },
      );
    } else {
      newEvent.start = newStart;
      newEvent.end = newEnd;
    }

    const diff = Math.abs(newEvent.end.getTime() - newEvent.start.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    const title = `${diffDays} day${diffDays === 1 ? `` : `s`}`;

    newEvent.startMonthly.setTime(newStart.getTime());
    newEvent.startMonthly.setHours(0, 0, 0, 0);
    newEvent.endMonthly.setTime(newEnd.getTime());
    newEvent.endMonthly.setHours(0, 0, 0, 0);
    newEvent.title = title;
    newEvents[eventIndex] = newEvent;
    setEvents(newEvents);
    setFocusedEvent(null);
    onCalendarNavigate(currentViewedDate, currentView);
  };

  const onFormClose = () => {
    setFocusedEvent(null);
  };

  const onFormSave = (startDate: Date, endDate: Date, price: number) => {
    onTimeslotChangeConfirmed(startDate, endDate, price);
    setFocusedEvent(null);
  };

  const onEventDelete = () => {
    if (focusedEvent) {
      deleteTimeslot(focusedEvent);
      setFocusedEvent(null);
    }
  };

  const onConfirmed = () => {
    const currentTime = parseInt((new Date().getTime() / 1000).toFixed(0));
    if (events.length <= numRemoteEvents) {
      return enqueueSnackbar(`Please create new events to confirm.`, {
        variant: `error`,
      });
    } else {
      const result: {
        auctionStartTimes: number[];
        auctionEndTimes: number[];
        contractStartTimes: number[];
        contractEndTimes: number[];
        prices: BigNumber[];
      } = {
        auctionStartTimes: [],
        auctionEndTimes: [],
        contractStartTimes: [],
        contractEndTimes: [],
        prices: [],
      };

      let auctionStartOffset = 0;
      let auctionStartNow = false;
      switch (saleStart) {
        case `Now`:
          auctionStartNow = true;
          break;
        case `3 days before`:
          auctionStartOffset = 3 * SECONDS_IN_DAY;
          break;
        case `5 days before`:
          auctionStartOffset = 5 * SECONDS_IN_DAY;
          break;
        case `1 week before`:
          auctionStartOffset = 7 * SECONDS_IN_DAY;
          break;
        case `2 weeks before`:
          auctionStartOffset = 2 * 7 * SECONDS_IN_DAY;
          break;
        case `4 weeks before`:
          auctionStartOffset = 4 * 7 * SECONDS_IN_DAY;
          break;
      }

      for (let i = 0; i < events.length; i++) {
        const currentEvent = events[i];
        if (currentEvent.external) continue;

        const currentStart = new Date(currentEvent.start);
        currentStart.setMinutes(
          currentStart.getMinutes() - currentEvent.start.getTimezoneOffset(),
        );

        const currentEnd = new Date(currentEvent.end);
        currentEnd.setMinutes(
          currentEnd.getMinutes() - currentEvent.end.getTimezoneOffset(),
        );
        currentEnd.setSeconds(currentEnd.getSeconds() - 1);
        const selectedStart = currentStart.getTime() / 1000;
        //set the earliest contract start time to the current time
        const contractStart = Math.max(
          selectedStart,
          currentTime + SECONDS_IN_30MIN,
        );
        const contractEnd = currentEnd.getTime() / 1000;

        const selectedAuctionStart = contractStart - auctionStartOffset;
        //set the earliest auction start time to the current time + 10 minutes
        const auctionStart = auctionStartNow
          ? currentTime + 600
          : Math.max(selectedAuctionStart, currentTime + 600);
        const auctionEnd = contractEnd - 1;

        // USDC uses 6 decimal places. This decimal place will change depending on the erc20 token used.
        // It's mostly 18 decimal places.
        const price = parseUnits(
          BigNumber.from(currentEvent.price).toString(),
          6,
        );

        if (price.eq(0)) {
          return enqueueSnackbar(`There is a timeslot with a price of 0.`, {
            variant: `error`,
          });
        }

        result.auctionStartTimes.push(auctionStart);
        result.auctionEndTimes.push(auctionEnd);
        result.contractStartTimes.push(contractStart);
        result.contractEndTimes.push(contractEnd);
        result.prices.push(price);
      }

      zestyMarketUSDC
        .sellerAuctionCreateBatch(
          id,
          result.auctionStartTimes,
          result.auctionEndTimes,
          result.contractStartTimes,
          result.contractEndTimes,
          result.prices,
        )
        .then((res: any) => {
          enqueueSnackbar(`Transaction pending...`, {
            variant: `info`,
            autoHideDuration: 15000,
          });
          res
            .wait()
            .then(() => {
              enqueueSnackbar(`Successfully created auction`, {
                variant: `success`,
              });
            })
            .catch((e: Error) => {
              enqueueSnackbar(e.message, {
                variant: `error`,
              });
            });
        })
        .catch((e: Error) => {
          enqueueSnackbar(e.message, {
            variant: `error`,
          });
        });
    }
  };

  return (
    <AuctionGridContainer>
      <AuctionGrid container>
        <DnDCalendar
          selectable
          localizer={localizer}
          defaultDate={moment().toDate()}
          onView={(newView) => {
            setCurrentView(newView);
            if (newView === `week`) {
              onCalendarNavigate(currentViewedDate, newView);
            }
          }}
          defaultView="month"
          events={currentView === `month` ? events : weeklyFilteredEvents}
          view={currentView}
          startAccessor={currentView === `month` ? `startMonthly` : `start`}
          endAccessor={currentView === `month` ? `endMonthly` : `end`}
          views={[`month`, `week`]}
          onEventResize={onTimeslotResized}
          onEventDrop={onTimeslotMoved}
          onSelectSlot={onTimeslotCreated}
          onSelectEvent={onTimeslotClicked}
          longPressThreshold={0}
          eventPropGetter={timeslotStyleGetter}
          onNavigate={onCalendarNavigate}
          style={{ fontFamily: `Inter`, height: `800px`, width: `100%` }}
        />
        <AuctionConfirmButton onClick={onConfirmed}>
          Create Auctions
        </AuctionConfirmButton>
      </AuctionGrid>
      <AuctionForm
        event={focusedEvent}
        onClose={onFormClose}
        onSave={onFormSave}
        onDelete={onEventDelete}
      ></AuctionForm>
    </AuctionGridContainer>
  );
};

export default AuctionCalendar;
