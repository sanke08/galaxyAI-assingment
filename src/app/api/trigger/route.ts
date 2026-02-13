import { getDbUser } from "@/lib/user";
import { NextResponse } from "next/server";
import { tasks, runs } from "@trigger.dev/sdk/v3";
import { llmTask } from "@/trigger/llmTask";
import { cropImageTask } from "@/trigger/cropImageTask";
import { extractFrameTask } from "@/trigger/extractFrameTask";

export async function POST(req: Request) {
  const user = await getDbUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
 
  try {
    const body = await req.json();
    const { taskType, payload } = body;

    let handle;
    let taskId;

    switch (taskType) {
      case "llm":
        taskId = llmTask.id;
        handle = await tasks.trigger<typeof llmTask>(taskId, payload);
        break;
      case "crop-image":
        taskId = cropImageTask.id;
        handle = await tasks.trigger<typeof cropImageTask>(taskId, payload);
        break;
      case "extract-frame": // Matches nodeExecutor call
      case "extract-video-frame":
        taskId = extractFrameTask.id;
        handle = await tasks.trigger<typeof extractFrameTask>(taskId, payload);
        break;
      default:
        console.log({taskType});
        return new NextResponse(`Unknown task: ${taskType}`, { status: 400 });
    }

    console.log({ handle });

    return NextResponse.json({ runId: handle.id,success: true });
  } catch (error) {
    console.error("Trigger error:", error);
    return new NextResponse("Internal Server Error", { status: 500 }); 
  }
}

export async function GET(req: Request) {
  const user = await getDbUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url); 
  const runId = searchParams.get("runId");

  if (!runId) {
    return new NextResponse("Run ID is required", { status: 400 });
  }

  try {
    const run = await runs.retrieve(runId);
    console.log({ run });
    return NextResponse.json(run);
  } catch (error) {
    console.error("Retrieve run error:", error);
    return new NextResponse("Run not found", { status: 404 });
  }
}
