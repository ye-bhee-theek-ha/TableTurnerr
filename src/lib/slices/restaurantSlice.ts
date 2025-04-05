// src/features/restaurantSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RestaurantInfo } from '@/constants/types';
import { fetchRestaurantData } from '@/lib/firebase/services/appInfo';

const RESTAURANT_ID = process.env.NEXT_PUBLIC_FIREBASE_RESTAURANT_ID;

export const getRestaurantData = createAsyncThunk(
  'restaurant/getData',
  async (_, { rejectWithValue }) => {
    if (!RESTAURANT_ID) {
      console.log("Restaurant ID not configured.");
      return rejectWithValue("Restaurant ID not configured.");
    }
    try {
      console.log("Fetching restaurant data with ID inside slice:", RESTAURANT_ID);
      const data = await fetchRestaurantData(RESTAURANT_ID);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface RestaurantState {
  data: RestaurantInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  data: null,
  loading: false,
  error: null,
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    // Add additional reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRestaurantData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRestaurantData.fulfilled, (state, action: PayloadAction<RestaurantInfo>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getRestaurantData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default restaurantSlice.reducer;
