import DashboardClient from "@/components/dashboard/DashboardClient";
import { Suspense } from "react";

/**
 * DashboardPage Component
 *
 * Uses Clerk for authentication and custom API client for data fetching.
 */
export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardClient />
    </Suspense>
  );
}
