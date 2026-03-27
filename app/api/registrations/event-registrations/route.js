import { NextResponse } from "next/server";
import { getEventRegistrations } from "@/controllers/registrations";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    const registrations = await getEventRegistrations(request, { eventId });

    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}