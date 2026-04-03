import type { NodeExecutor } from "@/features/executions/types";

type ManualTriggerData = Record<string, unknown>;
export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  // For manual trigger, we just pass the data from the trigger to the context
  // In a real implementation, you might want to do some validation or transformation here
  //todo:publish loading state for manual trigger
  const result = await step.run("manual-trigger", async () => context);
  //todo :publish success state for manual trigger
  return result;
};
