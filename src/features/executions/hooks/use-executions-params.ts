import { useQueryStates } from "nuqs";
import { executionParams } from "../params";
export const useExecutionParams = () => useQueryStates(executionParams);
