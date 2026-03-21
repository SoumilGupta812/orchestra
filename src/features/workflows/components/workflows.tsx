"use client";
import { EntityContainer, EntityHeader } from "@/components/entity-components";
import {
  useCreateWorkflows,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/router";

export const WorkflowsList = () => {
  const { data } = useSuspenseWorkflows();
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      {JSON.stringify(data, null, 2)}
    </div>
  );
};
export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflows = useCreateWorkflows();
  const router = useRouter();
  const { modal, handleError } = useUpgradeModal();
  const handleCreate = () => {
    createWorkflows.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (data) => {
        handleError(data);
      },
    });
  };
  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        onNew={handleCreate}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createWorkflows.isPending}
      />
    </>
  );
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer header={<WorkflowsHeader />}>{children}</EntityContainer>
  );
};
