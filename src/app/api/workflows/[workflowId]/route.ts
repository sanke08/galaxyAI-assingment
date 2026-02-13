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

    try {
        const workflow = await prisma.workflow.findUnique({
            where: {
                id: workflowId,
                userId: user.id,
            }
        });

        if (!workflow) {
            return new NextResponse("Workflow not found", { status: 404 });
        }

        return NextResponse.json({ workflow, success: true });
    } catch (error) {
        console.error('[WORKFLOW_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
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
        const { name, nodes, edges, thumbnail, folderId } = body;

        const workflow = await prisma.workflow.update({
            where: {
                id: workflowId,
                userId: user.id,
            },
            data: {
                name,
                nodes: nodes || undefined,
                edges: edges || undefined,
                thumbnail,
                folderId,
            }
        });

        return NextResponse.json({ workflow, success: true });
    } catch (error) {
        console.error('[WORKFLOW_PATCH]', error);
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
        await prisma.workflow.delete({
            where: {
                id: workflowId,
                userId: user.id,
            }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[WORKFLOW_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
