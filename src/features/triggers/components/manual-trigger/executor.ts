import type { NodeExecutor } from "@/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

type ManualTriggerData = Record<string, unknown>;
export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  // For manual trigger, we just pass the data from the trigger to the context
  // In a real implementation, you might want to do some validation or transformation here
  //todo:publish loading state for manual trigger
  const ch = manualTriggerChannel({ nodeId });
  await step.realtime.publish(`${nodeId}-loading`, ch.status, {
    status: "loading",
    nodeId,
  });
  const result = await step.run("manual-trigger", async () => context);
  //todo :publish success state for manual trigger
  await step.realtime.publish(`${nodeId}-success`, ch.status, {
    status: "success",
    nodeId,
  });
  return result;
};
