import { NextResponse } from "next/server";
import { getMyEvents } from "@/controllers/event";

export async function GET(req) {
  try {
    const events = await getMyEvents(req);
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
