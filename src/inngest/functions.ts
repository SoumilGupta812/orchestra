import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    triggers: [{ event: "workflows/execute.workflow" }],
    retries: 0, //change it in production, you might want to have some retries for transient errors
  },
  async ({ event, step }) => {
    const workflowId = event.data.workflowId;
    if (!workflowId) {
      throw new NonRetriableError("Workflow Id is missing");
    }
    const sortedNodes = await step.run("prepare-wprkflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    //initalize the context wit any initial data from the trigger
    let context = event.data.initialData || {};

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
      });
    }
    return {
      workflowId,
      result: context,
    };
  },
);
