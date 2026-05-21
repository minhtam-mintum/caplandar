import { useFormContext } from 'react-hook-form';
import { Bold, Bell, CalendarDays, Italic, Link2, List, Tag } from 'lucide-react';
import { Label } from 'app/components/atoms/Label';
import { InputRHF } from 'app/components/molecules/Inputs/InputRHF';
import { SelectRHF } from 'app/components/molecules/Selects/SelectRHF';
import type { EventFormData } from './const';
import { ALERT_OPTIONS, LABEL_OPTIONS } from './const';

interface IEventFieldsProps {
  canEditAll: boolean;
}

export function EventFields({ canEditAll }: IEventFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<EventFormData>();

  return (
    <div className='px-6 py-5 flex flex-col gap-5'>
      <InputRHF name='name' label='Name' disabled={!canEditAll} />

      <div className='grid grid-cols-2 gap-3'>
        <div className='flex flex-col gap-1'>
          <Label>Start</Label>
          <div className='flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3'>
            <CalendarDays size={16} className='text-on-surface-variant shrink-0' />
            <input
              {...register('start')}
              type='datetime-local'
              disabled={!canEditAll}
              className='flex-1 bg-transparent outline-none text-body-md text-on-surface disabled:opacity-50'
            />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <Label>End</Label>
          <div className='flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3'>
            <CalendarDays size={16} className='text-on-surface-variant shrink-0' />
            <input
              {...register('end')}
              type='datetime-local'
              disabled={!canEditAll}
              className='flex-1 bg-transparent outline-none text-body-md text-on-surface disabled:opacity-50'
            />
          </div>
        </div>
      </div>
      {(errors.start || errors.end) && (
        <p className='text-label-sm text-error'>
          {errors.end?.message ?? errors.start?.message}
        </p>
      )}

      <div className='grid grid-cols-2 gap-3'>
        <SelectRHF
          name='alert'
          label='Alert'
          options={ALERT_OPTIONS}
          icon={<Bell size={15} />}
          disabled={!canEditAll}
        />

        <SelectRHF
          name='label'
          label='Label'
          options={LABEL_OPTIONS}
          icon={<Tag size={15} />}
          disabled={!canEditAll}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <Label className='uppercase tracking-widest'>Notes</Label>
        <div className='border border-outline-variant rounded-xl overflow-hidden'>
          <div className='flex items-center gap-0.5 px-3 py-2 border-b border-outline-variant bg-surface-container-low'>
            {[
              { Icon: Bold, title: 'Bold' },
              { Icon: Italic, title: 'Italic' },
              { Icon: List, title: 'List' },
              { Icon: Link2, title: 'Link' },
            ].map(({ Icon, title }) => (
              <button
                key={title}
                type='button'
                title={title}
                className='p-1.5 rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors'>
                <Icon size={15} />
              </button>
            ))}
          </div>
          <textarea
            {...register('notes')}
            placeholder='Add notes…'
            rows={5}
            disabled={!canEditAll}
            className='w-full px-4 py-3 text-body-md text-on-surface bg-transparent outline-none resize-none placeholder:text-on-surface-variant/50 disabled:opacity-50'
          />
        </div>
      </div>
    </div>
  );
}
