import {
  ExecutionsContainer,
  ExecutionsError,
  ExecutionsList,
  ExecutionsLoading,
} from "@/features/executions/components/executions";
import { executionParamsLoader } from "@/features/executions/server/params-loader";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
type Props = {
  searchParams: Promise<SearchParams>;
};
async function Page({ searchParams }: Props) {
  await requireAuth();
  const params = await executionParamsLoader(searchParams);
  prefetchExecutions(params);
  return (
    <ExecutionsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<ExecutionsError></ExecutionsError>}>
          <Suspense fallback={<ExecutionsLoading></ExecutionsLoading>}>
            <ExecutionsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </ExecutionsContainer>
  );
}

export default Page;
