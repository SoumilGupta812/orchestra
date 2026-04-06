import type { NodeExecutor } from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";

type GoogleFormTriggerData = Record<string, unknown>;
export const googleFormTriggerExecutor: NodeExecutor<
  GoogleFormTriggerData
> = async ({ nodeId, context, step }) => {
  const ch = googleFormTriggerChannel({ nodeId });
  await step.realtime.publish(`${nodeId}-loading`, ch.status, {
    status: "loading",
    nodeId,
  });
  const result = await step.run("google-form-trigger", async () => context);
  await step.realtime.publish(`${nodeId}-success`, ch.status, {
    status: "success",
    nodeId,
  });
  return result;
};
