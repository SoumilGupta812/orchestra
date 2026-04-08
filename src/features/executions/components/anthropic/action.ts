"use server";
import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { anthropicChannel } from "@/inngest/channels/anthropic";

export async function fetchAnthropicRealtimeToken(nodeId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: anthropicChannel({ nodeId }),
    topics: ["status"],
  });
}
