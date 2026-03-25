import { NextResponse } from "next/server";
import { getPopularEvents } from "@/controllers/explore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "6");

  try {
    const events = await getPopularEvents(limit);
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}