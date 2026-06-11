import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'app/store';
import { updateUser } from 'app/store/slices/authSlice';
import { apiUpdateMe } from 'app/services/api';
import { Avatar } from 'app/components/atoms/Avatar';
import { EditableField } from './EditableField';
import { getInitials } from './utils';

export default function UserInfoCard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const handleSaveName = useCallback(
    async (name: string) => {
      const updated = await apiUpdateMe({ name });
      dispatch(updateUser(updated));
    },
    [dispatch],
  );

  const handleSaveEmail = useCallback(
    async (email: string) => {
      const updated = await apiUpdateMe({ email });
      dispatch(updateUser(updated));
    },
    [dispatch],
  );

  if (!user) return null;

  return (
    <div className='bg-surface-container-lowest border border-outline-variant rounded-2xl p-6'>
      <div className='flex items-start gap-5'>
        <Avatar initials={getInitials(user.name)} size={64} />
        <div className='flex flex-col gap-4 flex-1'>
          <EditableField label='Name' value={user.name} onSave={handleSaveName} />
          <div className='flex flex-col gap-1'>
            <span className='text-label-sm text-on-surface-variant'>Username</span>
            <span className='text-body-md text-on-surface-variant'>@{user.userId}</span>
          </div>
          <EditableField
            label='Email'
            value={user.email ?? ''}
            placeholder='Add an email address'
            onSave={handleSaveEmail}
          />
        </div>
      </div>
    </div>
  );
}
