import { Spinner } from '../components/atoms/Spinner'

export function LoadingView() {
  return (
    <div className='min-h-[calc(100vh-7rem)] flex items-center justify-center'>
      <Spinner size={36} />
    </div>
  )
}
