import { NextResponse } from "next/server";
import { createEvent } from "@/controllers/event";

export async function POST(req) {
  try {
    const args = await req.json();
    const eventId = await createEvent(req, args);
    return NextResponse.json({ eventId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}