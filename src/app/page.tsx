import { authClient } from "@/lib/auth-client";
import { requireAuth } from "@/lib/auth-utils";
import Logout from "@/lib/logout";
import { caller } from "@/trpc/server";
import { Button } from "@base-ui/react";

export default async function Home() {
  // await requireAuth();
  const data = await caller.getUsers();
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      protected route{JSON.stringify(data, null, 2)}
      <Logout />
    </div>
  );
}
