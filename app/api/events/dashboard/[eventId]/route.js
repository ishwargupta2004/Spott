import { NextResponse } from "next/server";
import { getEventDashboard } from "@/controllers/dashboard";

export async function GET(req, { params }) {
  try {
    const { eventId } = await params; // ✅ await add kiya
    const data = await getEventDashboard(req, eventId);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}