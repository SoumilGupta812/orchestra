import { realtime } from "inngest";
import { z } from "zod";

export const slackChannel = realtime.channel({
  name: ({ nodeId }: { nodeId: string }) => `slack-execution-nodeId:${nodeId}`,
  topics: {
    status: {
      schema: z.object({
        nodeId: z.string(),
        status: z.enum(["loading", "success", "error"]),
      }),
    },
  },
});
