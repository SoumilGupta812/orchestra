"use client";

import { memo } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
export const AddNodeButton = memo(() => {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {}}
      className="bg-background"
    >
      <PlusIcon className="size-4" />
    </Button>
  );
});
AddNodeButton.displayName = "addNodeButton";
