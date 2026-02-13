import { getDbUser } from "@/lib/user";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
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
        const { status, completedAt, duration } = body;

        // Verify ownership via workflow
        const run = await prisma.workflowRun.findUnique({
            where: { id: runId },
            include: { workflow: true }
        });

        if (!run || run.workflow.userId !== user.id) {
            return new NextResponse("Run not found or unauthorized", { status: 404 });
        }

        const updatedRun = await prisma.workflowRun.update({
            where: { id: runId },
            data: {
                status,
                completedAt,
                duration,
            }
        });

        return NextResponse.json({ run: updatedRun, success: true });
    } catch (error) {
        console.error('[RUN_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
