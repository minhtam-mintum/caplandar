import { useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserPlus } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { apiLogin, apiRegister } from 'app/services/api';
import { useAppDispatch, useAppSelector } from 'app/store';
import { setAuth } from 'app/store/slices/authSlice';
import { Button } from 'app/components/atoms/Button';
import { Logo } from 'app/components/atoms/Logo';
import { InputRHF } from 'app/components/molecules/Inputs/InputRHF';
import { AuthPageFooter } from 'app/components/molecules/AuthPageFooter';
import { ROUTES } from 'app/constants/route';
import { registerSchema, type IRegisterFormValues } from 'app/utils/auth';

function RegisterForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const methods = useForm<IRegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: { name: '', userId: '', password: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (values: IRegisterFormValues) => {
      setServerError('');
      try {
        await apiRegister(values.userId, values.password, values.name);
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
        setServerError(err instanceof Error ? err.message : 'Registration failed');
      }
    },
    [dispatch, navigate],
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-4 p-6'>
        <InputRHF name='name' label='Display Name' autoComplete='name' autoFocus />
        <InputRHF name='userId' label='User ID' autoComplete='username' />
        <InputRHF name='password' label='Password' type='password' autoComplete='new-password' />
        {serverError && <p className='text-label-sm text-error'>{serverError}</p>}
        <Button type='submit' variant='primary' disabled={isSubmitting} className='mt-1'>
          <UserPlus size={15} />
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </Button>
        <p className='text-center text-body-sm text-on-surface-variant'>
          Already have an account?{' '}
          <a href={ROUTES.LOGIN} className='text-primary font-medium hover:underline'>
            Sign In
          </a>
        </p>
      </form>
    </FormProvider>
  );
}

export function RegisterPage() {
  const { user, isAnonymous } = useAppSelector((s) => s.auth);

  if (user || isAnonymous) return <Navigate to={ROUTES.MONTH} replace />;

  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-center p-4'>
      <div className='w-full max-w-96 flex flex-col gap-8'>
        <div className='flex flex-col items-center gap-2 text-center'>
          <Logo />
          <p className='text-body-md text-on-surface-variant'>
            Create your account to start managing
            <br />
            your time and tasks.
          </p>
        </div>

        <div className='bg-surface-container-lowest rounded-2xl shadow-lg overflow-hidden border border-outline-variant'>
          <RegisterForm />
        </div>

        <AuthPageFooter />
      </div>
    </div>
  );
}
