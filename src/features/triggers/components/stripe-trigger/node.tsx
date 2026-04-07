import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import { useNodeRealtimeStatus } from "@/features/executions/hooks/useNodeRealtimeStatus";
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger";
import { fetchStripeTriggerRealtimeToken } from "./action";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const handleSettings = () => {
    setOpen(true);
  };
  const nodeStatus = useNodeRealtimeStatus({
    nodeId: props.id,
    channelFactory: stripeTriggerChannel,
    fetchToken: fetchStripeTriggerRealtimeToken,
  });
  return (
    <>
      <StripeTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon="/logos/stripe.svg"
        name="Stripe"
        description="When Stripe Event is captured"
        status={nodeStatus}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
      />
    </>
  );
});
