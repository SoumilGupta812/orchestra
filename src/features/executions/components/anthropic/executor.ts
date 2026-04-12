import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import prisma from "@/lib/db";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { decrypt } from "@/lib/encryption";
Handlebars.registerHelper("json", (context) => {
  try {
    const jsonString = JSON.stringify(context);
    return new Handlebars.SafeString(jsonString);
  } catch (error) {
    throw new Error("Failed to stringify JSON in Handlebars helper: " + error);
  }
});
type AnthropicData = {
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
  nodeId,
  userId,
  data,
  context,
  step,
}) => {
  const ch = anthropicChannel({ nodeId });
  await step.realtime.publish(`${nodeId}-loading`, ch.status, {
    status: "loading",
    nodeId,
  });
  if (!data.variableName) {
    await step.realtime.publish(`${nodeId}-error`, ch.status, {
      status: "error",
      nodeId,
    });

    throw new NonRetriableError("Anthropic node: Variable name is missing");
  }

  if (!data.userPrompt) {
    await step.realtime.publish(`${nodeId}-error`, ch.status, {
      status: "error",
      nodeId,
    });
    throw new NonRetriableError("Anthropic node: User prompt is missing");
  }
  if (!data.credentialId) {
    await step.realtime.publish(`${nodeId}-error`, ch.status, {
      status: "error",
      nodeId,
    });
    throw new NonRetriableError("Anthropic node: Credential Id is missing");
  }
  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credential = await step.run("get-credential", () => {
    return prisma.credential.findFirst({
      where: {
        id: data.credentialId,
        userId,
      },
    });
  });
  if (!credential) {
    await step.realtime.publish(`${nodeId}-error`, ch.status, {
      status: "error",
      nodeId,
    });
    throw new NonRetriableError("Anthropic node: Credential not found");
  }

  const anthropic = createAnthropic({
    // custom settings, e.g.
    apiKey: decrypt(credential.value),
  });
  try {
    const { steps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic("claude-3-5-sonnet"),
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    const text =
      steps[0]?.content[0]?.type === "text" ? steps[0].content[0].text : "";

    await step.realtime.publish(`${nodeId}-success`, ch.status, {
      status: "success",
      nodeId,
    });

    return {
      ...context,
      [data.variableName]: {
        text,
      },
    };
  } catch (error) {
    await step.realtime.publish(`${nodeId}-error`, ch.status, {
      status: "error",
      nodeId,
    });
    throw error;
  }
};
