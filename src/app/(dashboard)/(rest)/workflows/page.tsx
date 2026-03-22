import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";

import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import {
  WorkflowsContainer,
  WorkflowsList,
} from "@/features/workflows/components/workflows";
import type { SearchParams } from "nuqs/server";
import { workflowParamsLoader } from "@/features/workflows/server/params-loader";
type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Workflows({ searchParams }: PageProps) {
  await requireAuth();
  const params = await workflowParamsLoader(searchParams);
  prefetchWorkflows(params);
  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
          <Suspense fallback={<p>Loading...</p>}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
}
