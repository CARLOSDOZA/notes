import React, { createContext } from 'react';

// Define el tipo para el estado de autenticación
type AuthState = {
  id: number;
  loggedIn: boolean;
  username: string;
  token: string;
  loginError: string;
};

// Define el tipo para las acciones del reductor
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { id: number; username: string; token: string; isAdmin: boolean } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' };

// Define el tipo para el contexto de autenticación
type AuthContextType = {
  authState: AuthState;
  dispatch: React.Dispatch<AuthAction>;
};

// Crea el contexto de autenticación
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define el reductor para manejar el estado de autenticación
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