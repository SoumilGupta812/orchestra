import type { NodeExecutor } from "@/features/executions/types";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

type StripeTriggerData = Record<string, unknown>;
export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  const ch = stripeTriggerChannel({ nodeId });
  await step.realtime.publish(`${nodeId}-loading`, ch.status, {
    status: "loading",
    nodeId,
  });
  const result = await step.run("stripe-trigger", async () => context);
  await step.realtime.publish(`${nodeId}-success`, ch.status, {
    status: "success",
    nodeId,
  });
  return result;
};
