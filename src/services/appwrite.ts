/**
 * Cliente base de Appwrite
 * Configuración centralizada del SDK
 */

import { Client, Account, Databases, Storage, OAuthProvider } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { OAuthProvider };

export const APPWRITE_CONSTANTS = {
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
  applicationCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_APPLICATIONS_COLLECTION_ID || "",
};

export default client;
