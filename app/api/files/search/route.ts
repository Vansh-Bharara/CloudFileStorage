import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import File from "@/lib/models/File"

export async function GET(req: NextRequest, res: NextResponse) {

    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB()

    const q = req.nextUrl.searchParams.get("q")
    console.log(q)
    const query: any = {
        userEmail: session.user?.email
    }
    if (q && q.toString().trim() !== "") {
        query.filename = { $regex: q.toString(), $options: 'i' }
    }

    const files = await File.find(query).sort({ createdAt: -1 }).lean()
    const result = files.map(f => ({
        id: f._id.toString(),
        filename: f.filename,
        s3Key: f.s3Key,
        size: f.size,
        mimeType: f.mimeType,
        createdAt: f.createdAt,
    }))

    return NextResponse.json(result)

}