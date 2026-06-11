import { useCallback, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiRegister } from 'app/services/api';
import { ButtonRHF } from 'app/components/molecules/Buttons/ButtonRHF';
import { Form } from 'app/components/molecules/Form';
import { InputRHF } from 'app/components/molecules/Inputs/InputRHF';
import { ROUTES } from 'app/constants/route';
import { registerSchema, type IRegisterFormValues } from 'app/utils/auth';

export function RegisterForm() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const onSubmit = useCallback(
    async (values: IRegisterFormValues) => {
      setServerError('');
      try {
        await apiRegister(values.userId, values.password, values.name);
        navigate(ROUTES.LOGIN, { replace: true });
      } catch (err) {
        setServerError(err instanceof Error ? err.message : 'Registration failed');
      }
    },
    [navigate],
  );

  return (
    <Form<IRegisterFormValues>
      schema={registerSchema}
      defaultValues={{ name: '', userId: '', password: '' }}
      onSubmit={onSubmit}
      className='flex flex-col gap-4 p-6'>
      <InputRHF name='name' label='Display Name' autoComplete='name' autoFocus />
      <InputRHF name='userId' label='User ID' autoComplete='username' />
      <InputRHF name='password' label='Password' type='password' autoComplete='new-password' />
      {serverError && <p className='text-label-sm text-error'>{serverError}</p>}
      <ButtonRHF
        type='submit'
        variant='primary'
        render={({ isSubmitting }) => (
          <>
            <UserPlus size={15} />
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </>
        )}
      />
      <p className='text-center text-body-sm text-on-surface-variant'>
        Already have an account?{' '}
        <a href={ROUTES.LOGIN} className='text-primary font-medium hover:underline'>
          Sign In
        </a>
      </p>
    </Form>
  );
}
