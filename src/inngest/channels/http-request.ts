import { realtime, staticSchema } from "inngest";
import { z } from "zod";

export const httpRequestChannel = realtime.channel({
  name: ({ nodeId }: { nodeId: string }) =>
    `http-request-execution-nodeId:${nodeId}`,
  topics: {
    status: {
      schema: z.object({
        nodeId: z.string(),
        status: z.enum(["loading", "success", "error"]),
      }),
    },
  },
});
