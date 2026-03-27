import { NextResponse } from "next/server";
import { getMyRegistrations } from "@/controllers/registrations";

export async function GET(request) {
  try {
    const registrations = await getMyRegistrations(request);

    return NextResponse.json(registrations);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}