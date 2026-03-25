import { NextResponse } from "next/server";
import { getEventsByCategory } from "@/controllers/explore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "12");

  try {
    const events = await getEventsByCategory({ category, limit });
    return NextResponse.json({events});
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}