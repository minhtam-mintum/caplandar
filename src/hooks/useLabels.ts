import { useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from 'app/store';
import { fetchLabelsThunk, addLabelThunk } from 'app/store/slices/labelSlice';

export type { ILabel } from 'app/store/slices/labelSlice';

export function useLabels() {
  const dispatch = useAppDispatch();
  const labels = useAppSelector((s) => s.labels.items);
  const isLoading = useAppSelector((s) => s.labels.loading);

  useEffect(() => {
    dispatch(fetchLabelsThunk());
  }, [dispatch]);

  const addLabel = useCallback(
    async (label: Parameters<typeof addLabelThunk>[0]) => {
      const result = await dispatch(addLabelThunk(label));
      return addLabelThunk.fulfilled.match(result) ? result.payload : label;
    },
    [dispatch],
  );

  return { labels, addLabel, isLoading };
}
