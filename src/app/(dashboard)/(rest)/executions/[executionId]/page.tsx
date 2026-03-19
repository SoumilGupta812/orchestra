import { requireAuth } from "@/lib/auth-utils";
import React from "react";
interface PageProps {
  params: Promise<{
    executionId: string;
  }>;
}
async function ExecutionPage({ params }: PageProps) {
  await requireAuth();
  const { executionId } = await params;
  return <div>Execution ID:{executionId}</div>;
}

export default ExecutionPage;
