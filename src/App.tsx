import { Outlet } from 'react-router-dom';
import { AppHeader } from 'app/components/organisms/AppHeader';
import { useNotifications } from 'app/hooks/useNotifications';

function App() {
  useNotifications();
  return (
    <div className='min-h-screen bg-background'>
      <AppHeader />
      <Outlet />
    </div>
  );
}

export default App;
