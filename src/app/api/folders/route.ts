import { getDbUser } from "@/lib/user";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    const user = await getDbUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const parentId = searchParams.get('parentId');

        const folders = await prisma.folder.findMany({
            where: {
                userId: user.id,
                parentId: parentId || null,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            include: {
                _count: {
                    select: { workflows: true }
                }
            }
        });

        const formattedFolders = folders.map(f => ({
            ...f,
            fileCount: f._count.workflows
        }));

        return NextResponse.json({ folders: formattedFolders, success: true });
    } catch (error) {
        console.error('[FOLDERS_GET]', error);
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
        const { name, parentId } = body;

        const folder = await prisma.folder.create({
            data: {
                name,
                parentId: parentId || null,
                userId: user.id,
            }
        });

        return NextResponse.json({ folder: { ...folder, fileCount: 0 }, success: true });
    } catch (error) {
        console.error('[FOLDERS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
