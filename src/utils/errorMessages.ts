/**
 * Convierte mensajes de error técnicos en mensajes amigables
 */
export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Errores de autenticación
    if (message.includes("unauthorized") || message.includes("401")) {
      return "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
    }

    // Errores de permisos
    if (message.includes("permission") || message.includes("forbidden")) {
      return "No tienes permiso para realizar esta acción.";
    }

    // Errores de validación
    if (message.includes("required") || message.includes("invalid")) {
      return "Por favor, completa todos los campos requeridos correctamente.";
    }

    // Errores de red
    if (message.includes("network") || message.includes("failed to fetch")) {
      return "Error de conexión. Verifica tu conexión a internet.";
    }

    // Errores de timeout
    if (message.includes("timeout")) {
      return "La solicitud tomó demasiado tiempo. Intenta nuevamente.";
    }

    // Errores de duplicados
    if (message.includes("duplicate") || message.includes("already exists")) {
      return "Este registro ya existe. Usa uno diferente.";
    }

    // Si el mensaje es corto y genérico, mejóralo
    if (message.length < 20) {
      return "Algo salió mal. Intenta nuevamente.";
    }

    // Retorna el mensaje original si es descriptivo
    return error.message;
  }

  return "Algo salió mal. Por favor, intenta nuevamente.";
}
