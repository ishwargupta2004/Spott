import { NextResponse } from "next/server";
import { getEventsByLocation } from "@/controllers/explore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const state = searchParams.get("state");
  const limit = parseInt(searchParams.get("limit") || "4");

  try {
    const events = await getEventsByLocation({ city, state, limit });
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}