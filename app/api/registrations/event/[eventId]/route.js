import { NextResponse } from "next/server";
import { getEventRegistrations } from "@/controllers/registrations";

export async function GET(req, { params }) {
  try {
    const { eventId } = await params; // ✅ await add kiya
    const registrations = await getEventRegistrations(req, { eventId }); // ✅ req pass kiya
    return NextResponse.json({ registrations });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
