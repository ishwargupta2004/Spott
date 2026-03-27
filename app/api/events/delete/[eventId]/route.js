import { NextResponse } from "next/server";
import { deleteEvent } from "@/controllers/event";

export async function DELETE(req, { params }) {
  try {
    const { eventId } = await params;
    const result = await deleteEvent(req, eventId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
