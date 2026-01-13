"use client";

import Link from "next/link";
import { useAuth } from "@/context/authContext";

export default function Home() {
  const { user, loading } = useAuth();

  // Mostrar loading mientras se verifica la sesión
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Joblyst
        </div>
        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-slate-700 dark:text-slate-300">
                Hola, {user.name}
              </span>
              <Link
                href="/applications"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Postulaciones
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                Ingresar
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
          Controla tu búsqueda de empleo
        </h1>

        <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 max-w-2xl">
          Registra postulaciones, analiza tu progreso y optimiza tu estrategia
          de búsqueda con estadísticas en tiempo real.
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 w-full my-16">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold mb-2">Gestión Simple</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Registra postulaciones con todos los detalles en un lugar
              centralizado.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Estadísticas</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Visualiza gráficos de tus postulaciones y analiza patrones de
              éxito.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">Seguro</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Tus datos están protegidos con autenticación segura y
              encriptación.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={user ? "/dashboard" : "/register"}
          className="px-8 py-4 text-lg rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
        >
          {user ? "Ir a mis postulaciones →" : "Comenzar ahora →"}
        </Link>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-600 dark:text-slate-400">
        <p>&copy; 2025 Joblyst. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
