import { ReactNode, useContext, useReducer } from "react";
import { loadingReducer, LoadingContext } from "./LoadingContext";

type LoadingProviderProps = {
    children: ReactNode;
};

// Define el proveedor de contexto de autenticación
export const LoadingProvider = ({ children }: LoadingProviderProps) => {
    const [loadingState, dispatch] = useReducer(loadingReducer, {
        loading: false,
      });

    return (
        <LoadingContext.Provider value={{ loadingState, dispatch }}>
            {children}
        </LoadingContext.Provider>
    );
};

// Define un hook personalizado para acceder al contexto de autenticación
export const useAuth = () => useContext(LoadingContext);