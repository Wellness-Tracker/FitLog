// src/app/store.jsx
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { appReducer, initialState } from "./reducer";
import { loadState, saveState } from "./storage";

const AppStateContext = createContext(null);
const AppDispatchContext = createContext(null);

export function AppProvider({ children }) {
  const persisted = loadState();
  const [state, dispatch] = useReducer(appReducer, persisted || initialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within AppProvider");
  }
  return ctx;
}

export function useAppDispatch() {
  const ctx = useContext(AppDispatchContext);
  if (!ctx) {
    throw new Error("useAppDispatch must be used within AppProvider");
  }
  return ctx;
}