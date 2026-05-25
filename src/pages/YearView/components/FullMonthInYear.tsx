import { forwardRef, useImperativeHandle, useRef, useState, type ReactNode } from 'react';
import { MonthCalendar } from 'app/components/molecules/Calendar/MonthCalendar';

export interface IFullMonthInYearHandle {
  onSetYear: (newYear: number) => void;
  /** Resets the displayed year back to `defaultYear` (falls back to the current year if `defaultYear` was not provided). */
  onResetYear: VoidFunction;
  getYear: VoidFunction;
}

interface IFullMonthInYearProps {
  defaultYear?: number;
  onDaySelect?: (date: Date) => void;
  renderDay?: (year: number, month: number, day: number) => ReactNode;
}

export const FullMonthInYear = forwardRef<IFullMonthInYearHandle, IFullMonthInYearProps>(
  function FullMonthInYear(
    { defaultYear = new Date().getFullYear(), onDaySelect, renderDay },
    ref,
  ) {
    const yearCursor = useRef(defaultYear);
    const [, forceUpdate] = useState(0);

    useImperativeHandle(
      ref,
      () => ({
        onSetYear: (newYear: number) => {
          yearCursor.current = newYear;
          forceUpdate((n) => n + 1);
        },
        /** Resets the displayed year back to `defaultYear` (falls back to the current year if `defaultYear` was not provided). */
        onResetYear: () => {
          yearCursor.current = defaultYear;
          forceUpdate((n) => n + 1);
        },
        getYear: () => {
          return yearCursor.current;
        },
      }),
      [],
    );

    return (
      <div className='grid grid-cols-4 gap-4'>
        {Array.from({ length: 12 }, (_, month) => (
          <MonthCalendar
            key={yearCursor.current * 12 + month}
            defaultDate={new Date(yearCursor.current, month, 1)}
            labelFormat='short'
            highlightToday={false}
            onDayClick={onDaySelect}
            renderDay={renderDay}
          />
        ))}
      </div>
    );
  },
);
