import { NextResponse } from "next/server";
import { checkInAttendee } from "@/controllers/registrations";

export async function POST(request) {
  try {
    const { qrCode } = await request.json();

    const result = await checkInAttendee(request, { qrCode });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}