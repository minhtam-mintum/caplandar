import { useCallback, useMemo, useRef } from 'react';
import { FullMonthInYear, type IFullMonthInYearHandle } from './components/FullMonthInYear';
import { EventModal, type IEventModalHandle } from 'app/components/organisms/EventModal';
import { Toolbar } from 'app/components/molecules/Toolbar';
import { HeatmapDay } from 'app/components/molecules/HeatmapDay';
import { useEvents } from 'app/hooks/useEvents';
import { toDateStr } from 'app/utils/calendar';
import { ITitleYearPageHandle, TitleYearPage } from './components/Title';

export function YearView() {
  const defaultYear = useRef(new Date().getFullYear()).current;
  const yearRef = useRef<IFullMonthInYearHandle>(null);
  const modalRef = useRef<IEventModalHandle>(null);
  const titleRef = useRef<ITitleYearPageHandle>(null);
  const { events } = useEvents();

  const countByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const event of events) {
      const startDay = Math.floor(event.start / 86400000) * 86400000;
      const endDay = Math.floor(event.end / 86400000) * 86400000;
      for (let day = startDay; day <= endDay; day += 86400000) {
        const d = new Date(day);
        const key = toDateStr(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
        map[key] = (map[key] ?? 0) + 1;
      }
    }
    return map;
  }, [events]);

  const renderDay = useCallback(
    (year: number, month: number, day: number) => (
      <HeatmapDay
        day={day}
        count={countByDate[toDateStr(year, month, day)] ?? 0}
        onClick={() => modalRef.current?.open()}
      />
    ),
    [countByDate],
  );

  const handleSync = (newYear: number) => {
    if (!yearRef.current || !titleRef.current) return;
    yearRef.current.onSetYear(newYear);
    titleRef.current.setYear(newYear);
  };
  const handlePrev = () => handleSync((yearRef.current?.getYear() ?? defaultYear) - 1);
  const handleNext = () => handleSync((yearRef.current?.getYear() ?? defaultYear) + 1);
  const handleToday = () => handleSync(defaultYear);

  return (
    <main className='max-w-360 mx-auto px-margin py-lg flex flex-col gap-6'>
      <EventModal ref={modalRef} />
      <Toolbar
        align='end'
        title={<TitleYearPage defaultYear={defaultYear} ref={titleRef} />}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />
      <FullMonthInYear ref={yearRef} defaultYear={defaultYear} renderDay={renderDay} />
    </main>
  );
}
