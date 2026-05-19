import { CalendarDayCell } from '../atoms/CalendarDayCell';
import { DayLabel } from '../atoms/DayLabel';
import {
  DAY_LABELS,
  getDaysInMonth,
  getFirstDayOfMonth,
  isToday,
  MONTH_NAMES,
  toDateStr,
} from '../../utils/calendar';

interface IMonthMiniCalendarProps {
  year: number;
  month: number;
  taskCountByDate?: Record<string, number>;
}

export function MonthMiniCalendar({ year, month, taskCountByDate = {} }: IMonthMiniCalendarProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells: Array<{ day: number | null }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push({ day: null });

  return (
    <div className='bg-surface-container-lowest rounded-lg p-3 flex flex-col gap-2'>
      <h3 className='text-body-md font-semibold text-on-surface'>{MONTH_NAMES[month]}</h3>
      <div className='grid grid-cols-7 gap-px'>
        {DAY_LABELS.map((label, i) => (
          <DayLabel key={i} label={label} />
        ))}
        {cells.map((cell, i) =>
          cell.day === null ? (
            <div key={i} className='aspect-square' />
          ) : (
            <CalendarDayCell
              key={i}
              day={cell.day}
              taskCount={taskCountByDate[toDateStr(year, month, cell.day)] ?? 0}
              isToday={isToday(year, month, cell.day)}
            />
          ),
        )}
      </div>
    </div>
  );
}
