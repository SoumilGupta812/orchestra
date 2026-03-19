import { requireAuth } from "@/lib/auth-utils";
import React from "react";

async function Executions() {
  await requireAuth();
  return <div>Executions</div>;
}

export default Executions;
