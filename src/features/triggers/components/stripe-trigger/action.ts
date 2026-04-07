"use server";
import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";

export async function fetchStripeTriggerRealtimeToken(nodeId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: stripeTriggerChannel({ nodeId }),
    topics: ["status"],
  });
}
