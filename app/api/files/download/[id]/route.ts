// app/api/files/download/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import File from "@/lib/models/File";
import { getPresignedDownloadUrl } from "@/lib/s3";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const file = await File.findById(id).lean();
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (file.userEmail !== session.user?.email) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = await getPresignedDownloadUrl(file.s3Key);
  return NextResponse.json({ url });
}
