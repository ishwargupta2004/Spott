import { NextResponse } from "next/server";
import { getEventBySlug } from "@/controllers/event";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const event = await getEventBySlug(slug);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}