import { getDbUser } from "@/lib/user";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ runId: string }> }
) {
    const user = await getDbUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { runId } = await params;

    try {
        const body = await req.json();
        const { nodeId, nodeName, nodeType, inputData } = body;

        // Verify ownership
        const run = await prisma.workflowRun.findUnique({
            where: { id: runId },
            include: { workflow: true }
        });

        if (!run || run.workflow.userId !== user.id) {
            return new NextResponse("Run not found or unauthorized", { status: 404 });
        }

        const nodeRun = await prisma.nodeRun.create({
            data: {
                workflowRunId: runId,
                nodeId,
                nodeName,
                nodeType,
                status: 'running',
                inputData: inputData || {},
            }
        });

        return NextResponse.json({ nodeRun, success: true });
    } catch (error) {
        console.error('[RUN_NODES_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
