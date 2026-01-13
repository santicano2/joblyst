"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirige automáticamente a applications
    router.replace("/applications");
  }, [router]);

  return null;
}
