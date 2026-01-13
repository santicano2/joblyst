/**
 * Servicio de Repositorio de CVs
 * Gestión de referencias de CVs en la base de datos
 */

import { databases } from "./appwrite";
import { APPWRITE_CONSTANTS } from "./appwrite";
import { Query } from "appwrite";
import { getCurrentUser } from "./auth";

export interface CV {
  $id: string;
  userId: string;
  fileId: string;
  fileName: string;
  isFavorite: boolean;
  $createdAt: string;
}

/**
 * Crear una referencia de CV en la BD cuando se sube un archivo
 */
export async function createCVReference(
  fileId: string,
  fileName: string
): Promise<CV> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      throw new Error("Usuario no autenticado");
    }

    const response = await databases.createDocument(
      APPWRITE_CONSTANTS.databaseId,
      "cvs", // Collection ID
      "unique()",
      {
        userId: currentUser.id,
        fileId,
        fileName,
        isFavorite: false,
      }
    );

    return response as unknown as CV;
  } catch (error) {
    throw new Error(
      `Error al guardar referencia de CV: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}

/**
 * Obtener todos los CVs del usuario actual
 */
export async function getCVsByUser(): Promise<CV[]> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      throw new Error("Usuario no autenticado");
    }

    const response = await databases.listDocuments(
      APPWRITE_CONSTANTS.databaseId,
      "cvs",
      [Query.equal("userId", currentUser.id), Query.orderDesc("$createdAt")]
    );

    return response.documents as unknown as CV[];
  } catch (error) {
    throw new Error(
      `Error al obtener CVs: ${error instanceof Error ? error.message : error}`
    );
  }
}

/**
 * Obtener el CV favorito del usuario
 */
export async function getFavoriteCV(): Promise<CV | null> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      throw new Error("Usuario no autenticado");
    }

    const response = await databases.listDocuments(
      APPWRITE_CONSTANTS.databaseId,
      "cvs",
      [Query.equal("userId", currentUser.id), Query.equal("isFavorite", true)]
    );

    if (response.documents.length > 0) {
      return response.documents[0] as unknown as CV;
    }

    return null;
  } catch (error) {
    throw new Error(
      `Error al obtener CV favorito: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}

/**
 * Marcar un CV como favorito y desmarcar los demás
 */
export async function setFavoriteCV(cvId: string): Promise<CV> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      throw new Error("Usuario no autenticado");
    }

    // Obtener todos los CVs del usuario
    const cvs = await getCVsByUser();

    // Desmarcar todos como favoritos
    for (const cv of cvs) {
      if (cv.isFavorite) {
        await databases.updateDocument(
          APPWRITE_CONSTANTS.databaseId,
          "cvs",
          cv.$id,
          { isFavorite: false }
        );
      }
    }

    // Marcar el nuevo como favorito
    const response = await databases.updateDocument(
      APPWRITE_CONSTANTS.databaseId,
      "cvs",
      cvId,
      { isFavorite: true }
    );

    return response as unknown as CV;
  } catch (error) {
    throw new Error(
      `Error al marcar CV favorito: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}

/**
 * Eliminar un CV (tanto la referencia como el archivo)
 */
export async function deleteCV(cvId: string, fileId: string): Promise<void> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      throw new Error("Usuario no autenticado");
    }

    // Eliminar referencia de BD
    await databases.deleteDocument(APPWRITE_CONSTANTS.databaseId, "cvs", cvId);

    // Eliminar archivo de Storage
    const { storage } = await import("./appwrite");
    await storage.deleteFile(APPWRITE_CONSTANTS.cvsBucketId, fileId);
  } catch (error) {
    throw new Error(
      `Error al eliminar CV: ${error instanceof Error ? error.message : error}`
    );
  }
}

/**
 * Actualizar el nombre de un CV
 */
export async function updateCVFileName(
  cvId: string,
  newFileName: string
): Promise<CV> {
  try {
    const response = await databases.updateDocument(
      APPWRITE_CONSTANTS.databaseId,
      "cvs",
      cvId,
      { fileName: newFileName }
    );

    return response as unknown as CV;
  } catch (error) {
    throw new Error(
      `Error al actualizar nombre del CV: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}
