import { Routes } from 'react-router-dom'

function App() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-360 mx-auto px-margin'>
        <h1 className='text-headline-xl text-on-surface py-lg'>Calendar Task Planner</h1>
        <Routes>
          {/* Add your routes here */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
