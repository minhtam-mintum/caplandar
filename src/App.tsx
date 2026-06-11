import { useEffect, useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/store';
import { AppHeader } from 'app/components/organisms/AppHeader';
import { useNotifications } from 'app/hooks/useNotifications';
import { ROUTES } from 'app/constants/route';
import { fetchEventsThunk } from 'app/store/slices/eventSlice';

function App() {
  useNotifications();
  const { user, isAnonymous } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const loadedForUser = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      loadedForUser.current = null;
      return;
    }
    if (loadedForUser.current === user._id) return;
    loadedForUser.current = user._id;
    const now = new Date();
    dispatch(
      fetchEventsThunk({
        from: `${now.getFullYear()}-01-01`,
        to: `${now.getFullYear()}-12-31`,
      }),
    );
  }, [user, dispatch]);

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
