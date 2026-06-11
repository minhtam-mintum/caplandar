import { useCallback } from 'react';
import { useAppDispatch } from 'app/store';
import { fetchEventsThunk } from 'app/store/slices/eventSlice';

export function useFetchForYear() {
  const dispatch = useAppDispatch();
  return useCallback(
    (year: number) => {
      dispatch(fetchEventsThunk({ from: `${year}-01-01`, to: `${year}-12-31` }));
    },
    [dispatch],
  );
}
