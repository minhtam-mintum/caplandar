import { useCallback, useRef } from 'react';
import { Calendar, CalendarDays, CalendarRange, LayoutGrid, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from 'app/constants/route';
import type { IEvent } from 'app/store/slices/eventSlice';
import { Avatar } from 'app/components/atoms/Avatar';
import { Button } from 'app/components/atoms/Button';
import { Logo } from 'app/components/atoms/Logo';
import { NavTabs, type NavTab } from 'app/components/molecules/NavTabs';
import { EventModal, IEventModalHandle, type EventFormData } from 'app/components/organisms/EventModal';
import { EventSearch } from './components/EventSearch';
import { NotificationPanel } from './components/NotificationPanel';

const CALENDAR_TABS: NavTab[] = [
  { id: ROUTES.YEAR, label: 'Year View', icon: <LayoutGrid size={14} /> },
  { id: ROUTES.MONTH, label: 'Month View', icon: <CalendarDays size={14} /> },
  { id: ROUTES.WEEK, label: 'Week View', icon: <CalendarRange size={14} /> },
  { id: ROUTES.DAY, label: 'Day View', icon: <Calendar size={14} /> },
];

export function AppHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const eventModalRef = useRef<IEventModalHandle>(null);
  const activeView = CALENDAR_TABS.some((t) => t.id === pathname) ? pathname : ROUTES.MONTH;

  const handleEventClick = useCallback((data: Partial<EventFormData>) => {
    eventModalRef.current?.open(data);
  }, []);

  const handleSearchSelect = useCallback(
    (event: IEvent) => {
      navigate(activeView, { state: { seekDate: event.start } });
      eventModalRef.current?.open({
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
    },
    [activeView, navigate],
  );

  return (
    <>
      <EventModal ref={eventModalRef} />
      <header className='sticky top-0 z-10 bg-surface-container-lowest border-b border-outline-variant'>
        <div className='max-w-360 mx-auto px-margin'>
          <div className='flex items-center gap-4 h-14'>
            <Logo />
            <div className='w-85'>
              <EventSearch onEventSelect={handleSearchSelect} />
            </div>
            <div className='flex items-center gap-2 ml-auto shrink-0'>
              <Button
                variant='primary'
                onClick={() => {
                  eventModalRef.current?.open();
                }}>
                <Plus size={15} />
                Create Event
              </Button>
              <NotificationPanel onEventClick={handleEventClick} />
              <Avatar initials='MT' />
            </div>
          </div>
          <div className='pb-0.5'>
            <NavTabs tabs={CALENDAR_TABS} active={activeView} onChange={navigate} />
          </div>
        </div>
      </header>
    </>
  );
}
