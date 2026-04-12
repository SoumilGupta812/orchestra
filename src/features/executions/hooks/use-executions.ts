import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useExecutionParams } from "./use-executions-params";

export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionParams();
  return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
};

export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};
