import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
    id: string;
    email: string;
    avatar_url: string;
    name: string;
}

interface AuthState {
    token: string;
    user: User;
}

interface SingInCredentials {
    email: string;
    password: string;
}
interface AuthContextData {
    user: User;
    singIn(credentials: SingInCredentials): Promise<void>;
    singOut(): void;
    updateUser(data: User): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {

    const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem('@GoBarber:token');
        const user = localStorage.getItem('@GoBarber:user');

        if (token && user) {
            api.defaults.headers.authorization = `Bearer ${token}`;

            return { token, user: JSON.parse(user) }
        }


        return {} as AuthState;
    });

    const singIn = useCallback(async ({ email, password }) => {
        const response = await api.post('sessions', {
            email, password
        });

        const { user, token } = response.data;

        localStorage.setItem('@GoBarber:token', token);
        localStorage.setItem('@GoBarber:user', JSON.stringify(user));

        const a = api.defaults.headers.authorization = `Bearer ${token}`;
        console.log(a);
        
        setData({ token, user });

    }, []);

    const singOut = useCallback(() => {
        localStorage.removeItem('@GoBarber:token');
        localStorage.removeItem('@GoBarber:user');


        setData({} as AuthState);
    }, []);

    const updateUser = useCallback(async(user: User) => {

        localStorage.setItem('@GoBarber:user', JSON.stringify(user));

        
        setData({
            token: data.token,
            user
        })
    } , [setData, data.token]);


    return (
        <AuthContext.Provider value={{ user: data.user, singIn, singOut, updateUser }}>
            {children}
        </AuthContext.Provider>
    )

}

export function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');

    }

    return context;
}

