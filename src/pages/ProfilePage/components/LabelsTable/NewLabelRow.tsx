import { useEffect, useRef, useState } from 'react';
import { Check, Loader2, Plus, X } from 'lucide-react';
import { Input } from 'app/components/atoms/Input';
import { IconButton } from 'app/components/molecules/Buttons/IconButton';
import { GhostButton } from 'app/components/molecules/Buttons/GhostButton';
import { ColorPicker, DEFAULT_COLOR } from 'app/components/molecules/ColorPicker';

interface INewLabelRowProps {
  onAdd: (name: string, color: string) => Promise<void>;
}

function NewLabelRow({ onAdd }: INewLabelRowProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const handleConfirm = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setIsAdding(false);
      setName('');
      return;
    }
    setIsSaving(true);
    try {
      await onAdd(trimmed, color);
      setName('');
      setColor(DEFAULT_COLOR);
      setIsAdding(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName('');
    setColor(DEFAULT_COLOR);
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <tr>
        <td colSpan={3} className='px-6 py-3'>
          <GhostButton
            onClick={() => setIsAdding(true)}
            className='text-primary hover:text-primary/80 text-body-sm'>
            <Plus size={14} />
            Add label
          </GhostButton>
        </td>
      </tr>
    );
  }

  return (
    <tr className='border-t border-outline-variant'>
      <td className='px-6 py-3'>
        <Input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void handleConfirm();
            if (e.key === 'Escape') handleCancel();
          }}
          placeholder='Label name…'
        />
      </td>
      <td className='px-6 py-3 text-center'>
        <ColorPicker selected={color} onChange={setColor} disabled={isSaving} />
      </td>
      <td className='px-6 py-3'>
        <div className='flex items-center justify-end gap-1'>
          <IconButton
            onClick={() => void handleConfirm()}
            disabled={isSaving}
            className='text-primary hover:text-primary/80'>
            {isSaving ? <Loader2 size={15} className='animate-spin' /> : <Check size={15} />}
          </IconButton>
          <IconButton onClick={handleCancel} disabled={isSaving}>
            <X size={15} />
          </IconButton>
        </div>
      </td>
    </tr>
  );
}

export { NewLabelRow };
