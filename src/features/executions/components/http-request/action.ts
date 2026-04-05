"use server";
import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "@/inngest/client";
import { httpRequestChannel } from "@/inngest/channels/http-request";

export async function fetchHttpRequestRealtimeToken(nodeId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: httpRequestChannel({ nodeId }),
    topics: ["status"],
  });
}
