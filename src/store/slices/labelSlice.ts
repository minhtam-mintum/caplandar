import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { apiGetLabels, apiCreateLabel } from 'app/services/api';
import { setAuth, logout, setAnonymous } from './authSlice';

export interface ILabel {
  color: string;
  name: string;
  value: string;
}

interface ILabelState {
  items: ILabel[];
  loading: boolean;
  fetched: boolean;
}

type AuthSliceState = { user: { _id: string } | null; isAnonymous: boolean };

export const fetchLabelsThunk = createAsyncThunk<
  ILabel[],
  void,
  { state: { auth: AuthSliceState; labels: ILabelState } }
>(
  'labels/fetch',
  async () => {
    const apiLabels = await apiGetLabels();
    return apiLabels.map((l) => ({ value: l._id, name: l.name, color: l.color }));
  },
  {
    condition: (_, { getState }) => {
      const { auth, labels } = getState();
      if (!auth.user || auth.isAnonymous) return false;
      return !labels.fetched && !labels.loading;
    },
  },
);

export const addLabelThunk = createAsyncThunk<
  ILabel,
  ILabel,
  { state: { auth: AuthSliceState } }
>('labels/add', async (label, { getState }) => {
  const { auth } = getState();
  if (!auth.user || auth.isAnonymous) return { ...label, value: crypto.randomUUID() };
  const created = await apiCreateLabel({ name: label.name, color: label.color });
  return { value: created._id, name: created.name, color: created.color };
});

const initialState: ILabelState = {
  items: [],
  loading: false,
  fetched: false,
};

const labelSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    setLabels: (state, action: PayloadAction<ILabel[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setAuth, (state) => {
        state.items = [];
        state.fetched = false;
        state.loading = false;
      })
      .addCase(logout, (state) => {
        state.items = [];
        state.fetched = false;
        state.loading = false;
      })
      .addCase(setAnonymous, (state) => {
        state.items = [];
        state.fetched = false;
        state.loading = false;
      })
      .addCase(fetchLabelsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLabelsThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.fetched = true;
        state.loading = false;
      })
      .addCase(fetchLabelsThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addLabelThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const { setLabels } = labelSlice.actions;
export default labelSlice.reducer;
