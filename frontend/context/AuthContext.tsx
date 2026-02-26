"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';
    tokens: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateTokens: (tokens: number) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('ri_token');
        const savedUser = localStorage.getItem('ri_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('ri_token', newToken);
        localStorage.setItem('ri_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('ri_token');
        localStorage.removeItem('ri_user');
    };

    const updateTokens = (newTokens: number) => {
        if (user) {
            const updated = { ...user, tokens: newTokens };
            setUser(updated);
            localStorage.setItem('ri_user', JSON.stringify(updated));
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateTokens, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
