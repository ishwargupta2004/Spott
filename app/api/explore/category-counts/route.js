import { NextResponse } from "next/server";
import { getCategoryCounts } from "@/controllers/explore";

export async function GET() {
  try {
    const counts = await getCategoryCounts();
    return NextResponse.json(counts);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}