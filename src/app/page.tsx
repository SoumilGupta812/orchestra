// import { caller } from "@/trpc/server";
// "use client";
import { useTRPC } from "@/trpc/client";
import { Button } from "@base-ui/react";
import { useQuery } from "@tanstack/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { Client } from "./client";
import { Suspense } from "react";
export default function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}>
          <Client />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
