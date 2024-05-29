import { ReactNode, useContext, useReducer } from "react";
import { AuthContext, authReducer } from "./AuthContext"

type AuthProviderProps = {
    children: ReactNode;
};

// Define el proveedor de contexto de autenticación
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [authState, dispatch] = useReducer(authReducer, {
        loggedIn: false,
        id: 0,
        username: '',
        token: '',
        loginError: ''
    });

    return (
        <AuthContext.Provider value={{ authState, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

// Define un hook personalizado para acceder al contexto de autenticación
export const useAuth = () => useContext(AuthContext);