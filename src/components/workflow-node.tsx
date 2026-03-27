"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import type { ReactNode } from "react";

interface workflowNodeProp {
  children: ReactNode;
  showToolBar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
  name?: string;
  description?: string;
}

export function WorkflowNode({
  children,
  showToolBar = true,
  onDelete,
  onSettings,
  name,
  description,
}: workflowNodeProp) {
  return (
    <>
      {showToolBar && (
        <NodeToolbar>
          <Button size="sm" variant="ghost" onClick={onSettings}>
            <SettingsIcon className="size-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <TrashIcon className="size-4" />
          </Button>
        </NodeToolbar>
      )}
      {children}
      {name && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-50 text-center"
        >
          <p className="font-medium">{name}</p>
          {description && (
            <p className="text-muted-foreground text-sm truncate">
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </>
  );
}
