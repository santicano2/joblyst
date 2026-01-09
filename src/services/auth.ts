/**
 * Servicio de autenticación con Appwrite
 * Maneja login, registro y OAuth de Google
 */

import { account, OAuthProvider } from "./appwrite";
import { User } from "@/types/auth";

export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<User> {
  try {
    // Crear cuenta
    const newAccount = await account.create("unique()", email, password, name);

    // Crear sesión automáticamente con email/contraseña
    await account.createEmailPasswordSession(email, password);

    return {
      id: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      emailVerification: newAccount.emailVerification,
    };
  } catch (error) {
    throw new Error(`Registro fallido: ${error}`);
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    const user = await account.get();

    return {
      id: user.$id,
      email: user.email,
      name: user.name,
      emailVerification: user.emailVerification,
    };
  } catch (error) {
    throw new Error(`Login fallido: ${error}`);
  }
}

export async function loginWithGoogle(
  successUrl: string,
  failureUrl: string
): Promise<void> {
  try {
    await account.createOAuth2Session(
      OAuthProvider.Google,
      successUrl,
      failureUrl
    );
  } catch (error) {
    throw new Error(`OAuth Google fallido: ${error}`);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await account.get();
    return {
      id: user.$id,
      email: user.email,
      name: user.name,
      emailVerification: user.emailVerification,
    };
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await account.deleteSession("current");
  } catch (error) {
    throw new Error(`Logout fallido: ${error}`);
  }
}
