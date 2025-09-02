// app/api/files/presign/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPresignedUploadUrl } from "@/lib/s3";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { filename, contentType } = await req.json();

  // sanitize filename & create unique key, this regex removes whitespaces
  const safeName = filename.replace(/\s+/g, "_");
  const key = `uploads/${session.user?.email}/${Date.now()}_${safeName}`;

  const url = await getPresignedUploadUrl(key, contentType);

  return NextResponse.json({ url, key });
}
