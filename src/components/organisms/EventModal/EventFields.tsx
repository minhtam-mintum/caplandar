import { Bell } from 'lucide-react';
import { InputRHF } from 'app/components/molecules/Inputs/InputRHF';
import { SelectRHF } from 'app/components/molecules/Selects/SelectRHF';
import { RichTextEditorRHF } from 'app/components/molecules/RichTextEditor/RichTextEditorRHF';
import { GroupPeriodDate } from './components/GroupPeriodDate';
import { GroupPeriodTime } from './components/GroupPeriodTime';
import { LabelSelect } from './components/LabelSelect';
import { ALERT_OPTIONS } from './const';

interface IEventFieldsProps {
  canEditAll: boolean;
}

export function EventFields({ canEditAll }: IEventFieldsProps) {
  return (
    <div className='px-6 py-5 flex flex-col gap-5'>
      <InputRHF name='name' label='Name' disabled={!canEditAll} />

      <div className='grid grid-cols-2 gap-x-3 gap-y-2'>
        <GroupPeriodDate disabled={!canEditAll} />
        <GroupPeriodTime disabled={!canEditAll} />
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <SelectRHF
          name='alert'
          label='Alert'
          options={ALERT_OPTIONS}
          icon={<Bell size={15} />}
          disabled={!canEditAll}
        />

        <LabelSelect disabled={!canEditAll} />
      </div>

      <RichTextEditorRHF name='notes' label='Notes' disabled={!canEditAll} />
    </div>
  );
}
