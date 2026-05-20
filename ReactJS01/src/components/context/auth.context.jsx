import { createContext, useState } from 'react';
import { CartContextProvider } from './cart.context';

export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        email: "",
        name: ""
    },
    appLoading: true,
});

export const AuthWrapper = (props) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            email: "",
            name: ""
        }
    });
    const [appLoading, setAppLoading] = useState(true);

    return (
        <AuthContext.Provider value={{
            auth, setAuth, appLoading, setAppLoading
        }}>
            <CartContextProvider>
                {props.children}
            </CartContextProvider>
        </AuthContext.Provider>
    );
};