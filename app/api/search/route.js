import { NextResponse } from "next/server";
import { searchEvents } from "@/scripts/search";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const limit = parseInt(searchParams.get("limit") || "5");

  try {
    const events = await searchEvents({ query, limit });
    return NextResponse.json({events});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}