import React, { createContext } from 'react';

type LoadingState = {
  loading: boolean;
};

type LoadingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_LOADING' };

type LoadingContextType = {
  loadingState: LoadingState;
  dispatch: React.Dispatch<LoadingAction>;
};

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

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