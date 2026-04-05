import { NodeProps } from "@xyflow/react";
import { useRealtime } from "inngest/react";
import { memo, useCallback, useMemo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { fetchManualTriggerRealtimeToken } from "./action";
import { useNodeRealtimeStatus } from "@/features/executions/hooks/useNodeRealtimeStatus";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const handleSettings = () => {
    setOpen(true);
  };
  const nodeStatus = useNodeRealtimeStatus({
    nodeId: props.id,
    channelFactory: manualTriggerChannel,
    fetchToken: fetchManualTriggerRealtimeToken,
  });
  return (
    <>
      <ManualTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        status={nodeStatus}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
      />
    </>
  );
});
