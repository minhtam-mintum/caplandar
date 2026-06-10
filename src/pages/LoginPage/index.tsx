import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertTriangle, ArrowRight, LogIn, Users } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { apiLogin } from 'app/services/api';
import { useAppDispatch, useAppSelector } from 'app/store';
import { setAnonymous, setAuth } from 'app/store/slices/authSlice';
import { Button } from 'app/components/atoms/Button';
import { Label } from 'app/components/atoms/Label';
import { Logo } from 'app/components/atoms/Logo';
import { InputRHF } from 'app/components/molecules/Inputs/InputRHF';
import { Modal, type IModalHandle } from 'app/components/molecules/Modal';
import { AuthPageFooter } from 'app/components/molecules/AuthPageFooter';
import { ROUTES } from 'app/constants/route';
import { loginSchema, type ILoginFormValues } from 'app/utils/auth';

interface IAnonymousConfirmModalProps {
  onConfirm: () => void;
}

const AnonymousConfirmModal = forwardRef<IModalHandle, IAnonymousConfirmModalProps>(
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

interface ILoginFormProps {
  onGuestClick: () => void;
}

function LoginForm({ onGuestClick }: ILoginFormProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const methods = useForm<ILoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { userId: '', password: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (values: ILoginFormValues) => {
      setServerError('');
      try {
        const data = await apiLogin(values.userId, values.password);
        dispatch(
          setAuth({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          }),
        );
        navigate(ROUTES.MONTH, { replace: true });
      } catch (err) {
        setServerError(err instanceof Error ? err.message : 'Login failed');
      }
    },
    [dispatch, navigate],
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-4 p-6'>
        <InputRHF name='userId' label='User ID' autoComplete='username' autoFocus />
        <div className='flex flex-col gap-1'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='password'>Password</Label>
            <button type='button' className='text-label-sm text-primary hover:underline'>
              Forgot?
            </button>
          </div>
          <InputRHF name='password' type='password' autoComplete='current-password' />
        </div>
        {serverError && <p className='text-label-sm text-error'>{serverError}</p>}
        <Button type='submit' variant='primary' disabled={isSubmitting} className='justify-center'>
          {isSubmitting ? 'Signing in…' : 'Login'}
          <ArrowRight size={15} />
        </Button>

        <div className='flex items-center gap-3'>
          <div className='flex-1 h-px bg-outline-variant' />
          <span className='text-label-sm text-on-surface-variant'>OR</span>
          <div className='flex-1 h-px bg-outline-variant' />
        </div>

        <button
          type='button'
          onClick={onGuestClick}
          className='w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors'>
          <span className='font-mono text-sm font-bold tracking-widest'>INCOGNITO</span>
          <span className='text-body-sm'>Join Anonymously</span>
        </button>

        <p className='text-center text-body-sm text-on-surface-variant'>
          New to the system?{' '}
          <a href={ROUTES.REGISTER} className='text-primary font-medium hover:underline'>
            Register New Account
          </a>
        </p>
      </form>
    </FormProvider>
  );
}

export function LoginPage() {
  const { user, isAnonymous } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const anonModalRef = useRef<IModalHandle>(null);

  if (user || isAnonymous) return <Navigate to={ROUTES.MONTH} replace />;

  const handleAnonymousConfirm = () => {
    dispatch(setAnonymous());
    navigate(ROUTES.MONTH, { replace: true });
  };

  return (
    <>
      <AnonymousConfirmModal ref={anonModalRef} onConfirm={handleAnonymousConfirm} />
      <div className='min-h-screen bg-background flex flex-col items-center justify-center p-4'>
        <div className='w-full max-w-96 flex flex-col gap-8'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <Logo />
            <p className='text-body-md text-on-surface-variant'>
              Chronos System productivity suite. Sign in
              <br />
              to manage your time and tasks.
            </p>
          </div>

          <div className='bg-surface-container-lowest rounded-2xl shadow-lg overflow-hidden border border-outline-variant'>
            <LoginForm onGuestClick={() => anonModalRef.current?.open()} />
          </div>

          <AuthPageFooter />
        </div>
      </div>
    </>
  );
}
