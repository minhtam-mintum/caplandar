import { CalendarDayCell } from 'app/components/atoms/CalendarDayCell';
import { DayLabel } from 'app/components/atoms/DayLabel';
import {
  type DayLabelFormat,
  getDayLabels,
  getDaysInMonth,
  getFirstDayOfMonth,
  isToday,
  MONTH_NAMES,
  toDateStr,
  WeekStart,
} from 'app/utils/calendar';
import { cn } from 'app/utils/cn';
import { forwardRef, useImperativeHandle, useState, type ReactNode } from 'react';
export interface IMonthCalendarHandle {
  updateDate: (newDate: Date) => void;
}
interface IMonthCalendarProps {
  defaultDate?: Date;
  countByDate?: Record<string, number>;
  minDate?: Date;
  labelFormat?: DayLabelFormat;
  weekStart?: WeekStart;
  classDayLabel?: string;
  classMonthName?: string;
  hasMonthName?: boolean;
  highlightToday?: boolean;
  onDayClick?: (date: Date) => void;
  renderDay?: (year: number, month: number, day: number) => ReactNode;
}
export const MonthCalendar = forwardRef<IMonthCalendarHandle, IMonthCalendarProps>(
  function MonthCalendar(
    {
      defaultDate,
      countByDate = {},
      minDate,
      labelFormat = 'min',
      weekStart,
      classDayLabel,
      classMonthName,
      hasMonthName = true,
      highlightToday = true,
      onDayClick,
      renderDay,
    }: IMonthCalendarProps,
    ref,
  ) {
    const [date, setDate] = useState(defaultDate ?? new Date());
    const year = date.getFullYear();
    const month = date.getMonth();
    const dayLabels = getDayLabels(labelFormat, weekStart);
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month, weekStart);
    useImperativeHandle(
      ref,
      () => ({
        updateDate: setDate,
      }),
      [],
    );
    const cells: Array<{ day: number | null }> = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: null });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
    while (cells.length % 7 !== 0) cells.push({ day: null });

    return (
      <div className='@container bg-surface-container-lowest rounded-lg p-3 flex flex-col gap-2'>
        {hasMonthName && (
          <h3
            className={cn(
              'text-body-md @[320px]:text-body-lg font-semibold text-on-surface',
              classMonthName,
            )}>
            {MONTH_NAMES[month]}
          </h3>
        )}
        <div className='grid grid-cols-7 gap-px'>
          {dayLabels.map((label, i) => (
            <DayLabel classDayLabel={classDayLabel} key={i} label={label} />
          ))}
          {cells.map((cell, i) =>
            cell.day === null ? (
              <div key={i} className='aspect-square' />
            ) : renderDay ? (
              <div key={i}>{renderDay(year, month, cell.day)}</div>
            ) : (
              <CalendarDayCell
                key={i}
                day={cell.day}
                isToday={highlightToday && isToday(year, month, cell.day)}
                isSelected={
                  !!defaultDate &&
                  toDateStr(
                    defaultDate.getFullYear(),
                    defaultDate.getMonth(),
                    defaultDate.getDate(),
                  ) === toDateStr(year, month, cell.day)
                }
                isDisabled={!!minDate && new Date(Date.UTC(year, month, cell.day)) < minDate}
                onClick={
                  onDayClick
                    ? () => onDayClick(new Date(Date.UTC(year, month, cell.day!)))
                    : undefined
                }
              />
            ),
          )}
        </div>
      </div>
    );
  },
);
