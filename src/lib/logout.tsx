"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "./auth-client";

export default function Logout() {
  return (
    <Button
      onClick={() => {
        authClient.signOut();
      }}
    >
      Sign out
    </Button>
  );
}
