"use client";
import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from "@/components/entity-components";
import {
  useCreateWorkflows,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { setSeconds } from "date-fns";

export const WorkflowsList = () => {
  const { data } = useSuspenseWorkflows();
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      {JSON.stringify(data, null, 2)}
    </div>
  );
};
export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Workflows"
    />
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
export const WorkflowsPagination = () => {
  const workflows = useSuspenseWorkflows();
  const [params, setParam] = useWorkflowsParams();
  return (
    <EntityPagination
      page={workflows.data.page}
      totalPages={workflows.data.totalPages}
      disabled={workflows.isPending}
      onPageChange={(page) => setParam({ ...params, page })}
    />
  );
};
export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};
