import { getDbUser } from "@/lib/user";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
 
export async function GET(req: Request) {
    const user = await getDbUser();
    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const workflows = await prisma.workflow.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        // Parse nodes and edges JSON
        const parsedWorkflows = workflows.map(wf => ({
            ...wf,
            nodes: typeof wf.nodes === 'string' ? JSON.parse(wf.nodes as string) : wf.nodes,
            edges: typeof wf.edges === 'string' ? JSON.parse(wf.edges as string) : wf.edges,
        }));

        return NextResponse.json({ workflows: parsedWorkflows, success: true });
    } catch (error) {
        console.error('[WORKFLOWS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const user = await getDbUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, nodes, edges, thumbnail, folderId } = body;

        const workflow = await prisma.workflow.create({
            data: {
                userId: user.id,
                name: name || "Untitled Workflow",
                folderId: folderId || null,
                nodes: nodes || [],
                edges: edges || [],
                thumbnail: thumbnail || null,
            },
        });

        return NextResponse.json({ workflow, success: true });
    } catch (error) {
        console.error('[WORKFLOWS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
