// app/api/files/delete/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import File from "@/lib/models/File";
import { deleteS3Object } from "@/lib/s3";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const file = await File.findById(id);
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (file.userEmail !== session.user?.email) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // delete object from S3 and then metadata
  await deleteS3Object(file.s3Key);
  await file.deleteOne();

  return NextResponse.json({ ok: true });
}
