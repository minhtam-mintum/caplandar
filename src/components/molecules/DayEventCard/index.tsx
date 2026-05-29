import { Clock, Users } from 'lucide-react';
import type { DayCalendarEvent } from 'app/types/event';
import { formatTimeRange } from 'app/utils/day';
import { Badge } from 'app/components/atoms/Badge';
import { cn } from 'app/utils/cn';

interface IDayEventCardProps {
  event: DayCalendarEvent;
  color: string;
  offsetTop: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  onResizeStart?: (e: React.PointerEvent<HTMLDivElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function DayEventCard({
  event,
  color,
  offsetTop,
  height,
  className,
  style,
  draggable,
  onDragStart,
  onDragEnd,
  onResizeStart,
  onClick,
}: IDayEventCardProps) {
  if (event.isPill) {
    return (
      <div
        className='absolute inset-x-0 flex items-center justify-center pointer-events-none'
        style={{ top: offsetTop }}>
        <span className='bg-surface-container text-on-surface-variant text-label-sm px-4 py-1 rounded-full border border-outline-variant'>
          {event.title}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'absolute inset-x-0 mx-1 rounded-lg border border-outline-variant bg-surface-container-lowest border-l-4 px-4 py-3 flex flex-col gap-2 overflow-hidden transition-shadow group',
        onClick ? 'cursor-grab hover:shadow-sm' : '',
        className,
      )}
      style={{ top: offsetTop + 2, height: Math.max(height - 4, 32), borderLeftColor: color, ...style }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}>
      {/* Title row */}
      <div className='flex items-start justify-between gap-2'>
        <p className='text-body-md font-semibold text-on-surface leading-tight'>{event.title}</p>
        {event.tag && (
          <Badge
            label={event.tag}
            variant={event.tagVariant}
            icon={event.tagVariant === 'error' ? '!' : undefined}
          />
        )}
      </div>

      {/* Description */}
      {event.description && height >= 100 && (
        <p
          className='text-body-md text-on-surface-variant line-clamp-2'
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
      )}

      {/* Footer */}
      {height >= 64 && (
        <div className='flex items-center gap-4 text-label-sm text-on-surface-variant mt-auto'>
          <span className='flex items-center gap-1'>
            <Clock size={12} />
            {formatTimeRange(event.startTime, event.endTime)}
            {event.duration && ` (${event.duration})`}
          </span>
          {event.attendees && (
            <span className='flex items-center gap-1'>
              <Users size={12} />
              {event.attendees}
            </span>
          )}
        </div>
      )}

      {/* Resize handle */}
      {onResizeStart && (
        <div
          className='absolute bottom-0 inset-x-0 h-3 cursor-s-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onResizeStart(e);
          }}>
          <div className='w-6 h-0.5 rounded-full bg-current opacity-50' />
        </div>
      )}
    </div>
  );
}
