import { NextResponse } from "next/server";
import { cancelRegistration } from "@/controllers/registrations";

export async function PATCH(request) {
  try {
    const { registrationId } = await request.json();

    const result = await cancelRegistration(request, { registrationId });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}