/**
 * Servicio para tareas cron automáticas
 * Obtiene datos de múltiples usuarios para enviar emails automáticos
 */

import { databases } from "./appwrite";
import { Application } from "@/types/applications";
import { APPWRITE_CONSTANTS } from "./appwrite";
import { Query } from "appwrite";

/**
 * Obtiene todas las aplicaciones, agrupadas por usuario y email
 */
export async function getAllApplicationsByUserEmail(): Promise<
  Map<
    string,
    { userId: string; userEmail: string; applications: Application[] }
  >
> {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONSTANTS.databaseId,
      APPWRITE_CONSTANTS.applicationCollectionId,
      [Query.limit(1000)] // Ajustar según necesidad
    );

    // Agrupar por email
    const grouped = new Map<
      string,
      { userId: string; userEmail: string; applications: Application[] }
    >();

    for (const doc of response.documents) {
      const app = doc as unknown as Application;
      const email = app.userEmail;

      if (!email) continue; // Saltar si no tiene email

      if (!grouped.has(email)) {
        grouped.set(email, {
          userId: app.userId,
          userEmail: email,
          applications: [],
        });
      }

      grouped.get(email)!.applications.push(app);
    }

    return grouped;
  } catch (error) {
    console.error("Error obteniendo aplicaciones:", error);
    return new Map();
  }
}

/**
 * Obtiene aplicaciones de un usuario específico
 */
export async function getApplicationsByUserEmail(
  userEmail: string
): Promise<Application[]> {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONSTANTS.databaseId,
      APPWRITE_CONSTANTS.applicationCollectionId,
      [Query.equal("userEmail", userEmail), Query.orderDesc("$createdAt")]
    );

    return response.documents as unknown as Application[];
  } catch (error) {
    console.error("Error obteniendo aplicaciones del usuario:", error);
    return [];
  }
}
