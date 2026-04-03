import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
type HttpRequestData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  nodeId,
  data,
  context,
  step,
}) => {
  // For manual trigger, we just pass the data from the trigger to the context
  // In a real implementation, you might want to do some validation or transformation here
  //todo:publish loading state for http request

  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request Node : No Endpoint Provided");
  }
  const result = await step.run("http-request", async () => {
    const method = data.method || "GET";
    const endpoint = data.endpoint!;
    const options: KyOptions = {
      method,
    };
    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body;
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");

    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();
    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });
  //todo :publish success state for http request
  return result;
};
