import * as yup from 'yup';

export interface ILoginFormValues {
  userId: string;
  password: string;
}

export interface IRegisterFormValues {
  userId: string;
  password: string;
  name: string;
}

export const loginSchema: yup.ObjectSchema<ILoginFormValues> = yup.object({
  userId: yup.string().required('User ID is required').min(3, 'At least 3 characters'),
  password: yup.string().required('Password is required').min(6, 'At least 6 characters'),
});

export const registerSchema: yup.ObjectSchema<IRegisterFormValues> = yup.object({
  userId: yup
    .string()
    .required('User ID is required')
    .min(3, 'At least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores'),
  password: yup.string().required('Password is required').min(6, 'At least 6 characters'),
  name: yup.string().required('Display name is required').min(2, 'At least 2 characters'),
});
