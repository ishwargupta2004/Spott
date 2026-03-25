import { NextResponse } from "next/server";
import { getCurrentUser } from "@/controllers/user";

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}