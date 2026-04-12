import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";
import { inngest } from "./client";
import { createId } from "@paralleldrive/cuid2";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[],
): Node[] => {
  //If no connections , return node as-is
  if (connections.length === 0) return nodes;

  //create edges array for toposort
  const edges: [string, string][] = connections.map((conn) => [
    conn.fromNodeId,
    conn.toNodeId,
  ]);

  //add nodes with no connections as self-edges to ensure they're included
  const connectedNodeIds = new Set<string>();
  for (const conn of connections) {
    connectedNodeIds.add(conn.fromNodeId);
    connectedNodeIds.add(conn.toNodeId);
  }

  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }
  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);

    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Workflow contains a cycle");
    }
    throw error;
  }

  //map sorted ids back to node objects
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};

export const sendWorkflowExecution = async (data: {
  workflowId: string;
  [key: string]: any;
}) => {
  await inngest.send({
    name: "workflows/execute.workflow",
    data,
    id: createId(),
  });
};
