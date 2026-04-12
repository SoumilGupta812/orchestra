"use server";
import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { slackChannel } from "@/inngest/channels/slack";

export async function fetchSlackRealtimeToken(nodeId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: slackChannel({ nodeId }),
    topics: ["status"],
  });
}
