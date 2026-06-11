import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from 'app/store';
import { apiGetLabels, apiCreateLabel } from 'app/services/api';

export interface ILabel {
  color: string;
  name: string;
  value: string;
}

export function useLabels() {
  const user = useAppSelector((s) => s.auth.user);
  const isAnonymous = useAppSelector((s) => s.auth.isAnonymous);
  const isAuthenticated = !!user && !isAnonymous;

  const [labels, setLabels] = useState<ILabel[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLabels([]);
      return;
    }
    apiGetLabels()
      .then((apiLabels) =>
        setLabels(apiLabels.map((l) => ({ value: l._id, name: l.name, color: l.color }))),
      )
      .catch(() => setLabels([]));
  }, [isAuthenticated]);

  const addLabel = useCallback(
    async (label: ILabel): Promise<ILabel> => {
      if (!isAuthenticated) {
        setLabels((prev) => [...prev, label]);
        return label;
      }
      const created = await apiCreateLabel({ name: label.name, color: label.color });
      const newLabel: ILabel = { value: created._id, name: created.name, color: created.color };
      setLabels((prev) => [...prev, newLabel]);
      return newLabel;
    },
    [isAuthenticated],
  );

  return { labels, addLabel };
}
