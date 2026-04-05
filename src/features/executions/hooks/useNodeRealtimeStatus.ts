import { useMemo, useCallback } from "react";
import { useRealtime } from "inngest/react";

type ChannelFactory<T> = (params: { nodeId: string }) => T;
type TokenFetcher = (nodeId: string) => Promise<any>;
type NodeStatus = "initial" | "loading" | "success" | "error";

interface UseNodeRealtimeStatusOptions {
  nodeId: string;
  channelFactory: ChannelFactory<any>;
  fetchToken: TokenFetcher;
}

export function useNodeRealtimeStatus({
  nodeId,
  channelFactory,
  fetchToken,
}: UseNodeRealtimeStatusOptions): NodeStatus {
  const ch = useMemo(
    () => channelFactory({ nodeId }),
    [nodeId, channelFactory],
  );

  const topics = useMemo(() => ["status"] as const, []);

  const getToken = useCallback(() => fetchToken(nodeId), [nodeId, fetchToken]);

  const { messages } = useRealtime({
    channel: ch,
    topics,
    token: getToken,
  });

  return (
    (
      messages.byTopic.status?.data as {
        status: "error" | "loading" | "success";
        nodeId: string;
      }
    )?.status ?? "initial"
  );
}
