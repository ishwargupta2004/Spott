import { NextResponse } from "next/server";
import { completeOnboarding } from "@/controllers/user"; // ✅ tera existing controller

export async function POST(request) {
  try {
    const { location, interests } = await request.json();

    // Validation
    if (!location?.city || !location?.state || !location?.country) {
      return NextResponse.json(
        { error: "City, state and country are required" },
        { status: 400 }
      );
    }

    if (!interests || interests.length < 3) {
      return NextResponse.json(
        { error: "At least 3 interests are required" },
        { status: 400 }
      );
    }

    // ✅ tera existing controller directly call kar raha hai
    // jo andar se getAuth(req) se Clerk userId leta hai
    const userId = await completeOnboarding(request, { location, interests });

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}