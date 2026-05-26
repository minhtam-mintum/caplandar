interface ICalendarDayCellProps {
  day: number;
  isToday?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isEmpty?: boolean;
  bgClass?: string;
  textClass?: string;
  onClick?: () => void;
}

export function CalendarDayCell({
  day,
  isToday = false,
  isSelected = false,
  isDisabled = false,
  isEmpty = false,
  bgClass = 'bg-surface-container-lowest',
  textClass = 'text-on-surface',
  onClick,
}: ICalendarDayCellProps) {
  if (isEmpty) return <div />;

  let bg = bgClass;
  let text = textClass;
  if (isDisabled) {
    bg = 'bg-surface-container-lowest';
    text = 'text-on-surface-variant';
  } else if (isToday) {
    bg = 'bg-primary';
    text = 'text-on-primary';
  } else if (isSelected) {
    bg = 'bg-secondary-container';
    text = 'text-on-surface';
  }

  const ringClass = isSelected && !isToday ? 'ring-2 ring-primary' : '';

  return (
    <div
      onClick={isDisabled ? undefined : onClick}
      className={`relative flex flex-col items-center justify-center aspect-square rounded-sm ${bg} ${ringClass} ${isDisabled ? 'opacity-35 cursor-not-allowed' : onClick ? 'cursor-pointer hover:ring-2 hover:ring-primary/40 transition-shadow' : ''}`}>
      <span
        className={`text-[13px] leading-none ${text} ${isToday ? 'font-bold' : ''}`}>
        {day}
      </span>
    </div>
  );
}
