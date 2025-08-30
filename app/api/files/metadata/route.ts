// app/api/files/metadata/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import File from "@/lib/models/File";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { filename, s3Key, size, mimeType } = await req.json();

  await connectDB();
  const doc = await File.create({
    userEmail: session.user?.email,
    filename,
    s3Key,
    size,
    mimeType,
  });

  return NextResponse.json({ ok: true, fileId: doc._id });
}
