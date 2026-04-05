import { realtime } from "inngest";
import { z } from "zod";

export const manualTriggerChannel = realtime.channel({
  name: ({ nodeId }: { nodeId: string }) => `manual-trigger-nodeId:${nodeId}`,
  topics: {
    status: {
      schema: z.object({
        nodeId: z.string(),
        status: z.enum(["loading", "success", "error"]),
      }),
    },
  },
});
