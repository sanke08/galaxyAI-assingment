import { getDbUser } from "@/lib/user";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ workflowId: string }> }
) {
    const user = await getDbUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { workflowId } = await params;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    try {
        // Verify ownership
        const workflow = await prisma.workflow.findUnique({
            where: { id: workflowId, userId: user.id },
        });

        if (!workflow) {
            return new NextResponse("Workflow not found", { status: 404 });
        }

        const runs = await prisma.workflowRun.findMany({
            where: {
                workflowId,
            },
            include: {
                nodeRuns: true,
            },
            orderBy: {
                startedAt: 'desc',
            },
            take: limit,
        });

        return NextResponse.json({ runs, success: true });
    } catch (error) {
        console.error('[WORKFLOW_RUNS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ workflowId: string }> }
) {
    const user = await getDbUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { workflowId } = await params;

    try {
        const body = await req.json();
        const { runScope, nodeCount } = body;

        // Verify ownership
        const workflow = await prisma.workflow.findUnique({
            where: { id: workflowId, userId: user.id },
        });

        if (!workflow) {
            return new NextResponse("Workflow not found", { status: 404 });
        }

        const run = await prisma.workflowRun.create({
            data: {
                workflowId,
                runScope: runScope || 'full',
                status: 'running',
                nodeCount: nodeCount || 0,
            },
            include: {
                nodeRuns: true,
            }
        });

        return NextResponse.json({ run, success: true });
    } catch (error) {
        console.error('[WORKFLOW_RUNS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ workflowId: string }> }
) {
    const user = await getDbUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { workflowId } = await params;

    try {
        // Verify ownership
        const workflow = await prisma.workflow.findUnique({
            where: { id: workflowId, userId: user.id },
        });

        if (!workflow) {
            return new NextResponse("Workflow not found", { status: 404 });
        }

        await prisma.workflowRun.deleteMany({
            where: {
                workflowId,
            }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[WORKFLOW_RUNS_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
