import { Navigate, Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/organisms/AppHeader'
import { YearView } from './pages/YearView'

function App() {
  return (
    <div className='min-h-screen bg-background'>
      <AppHeader />
      <Routes>
        <Route path='/' element={<Navigate to='/year' replace />} />
        <Route path='/year' element={<YearView />} />
        {/* /month, /week, /day pages go here */}
      </Routes>
    </div>
  )
}

export default App
