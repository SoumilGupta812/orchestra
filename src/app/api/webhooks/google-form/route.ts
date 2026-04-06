import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter: workflowId",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const sanitizeKey = (key: string) =>
      key
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_") // replace anything not alphanumeric with _
        .replace(/_+/g, "_") // collapse multiple underscores
        .replace(/^_|_$/g, "");
    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      respondentEmail: body.respondentEmail,
      responses: Object.fromEntries(
        Object.entries(body.responses).map(([key, value]) => [
          sanitizeKey(key),
          value,
        ]),
      ),
      raw: body,
    };

    // Trigger an Inngest job
    await sendWorkflowExecution({
      workflowId,
      initialData: {
        googleForm: formData,
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Google form webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process Google Form submission" },
      { status: 500 },
    );
  }
}
