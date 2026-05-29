import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useAppSelector, useAppDispatch } from 'app/store';
import { updateEvent } from 'app/store/slices/eventSlice';
import type { IEvent } from 'app/store/slices/eventSlice';
import { useLabels } from 'app/hooks/useLabels';
import { DAY_END_HOUR, DAY_HOUR_HEIGHT, DAY_START_HOUR } from 'app/utils/day';
import { timeToOffset, durationToHeight, getCurrentTimeOffset } from 'app/utils';
import {
  clampHour,
  dayToDateStr,
  formatHour,
  isMultiDay,
  layoutTimedEvents,
  msToUtcHM,
  toTimeString,
} from 'app/pages/WeekView/utils';
import {
  ALL_DAY_GAP,
  ALL_DAY_PAD,
  ALL_DAY_ROW_H,
  DEFAULT_COLOR,
  SNAP_MIN,
} from 'app/pages/WeekView/const';
import { DAY_MS } from 'app/pages/MonthView/utils';
import { cn } from 'app/utils/cn';
import { DayEventCard } from 'app/components/molecules/DayEventCard';
import { WeekEventCard } from 'app/components/molecules/WeekEventCard';

const HOURS = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, i) => DAY_START_HOUR + i);
const TOTAL_HEIGHT = HOURS.length * DAY_HOUR_HEIGHT;
const DEFAULT_TIMED_DURATION = 3_600_000; // 1 hour — default when converting from all-day

type DragState =
  | { type: 'timed'; id: string; grabOffsetMin: number; durationMs: number }
  | { type: 'allDay'; id: string };

type ResizeInfo = { id: string; startMs: number };
type ResizeTarget = { id: string; newEndMs: number };

export interface IDayTimeGridHandle {
  prev: () => void;
  next: () => void;
  goToday: () => void;
}

interface IDayTimeGridProps {
  onDateChange?: (date: Date) => void;
  onEventClick?: (event: IEvent) => void;
}

export const DayTimeGrid = forwardRef<IDayTimeGridHandle, IDayTimeGridProps>(function DayTimeGrid(
  { onDateChange, onEventClick },
  ref,
) {
  const [date, setDate] = useState(new Date());
  const dispatch = useAppDispatch();
  const events = useAppSelector((state) => state.events.items);
  const { labels } = useLabels();

  const gridRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragTarget, setDragTarget] = useState<number | null>(null); // newStartMs on the time grid
  const [allDayDropActive, setAllDayDropActive] = useState(false);
  const resizeInfoRef = useRef<ResizeInfo | null>(null);
  const [resizeTarget, setResizeTarget] = useState<ResizeTarget | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      prev: () =>
        setDate((d) => {
          const n = new Date(d);
          n.setDate(d.getDate() - 1);
          return n;
        }),
      next: () =>
        setDate((d) => {
          const n = new Date(d);
          n.setDate(d.getDate() + 1);
          return n;
        }),
      goToday: () => setDate(new Date()),
    }),
    [],
  );

  useLayoutEffect(() => {
    onDateChange?.(date);
  }, [date, onDateChange]);

  const dateStr = dayToDateStr(date);
  const isToday = dateStr === dayToDateStr(new Date());
  const currentOffset = getCurrentTimeOffset(DAY_START_HOUR, DAY_HOUR_HEIGHT);

  const labelColorMap = useMemo(
    () => Object.fromEntries(labels.map((l) => [l.value, l.color])),
    [labels],
  );

  const { allDayEvents, timedEvents } = useMemo(() => {
    const allDay = [] as typeof events;
    const timed = [] as typeof events;
    for (const ev of events) {
      if (isMultiDay(ev)) {
        const evStartDs = dayToDateStr(new Date(ev.start));
        const evEndDs = dayToDateStr(new Date(ev.end - 1));
        if (evStartDs <= dateStr && dateStr <= evEndDs) allDay.push(ev);
      } else if (dayToDateStr(new Date(ev.start)) === dateStr) {
        timed.push(ev);
      }
    }
    return { allDayEvents: allDay, timedEvents: timed };
  }, [events, dateStr]);

  const eventLayouts = useMemo(() => layoutTimedEvents(timedEvents), [timedEvents]);

  const allDayRowCount = Math.max(1, allDayEvents.length);
  const allDayHeight =
    ALL_DAY_PAD * 2 +
    allDayRowCount * ALL_DAY_ROW_H +
    Math.max(0, allDayRowCount - 1) * ALL_DAY_GAP;

  const resetDrag = useCallback(() => {
    setDragState(null);
    setDragTarget(null);
    setAllDayDropActive(false);
  }, []);

  // ── Resize handlers ──────────────────────────────────────────────────────────

  const handleResizeStart = useCallback((e: React.PointerEvent, event: IEvent) => {
    const gridDiv = gridRef.current;
    if (!gridDiv) return;
    gridDiv.setPointerCapture(e.pointerId);
    resizeInfoRef.current = { id: event.id, startMs: event.start };
    setResizeTarget({ id: event.id, newEndMs: event.end });
  }, []);

  const handleResizeMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const ri = resizeInfoRef.current;
      if (!ri) return;
      const gridDiv = gridRef.current;
      if (!gridDiv) return;
      const rect = gridDiv.getBoundingClientRect();
      const yInGrid = Math.max(0, Math.min(e.clientY - rect.top, TOTAL_HEIGHT));
      const totalMin = (yInGrid / DAY_HOUR_HEIGHT) * 60;
      const snappedMin = Math.round(totalMin / SNAP_MIN) * SNAP_MIN;
      const [y, m, d] = dateStr.split('-').map(Number);
      const rawEndMs = Date.UTC(y, m - 1, d) + (DAY_START_HOUR * 60 + snappedMin) * 60000;
      const minEndMs = ri.startMs + SNAP_MIN * 60000;
      const maxEndMs = Date.UTC(y, m - 1, d) + DAY_END_HOUR * 3600000;
      const newEndMs = Math.max(minEndMs, Math.min(rawEndMs, maxEndMs));
      setResizeTarget((prev) =>
        prev && prev.newEndMs === newEndMs ? prev : { id: ri.id, newEndMs },
      );
    },
    [dateStr],
  );

  const handleResizeEnd = useCallback(
    (_e: React.PointerEvent<HTMLDivElement>) => {
      if (!resizeInfoRef.current) return;
      setResizeTarget((rt) => {
        if (rt) {
          const event = events.find((ev) => ev.id === rt.id);
          if (event) dispatch(updateEvent({ ...event, end: rt.newEndMs }));
        }
        return null;
      });
      resizeInfoRef.current = null;
    },
    [events, dispatch],
  );

  // ── Time-grid drag handlers ──────────────────────────────────────────────────

  const handleTimedDragStart = (e: React.DragEvent<HTMLDivElement>, event: IEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const grabOffsetMin =
      Math.round((((e.clientY - rect.top) / DAY_HOUR_HEIGHT) * 60) / SNAP_MIN) * SNAP_MIN;
    setDragState({
      type: 'timed',
      id: event.id,
      grabOffsetMin: Math.max(0, grabOffsetMin),
      durationMs: event.end - event.start,
    });
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', event.id);
    } catch {
      /* */
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!dragState) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const gridDiv = gridRef.current;
    if (!gridDiv) return;
    const rect = gridDiv.getBoundingClientRect();
    const yInGrid = Math.max(0, Math.min(e.clientY - rect.top, TOTAL_HEIGHT));
    const totalMin = (yInGrid / DAY_HOUR_HEIGHT) * 60;
    const grabOffsetMin = dragState.type === 'timed' ? dragState.grabOffsetMin : 0;
    const durationMs = dragState.type === 'timed' ? dragState.durationMs : DEFAULT_TIMED_DURATION;
    const newStartMin = totalMin - grabOffsetMin;
    const snappedMin = Math.round(newStartMin / SNAP_MIN) * SNAP_MIN;
    const durationMin = durationMs / 60000;
    const clampedMin = Math.max(
      0,
      Math.min(snappedMin, (DAY_END_HOUR - DAY_START_HOUR) * 60 - durationMin),
    );
    const [y, m, d] = dateStr.split('-').map(Number);
    const newStartMs = Date.UTC(y, m - 1, d) + (DAY_START_HOUR * 60 + clampedMin) * 60000;
    if (dragTarget !== newStartMs) setDragTarget(newStartMs);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragTarget(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragState || dragTarget === null) return;
    const event = events.find((ev) => ev.id === dragState.id);
    if (event) {
      const durationMs =
        dragState.type === 'timed' ? dragState.durationMs : DEFAULT_TIMED_DURATION;
      dispatch(updateEvent({ ...event, start: dragTarget, end: dragTarget + durationMs }));
    }
    resetDrag();
  };

  // ── All-day drag handlers ────────────────────────────────────────────────────

  const handleAllDayDragStart = (e: React.DragEvent<HTMLDivElement>, event: IEvent) => {
    setDragState({ type: 'allDay', id: event.id });
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', event.id);
    } catch {
      /* */
    }
  };

  const handleAllDayDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!dragState) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setAllDayDropActive(true);
  };

  const handleAllDayDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setAllDayDropActive(false);
  };

  const handleAllDayDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragState) return;
    if (dragState.type === 'timed') {
      const event = events.find((ev) => ev.id === dragState.id);
      if (event) {
        const [y, m, d] = dateStr.split('-').map(Number);
        const newStartMs = Date.UTC(y, m - 1, d);
        dispatch(updateEvent({ ...event, start: newStartMs, end: newStartMs + DAY_MS }));
      }
    }
    resetDrag();
  };

  // ── Preview cards ────────────────────────────────────────────────────────────

  let dragPreview: React.ReactNode = null;
  if (dragTarget !== null && dragState) {
    const src = events.find((ev) => ev.id === dragState.id);
    if (src) {
      const durationMs =
        dragState.type === 'timed' ? dragState.durationMs : DEFAULT_TIMED_DURATION;
      const [psh, psm] = clampHour(...msToUtcHM(dragTarget), DAY_START_HOUR, DAY_END_HOUR);
      const [peh, pem] = clampHour(
        ...msToUtcHM(dragTarget + durationMs),
        DAY_START_HOUR,
        DAY_END_HOUR,
      );
      const pStart = toTimeString(psh, psm);
      const pEnd = toTimeString(peh, pem);
      if (pStart !== pEnd) {
        dragPreview = (
          <WeekEventCard
            title={src.name}
            startTime={pStart}
            endTime={pEnd}
            color={labelColorMap[src.label] ?? DEFAULT_COLOR}
            offsetTop={timeToOffset(pStart, DAY_START_HOUR, DAY_HOUR_HEIGHT)}
            height={durationToHeight(pStart, pEnd, DAY_HOUR_HEIGHT)}
            className='pointer-events-none z-20 ring-2 ring-inset ring-current'
            style={{ opacity: 0.75 }}
          />
        );
      }
    }
  }

  let resizePreview: React.ReactNode = null;
  if (resizeTarget && resizeInfoRef.current) {
    const src = events.find((ev) => ev.id === resizeTarget.id);
    if (src) {
      const [psh, psm] = clampHour(...msToUtcHM(src.start), DAY_START_HOUR, DAY_END_HOUR);
      const [peh, pem] = clampHour(
        ...msToUtcHM(resizeTarget.newEndMs),
        DAY_START_HOUR,
        DAY_END_HOUR,
      );
      const pStart = toTimeString(psh, psm);
      const pEnd = toTimeString(peh, pem);
      if (pStart !== pEnd) {
        resizePreview = (
          <WeekEventCard
            title={src.name}
            startTime={pStart}
            endTime={pEnd}
            color={labelColorMap[src.label] ?? DEFAULT_COLOR}
            offsetTop={timeToOffset(pStart, DAY_START_HOUR, DAY_HOUR_HEIGHT)}
            height={durationToHeight(pStart, pEnd, DAY_HOUR_HEIGHT)}
            className='pointer-events-none z-20 ring-2 ring-inset ring-current'
            style={{ opacity: 0.75 }}
          />
        );
      }
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className='flex rounded-lg border border-outline-variant overflow-hidden bg-surface-container-lowest'>
      {/* Left column: all-day label + hour labels */}
      <div className='w-20 shrink-0 border-r border-outline-variant flex flex-col'>
        <div
          className='border-b border-outline-variant flex items-center justify-end pr-2 pt-1 shrink-0'
          style={{ height: allDayHeight }}>
          <span className='text-label-xs text-on-surface-variant whitespace-nowrap'>all-day</span>
        </div>
        {HOURS.map((h) => (
          <div
            key={h}
            className='flex items-start justify-end pr-2 pt-1 shrink-0'
            style={{ height: DAY_HOUR_HEIGHT }}>
            <span className='text-label-sm text-on-surface-variant'>{formatHour(h)}</span>
          </div>
        ))}
      </div>

      {/* Right side */}
      <div className='flex-1 flex flex-col'>
        {/* All-day row */}
        <div
          className={cn(
            'shrink-0 border-b border-outline-variant transition-colors',
            allDayDropActive && 'bg-primary/10',
          )}
          style={{ height: allDayHeight }}
          onDragOver={handleAllDayDragOver}
          onDragLeave={handleAllDayDragLeave}
          onDrop={handleAllDayDrop}>
          <div className='flex flex-col' style={{ gap: ALL_DAY_GAP, padding: ALL_DAY_PAD }}>
            {allDayEvents.map((event) => {
              const color = labelColorMap[event.label] ?? DEFAULT_COLOR;
              const isDragging = dragState?.id === event.id;
              return (
                <div
                  key={event.id}
                  draggable
                  className={cn(
                    'rounded-md px-2 flex items-center overflow-hidden select-none transition-all',
                    isDragging
                      ? 'opacity-40 cursor-grabbing'
                      : 'cursor-grab hover:brightness-95',
                  )}
                  style={{
                    height: ALL_DAY_ROW_H,
                    background: `color-mix(in srgb, ${color} 18%, transparent)`,
                    color,
                  }}
                  onDragStart={(e) => handleAllDayDragStart(e, event)}
                  onDragEnd={resetDrag}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!dragState) onEventClick?.(event);
                  }}>
                  <span className='text-[12px] font-medium truncate'>{event.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time grid */}
        <div
          ref={gridRef}
          className='relative'
          style={{ height: TOTAL_HEIGHT }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPointerMove={handleResizeMove}
          onPointerUp={handleResizeEnd}
          onPointerCancel={handleResizeEnd}>
          {HOURS.map((h) => (
            <div
              key={h}
              className='absolute w-full border-b border-outline-variant/30'
              style={{ top: (h - DAY_START_HOUR) * DAY_HOUR_HEIGHT }}
            />
          ))}

          <div className='absolute inset-0'>
            {timedEvents.map((event) => {
              const [sh, sm] = clampHour(...msToUtcHM(event.start), DAY_START_HOUR, DAY_END_HOUR);
              const [eh, em] = clampHour(...msToUtcHM(event.end), DAY_START_HOUR, DAY_END_HOUR);
              const startTime = toTimeString(sh, sm);
              const endTime = toTimeString(eh, em);
              if (startTime === endTime) return null;
              const color = labelColorMap[event.label] ?? DEFAULT_COLOR;
              const isDragging = dragState?.id === event.id;
              const isResizing = resizeTarget?.id === event.id;
              const layout = eventLayouts.get(event.id);
              const overlapStyle: React.CSSProperties =
                layout && layout.totalCols > 1
                  ? {
                      left: `calc(${(layout.col / layout.totalCols) * 100}% + 4px)`,
                      right: `calc(${((layout.totalCols - layout.col - 1) / layout.totalCols) * 100}% + 4px)`,
                      zIndex: layout.col + 1,
                    }
                  : {};
              return (
                <DayEventCard
                  key={event.id}
                  event={{
                    id: event.id,
                    title: event.name,
                    date: dateStr,
                    startTime,
                    endTime,
                    description: event.notes || undefined,
                  }}
                  color={color}
                  offsetTop={timeToOffset(startTime, DAY_START_HOUR, DAY_HOUR_HEIGHT)}
                  height={durationToHeight(startTime, endTime, DAY_HOUR_HEIGHT)}
                  draggable={!isResizing}
                  className={cn(
                    isDragging || isResizing ? 'opacity-40' : '',
                    isDragging ? 'cursor-grabbing' : 'cursor-grab',
                  )}
                  style={overlapStyle}
                  onDragStart={(e) => handleTimedDragStart(e, event)}
                  onDragEnd={resetDrag}
                  onResizeStart={(e) => handleResizeStart(e, event)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!dragState && !resizeTarget) onEventClick?.(event);
                  }}
                />
              );
            })}

            {dragPreview}
            {resizePreview}

            {isToday && currentOffset >= 0 && currentOffset <= TOTAL_HEIGHT && (
              <div
                className='absolute inset-x-0 flex items-center pointer-events-none z-10'
                style={{ top: currentOffset }}>
                <div className='w-2 h-2 rounded-full bg-primary shrink-0 -ml-1' />
                <div className='flex-1 border-t-2 border-primary' />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
