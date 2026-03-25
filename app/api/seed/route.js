import { run } from "@/scripts/seed";
import { NextResponse } from "next/server";

export async function POST() {
  // Sirf development mein chalega — production mein block
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }
  try {
    const result = await run();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed operation failed" }, { status: 500 });
  }}