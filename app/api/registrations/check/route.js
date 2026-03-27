import { NextResponse } from "next/server";
import { checkRegistration } from "@/controllers/registrations";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    const registration = await checkRegistration(request, { eventId });

    return NextResponse.json(registration);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}