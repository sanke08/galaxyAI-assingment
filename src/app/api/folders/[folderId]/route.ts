import { getDbUser } from "@/lib/user";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ folderId: string }> }
) {
    const user = await getDbUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { folderId } = await params;

    try {
        const folder = await prisma.folder.findUnique({
            where: { id: folderId, userId: user.id },
            include: {
                _count: { select: { workflows: true } }
            }
        });

        if (!folder) {
            return new NextResponse("Folder not found", { status: 404 });
        }

        return NextResponse.json({ folder: { ...folder, fileCount: folder._count.workflows }, success: true });
    } catch (error) {
        console.error('[FOLDER_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ folderId: string }> }
) {
    const user = await getDbUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { folderId } = await params;

    try {
        const body = await req.json();
        const { name, parentId } = body;

        const folder = await prisma.folder.update({
            where: { id: folderId, userId: user.id },
            data: {
                name,
                parentId,
            }
        });

        return NextResponse.json({ folder, success: true });
    } catch (error) {
        console.error('[FOLDER_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ folderId: string }> }
) {
    const user = await getDbUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { folderId } = await params;

    try {
        await prisma.folder.delete({
            where: { id: folderId, userId: user.id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[FOLDER_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
