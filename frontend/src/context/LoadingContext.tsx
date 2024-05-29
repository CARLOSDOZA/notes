import React, { createContext } from 'react';

// Define el tipo para el estado de carga
type LoadingState = {
  loading: boolean;
};

// Define el tipo para las acciones del reductor
type LoadingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_LOADING' };

// Define el tipo para el contexto de carga
type LoadingContextType = {
  loadingState: LoadingState;
  dispatch: React.Dispatch<LoadingAction>;
};

// Crea el contexto de carga
export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Define el reductor para manejar el estado de carga
export const loadingReducer = (state: LoadingState, action: LoadingAction): LoadingState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'RESET_LOADING':
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};