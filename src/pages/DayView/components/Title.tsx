import { forwardRef, useImperativeHandle, useState } from 'react';
import { formatFullDate, getDayTitle } from 'app/utils/day';
import type { ITitleDayPageHandle, ITitleDayPageProps } from 'app/pages/DayView/types';

export const TitleDayPage = forwardRef<ITitleDayPageHandle, ITitleDayPageProps>(
  function TitleDayPage({ defaultDate }, ref) {
    const [date, setDate] = useState(defaultDate);

    useImperativeHandle(ref, () => ({ setDate }), []);

    return (
      <div>
        <h2 className='text-headline-xl text-on-surface'>{getDayTitle(date)}</h2>
        <p className='text-body-lg text-on-surface-variant'>{formatFullDate(date)}</p>
      </div>
    );
  },
);
