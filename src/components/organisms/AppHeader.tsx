import { Bell, Calendar, CalendarDays, CalendarRange, LayoutGrid, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/button/Button';
import { Logo } from '../atoms/Logo';
import { NavTabs, type NavTab } from '../molecules/NavTabs';
import { SearchBar } from '../molecules/inputs/SearchBar';

const CALENDAR_TABS: NavTab[] = [
  { id: '/year', label: 'Year View', icon: <LayoutGrid size={14} /> },
  { id: '/month', label: 'Month View', icon: <CalendarDays size={14} /> },
  { id: '/week', label: 'Week View', icon: <CalendarRange size={14} /> },
  { id: '/day', label: 'Day View', icon: <Calendar size={14} /> },
];

interface IAppHeaderProps {
  onCreateTask?: () => void;
}

export function AppHeader({ onCreateTask }: IAppHeaderProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeView = CALENDAR_TABS.some((t) => t.id === pathname) ? pathname : '/year';

  return (
    <header className='sticky top-0 z-10 bg-surface-container-lowest border-b border-outline-variant'>
      <div className='max-w-360 mx-auto px-margin'>
        <div className='flex items-center gap-4 h-14'>
          <Logo />
          <div className='w-85'>
            <SearchBar />
          </div>
          <div className='flex items-center gap-2 ml-auto shrink-0'>
            <Button variant='primary' onClick={onCreateTask}>
              <Plus size={15} />
              Create Task
            </Button>
            <Button variant='icon' aria-label='Notifications'>
              <Bell size={18} />
            </Button>
            <Avatar initials='MT' />
          </div>
        </div>
        <div className='pb-0.5'>
          <NavTabs tabs={CALENDAR_TABS} active={activeView} onChange={navigate} />
        </div>
      </div>
    </header>
  );
}
