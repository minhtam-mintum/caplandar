import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { AlertTriangle, LogIn, Users } from 'lucide-react';
import { Button } from 'app/components/atoms/Button';
import { Modal, type IModalHandle } from 'app/components/molecules/Modal';

interface IAnonymousConfirmModalProps {
  onConfirm: () => void;
}

export const AnonymousConfirmModal = forwardRef<IModalHandle, IAnonymousConfirmModalProps>(
  function AnonymousConfirmModal({ onConfirm }, ref) {
    const innerRef = useRef<IModalHandle>(null);

    useImperativeHandle(
      ref,
      () => ({
        open: () => innerRef.current?.open(),
        close: () => innerRef.current?.close(),
      }),
      [],
    );

    const handleConfirm = useCallback(() => {
      onConfirm();
      innerRef.current?.close();
    }, [onConfirm]);

    return (
      <Modal
        ref={innerRef}
        render={(renderHeader) => (
          <>
            {renderHeader(
              <h2 className='flex-1 text-headline-md text-on-surface'>Join as Guest?</h2>,
            )}
            <div className='px-6 py-5 flex flex-col gap-4'>
              <div className='flex items-start gap-3 p-4 rounded-xl bg-error-container'>
                <AlertTriangle size={20} className='text-on-error-container shrink-0 mt-0.5' />
                <div className='flex flex-col gap-1.5'>
                  <p className='text-label-lg font-semibold text-on-error-container'>
                    Data stored locally only
                  </p>
                  <ul className='text-body-sm text-on-error-container list-disc pl-4 flex flex-col gap-0.5'>
                    <li>Will not sync to other devices or browsers</li>
                    <li>Permanently lost if browser storage is cleared</li>
                  </ul>
                </div>
              </div>
              <p className='text-body-sm text-on-surface-variant'>
                You can sign in any time from the header to save your data to an account.
              </p>
            </div>
            <div className='h-px bg-outline-variant' />
            <div className='px-6 py-4 flex flex-col gap-3'>
              <Button type='button' variant='primary' onClick={handleConfirm}>
                <Users size={15} />I understand, continue as Guest
              </Button>
              <Button type='button' variant='ghost' onClick={() => innerRef.current?.close()}>
                <LogIn size={15} />
                Sign in instead
              </Button>
            </div>
          </>
        )}
      />
    );
  },
);
