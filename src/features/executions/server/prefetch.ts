import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.executions.getMany>;
export const prefetchExecutions = (params: Input) =>
  prefetch(trpc.executions.getMany.queryOptions(params));

export const prefetchExecution = (id: string) =>
  prefetch(trpc.executions.getOne.queryOptions({ id }));
