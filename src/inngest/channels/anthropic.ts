import { realtime } from "inngest";
import { z } from "zod";

export const anthropicChannel = realtime.channel({
  name: ({ nodeId }: { nodeId: string }) =>
    `anthropic-execution-nodeId:${nodeId}`,
  topics: {
    status: {
      schema: z.object({
        nodeId: z.string(),
        status: z.enum(["loading", "success", "error"]),
      }),
    },
  },
});
