import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/organisms/AppHeader'
import { LoadingView } from './pages/LoadingView'

const YearView = lazy(() => import('./pages/YearView').then((m) => ({ default: m.YearView })))
const MonthView = lazy(() => import('./pages/MonthView').then((m) => ({ default: m.MonthView })))
const WeekView = lazy(() => import('./pages/WeekView').then((m) => ({ default: m.WeekView })))
const DayView = lazy(() => import('./pages/DayView').then((m) => ({ default: m.DayView })))

function App() {
  return (
    <div className='min-h-screen bg-background'>
      <AppHeader />
      <Suspense fallback={<LoadingView />}>
        <Routes>
          <Route path='/' element={<Navigate to='/year' replace />} />
          <Route path='/year' element={<YearView />} />
          <Route path='/month' element={<MonthView />} />
          <Route path='/week' element={<WeekView />} />
          <Route path='/day' element={<DayView />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
