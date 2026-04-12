import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { geminiChannel } from "@/inngest/channels/gemini";
import prisma from "@/lib/db";
Handlebars.registerHelper("json", (context) => {
  try {
    const jsonString = JSON.stringify(context);
    return new Handlebars.SafeString(jsonString);
  } catch (error) {
    throw new Error("Failed to stringify JSON in Handlebars helper: " + error);
  }
});
type GeminiData = {
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  nodeId,
  userId,
  data,
  context,
  step,
}) => {
  const ch = geminiChannel({ nodeId });
  await step.realtime.publish(`${nodeId}-loading`, ch.status, {
    status: "loading",
    nodeId,
  });
  if (!data.variableName) {
    await step.realtime.publish(`${nodeId}-error`, ch.status, {
      status: "error",
      nodeId,
    });

    throw new NonRetriableError("Gemini node: Variable name is missing");
  }

  if (!data.userPrompt) {
    await step.realtime.publish(`${nodeId}-error`, ch.status, {
      status: "error",
      nodeId,
    });
    throw new NonRetriableError("Gemini node: User prompt is missing");
  }
  if (!data.credentialId) {
    await step.realtime.publish(`${nodeId}-error`, ch.status, {
      status: "error",
      nodeId,
    });
    throw new NonRetriableError("Gemini node: Credential Id is missing");
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
    throw new NonRetriableError("Gemini node: Credential not found");
  }

  const google = createGoogleGenerativeAI({
    apiKey: credential.value,
  });
  try {
    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google("gemini-3.1-flash-lite-preview"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

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
