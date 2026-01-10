/**
 * Servicio de Storage (CVs)
 * Gestión de carga, descarga y eliminación de archivos
 */

import { storage, APPWRITE_CONSTANTS } from "./appwrite";
import { ID } from "appwrite";

export interface CVFile {
  $id: string;
  name: string;
  sizeOriginal: number;
  uploadedAt: string;
}

/**
 * Subir un nuevo CV
 * @param file - Archivo PDF/DOC
 * @param fileName - Nombre del archivo (ej: "Mi_CV_2025.pdf")
 * @returns ID del archivo subido
 */
export async function uploadCV(file: File, fileName: string): Promise<string> {
  try {
    // Validar tipo de archivo
    const validTypes = ["application/pdf", "application/msword"];
    if (!validTypes.includes(file.type)) {
      throw new Error(
        "Solo se permiten archivos PDF y DOC. Tamaño máximo: 10MB"
      );
    }

    // Validar tamaño (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("El archivo es demasiado grande. Máximo: 10MB");
    }

    const response = await storage.createFile(
      APPWRITE_CONSTANTS.cvsBucketId,
      ID.unique(),
      file
    );

    return response.$id;
  } catch (error) {
    throw new Error(
      `Error al subir CV: ${error instanceof Error ? error.message : error}`
    );
  }
}

/**
 * Obtener lista de CVs del usuario
 * Nota: En Appwrite, los archivos no tienen metadata de usuario integrada,
 * así que almacenaremos la referencia en la Application
 */
export async function getDownloadURL(fileId: string): Promise<string> {
  try {
    return storage.getFileDownload(APPWRITE_CONSTANTS.cvsBucketId, fileId);
  } catch (error) {
    throw new Error(
      `Error al obtener URL de descarga: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}

/**
 * Obtener lista de todos los CVs (admin-like, para demostración)
 * En prod, esto debería estar en backend con verificación de auth
 */
export async function getAllCVs(): Promise<any[]> {
  try {
    const response = await storage.listFiles(APPWRITE_CONSTANTS.cvsBucketId);
    return response.files || [];
  } catch (error) {
    throw new Error(
      `Error al obtener lista de CVs: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}

/**
 * Obtener vista previa (solo para PDFs)
 */
export async function getPreviewURL(fileId: string): Promise<string> {
  try {
    return storage.getFilePreview(
      APPWRITE_CONSTANTS.cvsBucketId,
      fileId,
      640, // width
      480, // height
      "top" as any, // gravity
      100
    );
  } catch (error) {
    throw new Error(
      `Error al obtener preview: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}

/**
 * Obtener metadata del archivo
 */
export async function getFileInfo(fileId: string) {
  try {
    return await storage.getFile(APPWRITE_CONSTANTS.cvsBucketId, fileId);
  } catch (error) {
    throw new Error(
      `Error al obtener información del archivo: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}

/**
 * Eliminar CV
 */
export async function deleteCV(fileId: string): Promise<void> {
  try {
    await storage.deleteFile(APPWRITE_CONSTANTS.cvsBucketId, fileId);
  } catch (error) {
    throw new Error(
      `Error al eliminar CV: ${error instanceof Error ? error.message : error}`
    );
  }
}
