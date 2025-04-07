import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/process`, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: buffer,
  });

  if (!response.ok) return NextResponse.json({ error: "Upload failed" }, { status: 400 });

  const result = await response.json();
  return NextResponse.json(result);
}
