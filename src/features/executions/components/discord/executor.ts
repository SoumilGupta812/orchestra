import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import Handlebars from "handlebars";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import prisma from "@/lib/db";
import { discordChannel } from "@/inngest/channels/discord";
import ky from "ky";
Handlebars.registerHelper("json", (context) => {
  try {
    const jsonString = JSON.stringify(context);
    return new Handlebars.SafeString(jsonString);
  } catch (error) {
    throw new Error("Failed to stringify JSON in Handlebars helper: " + error);
  }
});
type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  nodeId,
  userId,
  data,
  context,
  step,
}) => {
  const ch = discordChannel({ nodeId });
  await step.realtime.publish(`${nodeId}-loading`, ch.status, {
    status: "loading",
    nodeId,
  });
  if (!data.content) {
    await step.realtime.publish(`${nodeId}-error`, ch.status, {
      status: "error",
      nodeId,
    });
    throw new NonRetriableError("Discord node: Content is missing");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);
  const username = data.username
    ? decode(Handlebars.compile(data.username)(context))
    : undefined;

  try {
    const result = await step.run("discord-webhook", async () => {
      if (!data.variableName) {
        await step.realtime.publish(`${nodeId}-error`, ch.status, {
          status: "error",
          nodeId,
        });

        throw new NonRetriableError("Discord node: Variable name is missing");
      }

      if (!data.webhookUrl) {
        await step.realtime.publish(`${nodeId}-error`, ch.status, {
          status: "error",
          nodeId,
        });
        throw new NonRetriableError("Discord node: Webhook URL is missing");
      }
      await ky.post(data.webhookUrl!, {
        json: {
          content: content.slice(0, 2000), // Discord has a max message length of 2000 characters
          username,
        },
      });

      return {
        ...context,
        [data.variableName]: {
          messageContent: content.slice(0, 2000),
        },
      };
    });

    await step.realtime.publish(`${nodeId}-success`, ch.status, {
      status: "success",
      nodeId,
    });

    return result;
  } catch (error) {
    await step.realtime.publish(`${nodeId}-error`, ch.status, {
      status: "error",
      nodeId,
    });
    throw error;
  }
};
