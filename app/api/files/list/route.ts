// app/api/files/list/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import File from "@/lib/models/File";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const files = await File.find({ userEmail: session.user?.email }).sort({ createdAt: -1 }).lean();

  // remove Mongo internals for client
  const result = files.map(f => ({
    id: f._id.toString(),
    filename: f.filename,
    s3Key: f.s3Key,
    size: f.size,
    mimeType: f.mimeType,
    createdAt: f.createdAt,
  }));

  return NextResponse.json(result);
}
