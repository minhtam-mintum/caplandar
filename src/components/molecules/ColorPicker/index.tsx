import { ButtonField } from 'app/components/molecules/Buttons/ButtonField';

const COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
];

export const DEFAULT_COLOR = COLORS[0];

interface IColorPickerProps {
  selected: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

export function ColorPicker({ selected, onChange, disabled }: IColorPickerProps) {
  return (
    <div className='flex items-center gap-1.5'>
      {COLORS.map((c) => (
        <ButtonField
          key={c}
          variant='swatch'
          type='button'
          onClick={() => onChange(c)}
          disabled={disabled}
          style={{ background: c }}
          className={`shrink-0 ${
            selected === c
              ? 'ring-2 ring-offset-1 ring-outline-variant scale-110'
              : 'hover:scale-110'
          }`}>
          <span className='sr-only'>{c}</span>
        </ButtonField>
      ))}
    </div>
  );
}
