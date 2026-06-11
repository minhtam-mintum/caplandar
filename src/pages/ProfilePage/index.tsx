import UserInfoCard from './components/UserInfoCard';
import LabelsTable from './components/LabelsTable';

export function ProfilePage() {
  return (
    <div className='max-w-360 mx-auto px-margin py-8'>
      <h1 className='text-headline-sm text-on-surface mb-6'>Profile</h1>
      <div className='flex flex-col gap-6 max-w-2xl'>
        <UserInfoCard />
        <LabelsTable />
      </div>
    </div>
  );
}
