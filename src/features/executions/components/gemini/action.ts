"use server";
import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { geminiChannel } from "@/inngest/channels/gemini";

export async function fetchGeminiRealtimeToken(nodeId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: geminiChannel({ nodeId }),
    topics: ["status"],
  });
}
