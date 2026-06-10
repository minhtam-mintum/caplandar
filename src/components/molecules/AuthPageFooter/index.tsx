import { GhostButton } from 'app/components/molecules/Buttons/GhostButton';

export function AuthPageFooter() {
  return (
    <footer className='flex items-center justify-center gap-1 text-label-xs'>
      <GhostButton className='text-label-xs text-on-surface-variant'>Privacy Policy</GhostButton>
      <span className='text-on-surface-variant'>•</span>
      <GhostButton className='text-label-xs text-on-surface-variant'>System Status</GhostButton>
      <span className='text-on-surface-variant'>•</span>
      <GhostButton className='text-label-xs text-on-surface-variant'>Support</GhostButton>
    </footer>
  );
}
