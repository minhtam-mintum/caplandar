interface ISpinnerProps {
  size?: number
}

export function Spinner({ size = 32 }: ISpinnerProps) {
  return (
    <div
      className='rounded-full border-2 border-primary/20 border-t-primary animate-spin'
      style={{ width: size, height: size }}
      role='status'
      aria-label='Loading'
    />
  )
}
