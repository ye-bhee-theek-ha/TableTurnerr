"use client";

import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store, AppDispatch } from "../store/store";
import { getRestaurantData } from "../slices/restaurantSlice";

const ReduxInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  console.log("Dispatching getRestaurantData action inside ReduxInitializer");
  useEffect(() => {
    dispatch(getRestaurantData());
  }, [dispatch]);

  return <>{children}</>;
};

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
  <Provider store={store}>
    <ReduxInitializer>
      {children}
    </ReduxInitializer>
  </Provider>
  )
  
}