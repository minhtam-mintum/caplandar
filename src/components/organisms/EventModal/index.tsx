import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { CalendarDays, Pencil } from 'lucide-react';
import { Modal, type IModalHandle } from 'app/components/molecules/Modal';
import { Form } from 'app/components/molecules/Form';
import { ButtonRHF } from 'app/components/molecules/Buttons/ButtonRHF';
import { CancelButton } from 'app/components/molecules/Buttons/CancelButton';
import { useAppDispatch } from 'app/store';
import { addEvent, updateEvent } from 'app/store/slices/eventSlice';
import { eventModalSchema, type EventFormData } from './const';
import { EventFields } from './EventFields';
import { EventDetail } from './EventDetail';
import { OutlineButton } from 'app/components/molecules/Buttons/OutlineButton';

export type { EventFormData } from './const';

export interface IEventModalHandle {
  open: (initialData?: Partial<EventFormData>) => void;
  close: () => void;
}

interface IEventModalProps {}

export const EventModal = forwardRef<IEventModalHandle, IEventModalProps>(function EventModal(
  {},
  ref,
) {
  const dispatch = useAppDispatch();
  const [isDetail, setIsDetail] = useState(false);
  const modalRef = useRef<IModalHandle>(null);
  const dataRef = useRef<Partial<EventFormData>>({});
  useImperativeHandle(
    ref,
    () => ({
      open: (data) => {
        setIsDetail(!!data?.id);
        modalRef.current?.open();
        dataRef.current = data ?? {};
      },
      close: () => {
        modalRef.current?.close();
      },
    }),
    [],
  );

  const onSubmit = (data: EventFormData) => {
    const start = data.startDate.getTime() + data.startTime;
    const end = data.endDate.getTime() + data.endTime;
    const event = {
      name: data.name,
      start,
      end,
      alert: data.alert,
      label: data.label,
      notes: data.notes,
    };
    if (data.id) {
      dispatch(updateEvent({ id: data.id, ...event }));
    } else {
      dispatch(addEvent({ id: crypto.randomUUID(), ...event }));
    }
    modalRef.current?.close();
  };
  const id = dataRef.current.id;
  const localizeFormTitle = dataRef.current.name ? 'Update Event' : 'New Event';
  const headerTitle = isDetail ? (dataRef.current.name ?? '') : localizeFormTitle;
  return (
    <Modal
      ref={modalRef}
      render={(renderHeader, renderFooter) => (
        <Form defaultValues={dataRef.current} schema={eventModalSchema} onSubmit={onSubmit}>
          {renderHeader(
            <>
              <CalendarDays size={20} className='text-primary shrink-0' />
              <h2 className='flex-1 text-headline-md text-on-surface'>{headerTitle}</h2>
            </>,
          )}
          {isDetail ? <EventDetail /> : <EventFields />}
          {renderFooter(
            isDetail ? (
              <div className='flex justify-end'>
                <OutlineButton type='button' onClick={() => setIsDetail(false)}>
                  <Pencil size={14} />
                  Edit
                </OutlineButton>
              </div>
            ) : (
              <div className='flex justify-end gap-2 w-full'>
                {id && (
                  <CancelButton type='button' onClick={() => setIsDetail(true)}>
                    Cancel
                  </CancelButton>
                )}
                <ButtonRHF variant='primary'>{id ? 'Save Changes' : 'Create'}</ButtonRHF>
              </div>
            ),
          )}
        </Form>
      )}
    />
  );
});
