import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeRealtimeStatus } from "@/features/executions/hooks/useNodeRealtimeStatus";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";
import { fetchGoogleFormTriggerRealtimeToken } from "./action";

export const GoogleFormTrigger = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  const handleSettings = () => {
    setOpen(true);
  };
  const nodeStatus = useNodeRealtimeStatus({
    nodeId: props.id,
    channelFactory: googleFormTriggerChannel,
    fetchToken: fetchGoogleFormTriggerRealtimeToken,
  });
  return (
    <>
      <GoogleFormTriggerDialog open={open} onOpenChange={setOpen} />
      <BaseTriggerNode
        {...props}
        icon="/logos/googleform.svg"
        name="Google Form"
        description="When Form is submitted"
        status={nodeStatus}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
      />
    </>
  );
});
