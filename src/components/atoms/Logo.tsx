export function Logo() {
  return (
    <div className='flex items-center gap-2 shrink-0'>
      <div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center'>
        <span className='text-on-primary font-bold text-sm leading-none'>C</span>
      </div>
      <span className='text-primary font-bold text-2xl tracking-tight'>Caplander</span>
    </div>
  );
}
