import React, { createContext } from 'react';

type AuthState = {
  id: number;
  loggedIn: boolean;
  username: string;
  token: string;
  loginError: string;
};

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { id: number; username: string; token: string; isAdmin: boolean } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' };

type AuthContextType = {
  authState: AuthState;
  dispatch: React.Dispatch<AuthAction>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        id: action.payload.id,
        loggedIn: true,
        username: action.payload.username,
        token: action.payload.token,
        loginError: ''
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loginError: 'Error: Usuario o contraseña incorrectos'
      };
    case 'LOGOUT':
      return {
        ...state,
        id: 0,
        loggedIn: false,
        username: '',
        token: '',
        loginError: ''
      };
    default:
      return state;
  }
};