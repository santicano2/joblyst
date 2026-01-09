/**
 * Servicio de postulaciones laborales
 * CRUD completo para aplicaciones en Appwrite
 */

import { databases } from "./appwrite";
import {
  Application,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "@/types/applications";
import { APPWRITE_CONSTANTS } from "./appwrite";
import { Query } from "appwrite";

export async function createApplication(
  userId: string,
  data: CreateApplicationInput
): Promise<Application> {
  try {
    const response = await databases.createDocument(
      APPWRITE_CONSTANTS.databaseId,
      APPWRITE_CONSTANTS.applicationCollectionId,
      "unique()",
      {
        userId,
        ...data,
        responseReceived: data.responseReceived ?? false,
        tags: data.tags ?? [],
      }
    );

    return response as unknown as Application;
  } catch (error) {
    throw new Error(
      `Error al crear postulación: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}

export async function getApplications(userId: string): Promise<Application[]> {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONSTANTS.databaseId,
      APPWRITE_CONSTANTS.applicationCollectionId,
      [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
    );

    return response.documents as unknown as Application[];
  } catch (error) {
    throw new Error(
      `Error al obtener postulaciones: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}

export async function getApplicationById(
  applicationId: string
): Promise<Application> {
  try {
    const response = await databases.getDocument(
      APPWRITE_CONSTANTS.databaseId,
      APPWRITE_CONSTANTS.applicationCollectionId,
      applicationId
    );

    return response as unknown as Application;
  } catch (error) {
    throw new Error(
      `Error al obtener postulación: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}

export async function updateApplication(
  data: UpdateApplicationInput
): Promise<Application> {
  try {
    const { $id, ...updateData } = data;

    const response = await databases.updateDocument(
      APPWRITE_CONSTANTS.databaseId,
      APPWRITE_CONSTANTS.applicationCollectionId,
      $id,
      updateData
    );

    return response as unknown as Application;
  } catch (error) {
    throw new Error(
      `Error al actualizar postulación: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}

export async function deleteApplication(applicationId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      APPWRITE_CONSTANTS.databaseId,
      APPWRITE_CONSTANTS.applicationCollectionId,
      applicationId
    );
  } catch (error) {
    throw new Error(
      `Error al eliminar postulación: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}

export async function getApplicationsByStatus(
  userId: string,
  status: string
): Promise<Application[]> {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONSTANTS.databaseId,
      APPWRITE_CONSTANTS.applicationCollectionId,
      [
        Query.equal("userId", userId),
        Query.equal("status", status),
        Query.orderDesc("$createdAt"),
      ]
    );

    return response.documents as unknown as Application[];
  } catch (error) {
    throw new Error(
      `Error al obtener postulaciones por estado: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
}
