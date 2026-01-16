"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import api from "@/lib/api";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState(Cookies.get("token"));

    const login = (newToken: string) => {
        Cookies.set("token", newToken, { expires: 7 });
        setToken(newToken);
    }

    const logout = () => {
        Cookies.remove("token");
        setToken(undefined);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ token, login, logout, user}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);