import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";
Handlebars.registerHelper("json", (context) => {
  try {
    const jsonString = JSON.stringify(context);
    return new Handlebars.SafeString(jsonString);
  } catch (error) {
    throw new Error("Failed to stringify JSON in Handlebars helper: " + error);
  }
});
type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
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
  if (!data.variableName) {
    throw new NonRetriableError(
      "HTTP Request Node : Variable name is required",
    );
  }
  if (!data.method) {
    throw new NonRetriableError("HTTP Request Node : HTTP method is required");
  }
  const result = await step.run("http-request", async () => {
    const method = data.method;
    let endpoint: string;
    try {
      endpoint = Handlebars.compile(data.endpoint)(context);
      if (typeof endpoint !== "string" || !endpoint) {
        throw new Error("Endpoint must be a non-empty string after templating");
      }
    } catch (error) {
      throw new NonRetriableError(
        "Failed to compile endpoint template: " + error,
      );
    }
    const options: KyOptions = {
      method,
    };
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = Handlebars.compile(data.body || "{}")(context);
      JSON.parse(resolved);
      options.body = resolved;
      options.headers = {
        "Content-Type": "application/json",
      };
    }
    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");

    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const payload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
    return {
      ...context,
      [data.variableName!]: payload,
    };
  });
  //todo :publish success state for http request
  return result;
};
