import { NextResponse } from "next/server";
import { registerForEvent } from "@/controllers/registrations";

export async function POST(request) {
  try {
    const { eventId, attendeeName, attendeeEmail } = await request.json();

    const registrationId = await registerForEvent(request, {
      eventId,
      attendeeName,
      attendeeEmail,
    });

    return NextResponse.json({ registrationId });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}