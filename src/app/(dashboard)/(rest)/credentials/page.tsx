import { requireAuth } from "@/lib/auth-utils";
import React from "react";

async function Credentials() {
  await requireAuth();
  return <div>Credentials</div>;
}

export default Credentials;
