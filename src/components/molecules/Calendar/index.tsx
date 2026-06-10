import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MonthCalendar,
  type IMonthCalendarHandle,
} from 'app/components/molecules/Calendar/components/MonthCalendar';
import { MonthPicker } from 'app/components/molecules/Calendar/components/MonthPicker';
import { YearPicker } from 'app/components/molecules/Calendar/components/YearPicker';
import { Toolbar } from 'app/components/molecules/Toolbar';
import { MONTH_NAMES } from 'app/utils/calendar';

import { type ICalendarProps } from './types';

type ViewMode = 'day' | 'month' | 'year';

function getDecadeStart(year: number): number {
  return Math.floor(year / 10) * 10;
}

export function Calendar({ defaultDate, minDate, onDayClick }: ICalendarProps) {
  const [viewDate, setViewDate] = useState(defaultDate ?? new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const calendarRef = useRef<IMonthCalendarHandle>(null);

  useEffect(() => {
    if (viewMode === 'day') calendarRef.current?.updateDate(viewDate);
  }, [viewDate, viewMode]);

  const handlePrev = useCallback(() => {
    setViewDate((d) => {
      const next = new Date(d);
      next.setDate(1);
      if (viewMode === 'day') next.setMonth(next.getMonth() - 1);
      else if (viewMode === 'month') next.setFullYear(next.getFullYear() - 1);
      else next.setFullYear(next.getFullYear() - 10);
      return next;
    });
  }, [viewMode]);

  const handleNext = useCallback(() => {
    setViewDate((d) => {
      const next = new Date(d);
      next.setDate(1);
      if (viewMode === 'day') next.setMonth(next.getMonth() + 1);
      else if (viewMode === 'month') next.setFullYear(next.getFullYear() + 1);
      else next.setFullYear(next.getFullYear() + 10);
      return next;
    });
  }, [viewMode]);

  const goToToday = useCallback(() => {
    setViewDate(new Date());
    setViewMode('day');
  }, []);

  const handleMonthSelect = useCallback((month: number) => {
    setViewDate((d) => {
      const next = new Date(d);
      next.setDate(1);
      next.setMonth(month);
      return next;
    });
    setViewMode('day');
  }, []);

  const handleYearSelect = useCallback((year: number) => {
    setViewDate((d) => {
      const next = new Date(d);
      next.setDate(1);
      next.setFullYear(year);
      return next;
    });
    setViewMode('month');
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const decadeStart = getDecadeStart(year);

  const headerTitle =
    viewMode === 'day' ? (
      <div className='flex items-center gap-1'>
        <button
          className='text-label-lg font-semibold text-on-surface hover:text-primary transition-colors'
          onClick={() => setViewMode('month')}>
          {MONTH_NAMES[month]}
        </button>
        <button
          className='text-label-lg font-semibold text-primary hover:opacity-70 transition-opacity'
          onClick={() => setViewMode('year')}>
          {year}
        </button>
      </div>
    ) : viewMode === 'month' ? (
      <button
        className='text-label-lg font-semibold text-on-surface hover:text-primary transition-colors'
        onClick={() => setViewMode('year')}>
        {year}
      </button>
    ) : (
      <span className='text-label-lg font-semibold text-on-surface'>
        {decadeStart}–{decadeStart + 9}
      </span>
    );

  return (
    <div className='flex flex-col gap-3'>
      <Toolbar
        align='center'
        title={headerTitle}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={goToToday}
      />
      {viewMode === 'day' && (
        <MonthCalendar
          ref={calendarRef}
          hasMonthName={false}
          defaultDate={defaultDate}
          labelFormat='short'
          minDate={minDate}
          onDayClick={onDayClick}
        />
      )}
      {viewMode === 'month' && (
        <MonthPicker selectedMonth={month} onMonthClick={handleMonthSelect} />
      )}
      {viewMode === 'year' && (
        <YearPicker
          decadeStart={decadeStart}
          selectedYear={year}
          onYearClick={handleYearSelect}
        />
      )}
    </div>
  );
}
