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
    initializeAuth();
  }, []);

  async function initializeAuth() {
    try {
      setLoading(true);

      // Primero intentar obtener usuario desde Appwrite (que usa cookies automáticas)
      const currentUser = await getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
        setError(null);
        // Guardar en localStorage como fallback
        localStorage.setItem("authUser", JSON.stringify(currentUser));
      } else {
        // Si no hay sesión en Appwrite, limpiar localStorage
        localStorage.removeItem("authUser");
        setUser(null);
      }
    } catch (err) {
      // No es un error crítico si no hay sesión
      setUser(null);
      localStorage.removeItem("authUser");
    } finally {
      setLoading(false);
    }
  }

  // Escuchar cambios de visibilidad y focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Cuando la pestaña regresa al foco, verificar sesión
        checkSession();
      }
    };

    const handleFocus = () => {
      // Verificar sesión cuando la ventana recupera el foco
      checkSession();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  async function checkSession() {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setError(null);
        localStorage.setItem("authUser", JSON.stringify(currentUser));
      } else {
        setUser(null);
        localStorage.removeItem("authUser");
      }
    } catch (err) {
      // Silenciosamente manejar errores de verificación de sesión
      setUser(null);
      localStorage.removeItem("authUser");
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
