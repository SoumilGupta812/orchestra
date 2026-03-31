"use client";

import { memo } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NodeSelector } from "@/components/node-selector";
export const AddNodeButton = memo(() => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <Button size="sm" variant="outline" className="bg-background">
        <PlusIcon className="size-4" />
      </Button>
    </NodeSelector>
  );
});
AddNodeButton.displayName = "addNodeButton";
