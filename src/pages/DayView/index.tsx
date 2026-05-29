import { useCallback, useRef, useState } from 'react';
import { DayTimeGrid, type IDayTimeGridHandle } from './components/DayTimeGrid';
import { Toolbar } from 'app/components/molecules/Toolbar';
import { formatFullDate, getDayTitle } from 'app/utils/day';
import { EventModal, type IEventModalHandle } from 'app/components/organisms/EventModal';
import type { IEvent } from 'app/store/slices/eventSlice';

export function DayView() {
  const gridRef = useRef<IDayTimeGridHandle>(null);
  const modalRef = useRef<IEventModalHandle>(null);
  const [date, setDate] = useState(new Date());

  const onPrev  = useCallback(() => gridRef.current?.prev(), []);
  const onNext  = useCallback(() => gridRef.current?.next(), []);
  const onToday = useCallback(() => gridRef.current?.goToday(), []);

  const handleEventClick = useCallback((event: IEvent) => {
    modalRef.current?.open({
      id: event.id,
      name: event.name,
      startDate: new Date(Math.floor(event.start / 86400000) * 86400000),
      startTime: event.start % 86400000,
      endDate: new Date(Math.floor(event.end / 86400000) * 86400000),
      endTime: event.end % 86400000,
      alert: event.alert,
      label: event.label,
      notes: event.notes,
    });
  }, []);

  return (
    <main className='max-w-360 mx-auto px-margin py-lg flex flex-col gap-6'>
      <EventModal ref={modalRef} />
      <Toolbar
        align='start'
        title={
          <div>
            <h1 className='text-headline-xl text-on-surface'>{getDayTitle(date)}</h1>
            <p className='text-body-lg text-on-surface-variant'>{formatFullDate(date)}</p>
          </div>
        }
        onPrev={onPrev}
        onNext={onNext}
        onToday={onToday}
      />
      <DayTimeGrid ref={gridRef} onDateChange={setDate} onEventClick={handleEventClick} />
    </main>
  );
}
