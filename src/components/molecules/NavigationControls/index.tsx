import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GhostButton } from 'app/components/molecules/Buttons/GhostButton';
import { IconButton } from 'app/components/molecules/Buttons/IconButton';

interface INavigationControlsProps {
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function NavigationControls({ onPrev, onNext, onToday }: INavigationControlsProps) {
  return (
    <div className='flex items-center gap-1'>
      <GhostButton onClick={onToday} className='text-body-md'>
        Today
      </GhostButton>
      <IconButton onClick={onPrev} aria-label='Previous'>
        <ChevronLeft size={16} />
      </IconButton>
      <IconButton onClick={onNext} aria-label='Next'>
        <ChevronRight size={16} />
      </IconButton>
    </div>
  );
}
