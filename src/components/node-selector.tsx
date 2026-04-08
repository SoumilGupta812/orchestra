"use client";
import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon, WebhookIcon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NodeType } from "@/generated/prisma/enums";
import { Separator } from "./ui/separator";

export type NodeTypeOption = {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
  type: NodeType;
};
const triggerNodes: NodeTypeOption[] = [
  {
    label: "Trigger Manually",
    description: "Trigger the flow manually",
    icon: MousePointerIcon,
    type: NodeType.MANUAL_TRIGGER,
  },
  {
    label: "Google Form",
    description: "Runs the flow when Google Form is submitted",
    icon: "/logos/googleform.svg",
    type: NodeType.GOOGLE_FORM_TRIGGER,
  },
  {
    label: "Stripe Event",
    description: "Runs the flow when Stripe Event is captured",
    icon: "/logos/stripe.svg",
    type: NodeType.STRIPE_TRIGGER,
  },
];
const executionNodes: NodeTypeOption[] = [
  {
    label: "HTTP Request",
    description: "Make an HTTP request",
    icon: GlobeIcon,
    type: NodeType.HTTP_REQUEST,
  },
  {
    label: "Gemini",
    description: "Uses Google Gemini to generate text",
    icon: "/logos/gemini.svg",
    type: NodeType.GEMINI,
  },
  {
    label: "OpenAI",
    description: "Uses OpenAI to generate text",
    icon: "/logos/openai.svg",
    type: NodeType.OPENAI,
  },
  {
    label: "Anthropic",
    description: "Uses Anthropic to generate text",
    icon: "/logos/anthropic.svg",
    type: NodeType.ANTHROPIC,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function NodeSelector({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();
  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER,
        );
        if (hasManualTrigger) {
          toast.error("Only one manual trigger is allowed in the workflow");
          return;
        }
      }
      setNodes((nodes) => {
        const hasInitialNode = nodes.some(
          (node) => node.type === NodeType.INITIAL,
        );
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });
        const newNode = {
          id: createId(),
          type: selection.type,
          position: flowPosition,
          data: {},
        };
        if (hasInitialNode) {
          return [newNode];
        }
        return [...nodes, newNode];
      });
      onOpenChange(false);
    },
    [setNodes, getNodes, screenToFlowPosition, onOpenChange],
  );
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>What triggers this workflow</SheetTitle>
          <SheetDescription>
            A Trigger is a step that starts the workflow.
          </SheetDescription>
        </SheetHeader>
        {triggerNodes.map((nodeType) => {
          const Icon = nodeType.icon;
          return (
            <div
              key={nodeType.type}
              className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
              onClick={() => handleNodeSelect(nodeType)}
            >
              <div className="flex items-center gap-6 w-full overflow-hidden">
                {typeof Icon === "string" ? (
                  <img
                    src={Icon}
                    alt={nodeType.label}
                    className="size-5 object-contain rounded-sm"
                  />
                ) : (
                  <Icon className="size-5" />
                )}
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium text-sm">{nodeType.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {nodeType.description}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <Separator />
        {executionNodes.map((nodeType) => {
          const Icon = nodeType.icon;
          return (
            <div
              key={nodeType.type}
              className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
              onClick={() => handleNodeSelect(nodeType)}
            >
              <div className="flex items-center gap-6 w-full overflow-hidden">
                {typeof Icon === "string" ? (
                  <img
                    src={Icon}
                    alt={nodeType.label}
                    className="size-5 object-contain rounded-sm"
                  />
                ) : (
                  <Icon className="size-5" />
                )}
                <div className="flex flex-col items-start text-left">
                  <span className="font-medium text-sm">{nodeType.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {nodeType.description}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </SheetContent>
    </Sheet>
  );
}
