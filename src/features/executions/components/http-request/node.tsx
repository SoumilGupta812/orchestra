"use client";
import { useRealtime } from "inngest/react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { HttpRequestDialog, HttpRequestFormValues } from "./dialog";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { fetchHttpRequestRealtimeToken } from "./action";
import { useNodeRealtimeStatus } from "../../hooks/useNodeRealtimeStatus";
type HttpRequestNodeData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const nodeStatus = useNodeRealtimeStatus({
    nodeId: props.id,
    channelFactory: httpRequestChannel,
    fetchToken: fetchHttpRequestRealtimeToken,
  });
  // const nodeStatus = "initial";
  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: HttpRequestFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };
  const nodeData = props.data;
  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "Not configured";
  return (
    <>
      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValue={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
