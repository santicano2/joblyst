/**
 * Hook para obtener el usuario actual
 * Obtiene la sesión actual de Appwrite
 */

import { useEffect, useState } from "react";
import { account } from "@/services/appwrite";
import { User } from "@/types/auth";

export function useAuth() {
  const [user, setUser] = useState<(User & { $id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const session = await account.get();
        setUser({
          id: session.$id,
          $id: session.$id,
          email: session.email,
          name: session.name,
          emailVerification: session.emailVerification,
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  return { user, loading };
}
