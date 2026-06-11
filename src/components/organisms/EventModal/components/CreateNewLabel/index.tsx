import { useEffect, useRef, useState } from 'react';
import { Check, Loader2, Plus, Tag, X } from 'lucide-react';
import { ButtonField } from 'app/components/molecules/Buttons/ButtonField';
import { useSelectContext } from 'app/components/molecules/Selects/SelectRHF';
import type { ILabel } from 'app/hooks/useLabels';

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

interface ICreateNewLabelProps {
  onAdd: (label: ILabel) => Promise<ILabel>;
}

export function CreateNewLabel({ onAdd }: ICreateNewLabelProps) {
  const { setItem, items } = useSelectContext();
  const [isAdding, setIsAdding] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [value, setValue] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const handleConfirm = async () => {
    const trimmed = value.trim();
    if (trimmed) {
      setIsCreating(true);
      try {
        const label: ILabel = { name: trimmed, value: trimmed, color };
        const created = await onAdd(label);
        setItem([
          ...items,
          {
            value: created.value,
            option: (
              <span className='flex items-center gap-2'>
                <Tag size={12} style={{ color }} />
                {trimmed}
              </span>
            ),
          },
        ]);
        setValue('');
        setIsAdding(false);
      } finally {
        setIsCreating(false);
      }
    } else {
      setValue('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setValue('');
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <ButtonField variant='label-action' type='button' onClick={() => setIsAdding(true)}>
        <Plus size={14} className='shrink-0' />
        Create New Label
      </ButtonField>
    );
  }

  return (
    <div className='flex flex-col px-4 py-2.5 gap-2'>
      <div className='flex items-center gap-1.5'>
        {COLORS.map((c) => (
          <ButtonField
            key={c}
            variant='swatch'
            type='button'
            onClick={() => setColor(c)}
            disabled={isCreating}
            style={{ background: c }}
            className={
              color === c
                ? 'ring-2 ring-offset-1 ring-outline-variant scale-110'
                : 'hover:scale-110'
            }></ButtonField>
        ))}
      </div>
      <div className='flex items-center gap-2'>
        <Tag size={13} style={{ color }} className='shrink-0' />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void handleConfirm();
            }
            if (e.key === 'Escape') handleCancel();
          }}
          placeholder='Label name…'
          className='flex-1 text-body-md bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant/50'
        />
        <ButtonField
          variant='action-icon'
          type='button'
          onClick={() => void handleConfirm()}
          disabled={isCreating}
          className='text-primary'>
          {isCreating ? <Loader2 size={14} className='animate-spin' /> : <Check size={14} />}
        </ButtonField>
        <ButtonField
          variant='action-icon'
          type='button'
          onClick={handleCancel}
          disabled={isCreating}
          className='text-on-surface-variant'>
          <X size={14} />
        </ButtonField>
      </div>
    </div>
  );
}
