import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";

import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import {
  WorkflowsLoading,
  WorkflowsContainer,
  WorkflowsList,
  WorkflowsError,
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
        <ErrorBoundary fallback={<WorkflowsError />}>
          <Suspense fallback={<WorkflowsLoading />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
}
