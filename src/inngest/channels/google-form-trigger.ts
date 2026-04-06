import { realtime } from "inngest";
import { z } from "zod";

export const googleFormTriggerChannel = realtime.channel({
  name: ({ nodeId }: { nodeId: string }) =>
    `google-form-trigger-nodeId:${nodeId}`,
  topics: {
    status: {
      schema: z.object({
        nodeId: z.string(),
        status: z.enum(["loading", "success", "error"]),
      }),
    },
  },
});
