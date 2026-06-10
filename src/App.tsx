import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from 'app/store';
import { AppHeader } from 'app/components/organisms/AppHeader';
import { useNotifications } from 'app/hooks/useNotifications';
import { ROUTES } from 'app/constants/route';

function App() {
  useNotifications();
  const { user, isAnonymous } = useAppSelector((s) => s.auth);

  if (!user && !isAnonymous) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <div className='min-h-screen min-w-3xl bg-background'>
      <AppHeader />
      <Outlet />
    </div>
  );
}

export default App;
