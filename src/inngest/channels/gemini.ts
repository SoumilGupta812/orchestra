import { realtime } from "inngest";
import { z } from "zod";

export const geminiChannel = realtime.channel({
  name: ({ nodeId }: { nodeId: string }) => `gemini-execution-nodeId:${nodeId}`,
  topics: {
    status: {
      schema: z.object({
        nodeId: z.string(),
        status: z.enum(["loading", "success", "error"]),
      }),
    },
  },
});
