import Event from "@/models/Event";
import dbConnect from "@/lib/db";

// ─── Search Events by Title ───────────────────────────────────────────────────
export async function searchEvents({ query, limit = 5 }) {
  await dbConnect();

  if (!query || query.trim().length < 2) {
    return [];
  }

  const now = new Date();

  // Convex: .withSearchIndex("search_title", q => q.search("title", args.query))
  //         .filter(gte startDate now)
  // MongoDB: $text search (Event model mein text index hai title pe)
  const events = await Event.find({
    $text: { $search: query },
    startDate: { $gte: now },
  })
    .limit(limit);

  return events;
}