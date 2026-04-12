import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import Handlebars from "handlebars";

import { slackChannel } from "@/inngest/channels/slack";
import ky, { HTTPError } from "ky";
Handlebars.registerHelper("json", (context) => {
  try {
    const jsonString = JSON.stringify(context);
    return new Handlebars.SafeString(jsonString);
  } catch (error) {
    throw new Error("Failed to stringify JSON in Handlebars helper: " + error);
  }
});
type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

export const slackExecutor: NodeExecutor<SlackData> = async ({
  nodeId,
  data,
  context,
  step,
}) => {
  const ch = slackChannel({ nodeId });
  await step.realtime.publish(`${nodeId}-loading`, ch.status, {
    status: "loading",
    nodeId,
  });
  if (!data.content) {
    await step.realtime.publish(`${nodeId}-error`, ch.status, {
      status: "error",
      nodeId,
    });
    throw new NonRetriableError("Slack node: Content is missing");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);

  try {
    const result = await step.run("slack-webhook", async () => {
      if (!data.variableName) {
        await step.realtime.publish(`${nodeId}-error`, ch.status, {
          status: "error",
          nodeId,
        });

        throw new NonRetriableError("Slack node: Variable name is missing");
      }

      if (!data.webhookUrl) {
        await step.realtime.publish(`${nodeId}-error`, ch.status, {
          status: "error",
          nodeId,
        });
        throw new NonRetriableError("Slack node: Webhook URL is missing");
      }
      try {
        await ky.post(data.webhookUrl, {
          json: {
            text: content, //The key depends on how you want to structure the data for Slack. Adjust accordingly.
          },
        });
      } catch (error) {
        if (error instanceof HTTPError) {
          const body = await error.response.text();
          throw new NonRetriableError(
            `Slack webhook failed: ${error.response.status} - ${body}`,
          );
        }
        throw error;
      }

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
