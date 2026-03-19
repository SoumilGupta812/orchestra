import { requireAuth } from "@/lib/auth-utils";
import React from "react";

export default async function Workflows() {
  await requireAuth();
  return <div>Workflows</div>;
}
