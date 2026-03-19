import { requireAuth } from "@/lib/auth-utils";
import React from "react";
interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}
async function CredentialsPage({ params }: PageProps) {
  await requireAuth();
  const { credentialId } = await params;
  return <div>CredentialsID:{credentialId}</div>;
}

export default CredentialsPage;
