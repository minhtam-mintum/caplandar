import { CalendarDayCell } from 'app/components/atoms/CalendarDayCell';

interface IHeatmapDayProps {
  day: number;
  count?: number;
  onClick?: () => void;
}

function heatmapClass(count: number): { bg: string; text: string } {
  if (count === 0) return { bg: 'bg-surface-container-lowest', text: 'text-on-surface' };
  if (count === 1) return { bg: 'bg-primary/12', text: 'text-on-surface' };
  if (count <= 3) return { bg: 'bg-primary/28', text: 'text-on-surface' };
  if (count <= 5) return { bg: 'bg-primary/50', text: 'text-on-primary' };
  if (count <= 7) return { bg: 'bg-primary/72', text: 'text-on-primary' };
  return { bg: 'bg-primary', text: 'text-on-primary' };
}

export function HeatmapDay({ day, count = 0, onClick }: IHeatmapDayProps) {
  const { bg, text } = heatmapClass(count);
  return <CalendarDayCell day={day} bgClass={bg} textClass={text} onClick={onClick} />;
}
