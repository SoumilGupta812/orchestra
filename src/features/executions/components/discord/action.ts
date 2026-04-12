"use server";
import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { discordChannel } from "@/inngest/channels/discord";

export async function fetchDiscordRealtimeToken(nodeId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: discordChannel({ nodeId }),
    topics: ["status"],
  });
}
