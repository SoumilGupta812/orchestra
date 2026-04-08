"use server";
import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { openaiChannel } from "@/inngest/channels/openai";

export async function fetchOpenaiRealtimeToken(nodeId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: openaiChannel({ nodeId }),
    topics: ["status"],
  });
}
