import { ReactNode, useContext, useReducer } from "react";
import { loadingReducer, LoadingContext } from "./LoadingContext";

type LoadingProviderProps = {
    children: ReactNode;
};

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

export const useAuth = () => useContext(LoadingContext);