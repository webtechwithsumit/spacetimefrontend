"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { PROPERTY_MANAGER_ROLES } from "@/dashboard/constants/property";

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const canAccess = PROPERTY_MANAGER_ROLES.includes(user?.role ?? "");

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!canAccess) {
      router.replace("/dashboard/auctions");
    }
  }, [isAuthenticated, canAccess, router]);

  if (!isAuthenticated || !canAccess) {
    return null;
  }

  return children;
}
