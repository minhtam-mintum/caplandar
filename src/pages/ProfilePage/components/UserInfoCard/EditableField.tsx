import { useEffect, useRef, useState } from 'react';
import { Check, Loader2, Pencil, X } from 'lucide-react';
import { Input } from 'app/components/atoms/Input';
import { IconButton } from 'app/components/molecules/Buttons/IconButton';

interface IEditableFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onSave: (value: string) => Promise<void>;
}

export function EditableField({ label, value, placeholder, onSave }: IEditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleEdit = () => {
    setDraft(value);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (trimmed === value) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(trimmed);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='flex flex-col gap-1'>
      <span className='text-label-sm text-on-surface-variant'>{label}</span>
      {isEditing ? (
        <div className='flex items-center gap-1'>
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            placeholder={placeholder}
            className='flex-1'
          />
          <IconButton onClick={() => void handleSave()} disabled={isSaving} className='text-primary hover:text-primary/80'>
            {isSaving ? <Loader2 size={15} className='animate-spin' /> : <Check size={15} />}
          </IconButton>
          <IconButton onClick={handleCancel} disabled={isSaving}>
            <X size={15} />
          </IconButton>
        </div>
      ) : (
        <div className='flex items-center gap-1 group'>
          <span className='text-body-md text-on-surface'>
            {value || <span className='text-on-surface-variant/50 italic'>{placeholder ?? '—'}</span>}
          </span>
          <IconButton onClick={handleEdit} className='opacity-0 group-hover:opacity-100'>
            <Pencil size={13} />
          </IconButton>
        </div>
      )}
    </div>
  );
}
