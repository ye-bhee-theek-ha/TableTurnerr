import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import userReducer from '../slices/userSlice';
import RestauranReducer  from '../slices/restaurantSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    restaurant: RestauranReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/registerUser/fulfilled', 'auth/loginUser/fulfilled', 'auth/fetchCurrentUser/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload', 'meta.arg'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;