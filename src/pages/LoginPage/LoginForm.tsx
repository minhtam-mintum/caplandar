import { useCallback, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiLogin } from 'app/services/api';
import { useAppDispatch } from 'app/store';
import { setAuth } from 'app/store/slices/authSlice';
import { Label } from 'app/components/atoms/Label';
import { ButtonRHF } from 'app/components/molecules/Buttons/ButtonRHF';
import { GuestButton } from 'app/components/molecules/Buttons/GuestButton';
import { Form } from 'app/components/molecules/Form';
import { InputRHF } from 'app/components/molecules/Inputs/InputRHF';
import { ROUTES } from 'app/constants/route';
import { loginSchema, type ILoginFormValues } from 'app/utils/auth';

interface ILoginFormProps {
  onGuestClick: () => void;
}

export function LoginForm({ onGuestClick }: ILoginFormProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

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
    <Form<ILoginFormValues>
      schema={loginSchema}
      defaultValues={{ userId: '', password: '' }}
      onSubmit={onSubmit}
      className='flex flex-col gap-4 p-6'>
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
      <ButtonRHF
        type='submit'
        variant='primary'
        className='justify-center'
        render={({ isSubmitting }) => (
          <>
            {isSubmitting ? 'Signing in…' : 'Login'}
            <ArrowRight size={15} />
          </>
        )}
      />

      <div className='flex items-center gap-3'>
        <div className='flex-1 h-px bg-outline-variant' />
        <span className='text-label-sm text-on-surface-variant'>OR</span>
        <div className='flex-1 h-px bg-outline-variant' />
      </div>

      <GuestButton onClick={onGuestClick} />

      <p className='text-center text-body-sm text-on-surface-variant'>
        New to the system?{' '}
        <a href={ROUTES.REGISTER} className='text-primary font-medium hover:underline'>
          Register New Account
        </a>
      </p>
    </Form>
  );
}
