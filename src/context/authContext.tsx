"use client";

/**
 * Contexto de autenticación
 * Proporciona estado global del usuario y métodos de auth
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, User } from "@/types/auth";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  loginWithGoogle,
} from "@/services/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar sesión al montar componente
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error checking session");
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      setError(null);
      const loggedUser = await loginUser(email, password);
      setUser(loggedUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    }
  }

  async function register(email: string, password: string, name: string) {
    try {
      setError(null);
      const newUser = await registerUser(email, password, name);
      setUser(newUser);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      throw err;
    }
  }

  async function loginWithGoogleOAuth(sessionToken: string) {
    try {
      setError(null);
      // Redirigir a OAuth de Google en Appwrite
      await loginWithGoogle();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Google login failed";
      setError(errorMessage);
      throw err;
    }
  }

  async function logout() {
    try {
      setError(null);
      await logoutUser();
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      throw err;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        loginWithGoogle: loginWithGoogleOAuth,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
