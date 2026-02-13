import { getDbUser } from "@/lib/user";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ nodeRunId: string }> }
) {
    const user = await getDbUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { nodeRunId } = await params;

    try {
        const body = await req.json();
        const { status, completedAt, duration, outputData, error } = body;

        // Verify ownership via run -> workflow
        const nodeRun = await prisma.nodeRun.findUnique({
            where: { id: nodeRunId },
            include: { workflowRun: { include: { workflow: true } } }
        });

        if (!nodeRun || nodeRun.workflowRun.workflow.userId !== user.id) {
            return new NextResponse("Node Run not found or unauthorized", { status: 404 });
        }

        const updatedNodeRun = await prisma.nodeRun.update({
            where: { id: nodeRunId },
            data: {
                status,
                completedAt,
                duration,
                outputData: outputData || undefined,
                error,
            }
        });

        return NextResponse.json({ nodeRun: updatedNodeRun, success: true });
    } catch (error) {
        console.error('[NODE_RUN_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
