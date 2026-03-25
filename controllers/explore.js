import Event from "@/models/Event";
import dbConnect from "@/lib/db";

// ─── Get Featured Events (high registration count or recent) ──────────────────
export async function getFeaturedEvents(limit = 3) {
  await dbConnect();

  const now = new Date();

  // Convex: .withIndex("by_start_date").filter(gte startDate now).order("desc")
  const events = await Event.find({ startDate: { $gte: now } }).sort({
    startDate: -1,
  });

  // Sort by registration count for featured
  const featured = events
    .sort((a, b) => b.registrationCount - a.registrationCount)
    .slice(0, limit);

  return featured;
}

// ─── Get Events by Location (city/state) ──────────────────────────────────────
export async function getEventsByLocation({ city, state, limit = 4 }) {
  await dbConnect();

  const now = new Date();

  // Base query — sirf future events
  // Convex: .withIndex("by_start_date").filter(gte startDate now)
  const query = { startDate: { $gte: now } };

  // Filter by city or state
  // Convex: events.filter(e => e.city.toLowerCase() === args.city.toLowerCase())
  if (city) {
    query.city = { $regex: new RegExp(`^${city}$`, "i") };
  } else if (state) {
    query.state = { $regex: new RegExp(`^${state}$`, "i") };
  }

  const events = await Event.find(query).limit(limit);

  return events;
}

// ─── Get Popular Events (high registration count) ─────────────────────────────
export async function getPopularEvents(limit = 6) {
  await dbConnect();

  const now = new Date();

  // Convex: .withIndex("by_start_date").filter(gte startDate now)
  const events = await Event.find({ startDate: { $gte: now } }).sort({
    startDate: -1,
  });

  // Sort by registration count
  const popular = events
    .sort((a, b) => b.registrationCount - a.registrationCount)
    .slice(0, limit);

  return popular;
}

// ─── Get Events by Category ───────────────────────────────────────────────────
export async function getEventsByCategory({ category, limit = 12 }) {
  await dbConnect();

  const now = new Date();

  // Convex: .withIndex("by_category", q => q.eq("category", args.category))
  //         .filter(gte startDate now)
  const events = await Event.find({
    category,
    startDate: { $gte: now },
  }).limit(limit);

  return events;
}

// ─── Get Event Counts by Category ────────────────────────────────────────────
export async function getCategoryCounts() {
  await dbConnect();

  const now = new Date();

  // Convex: .withIndex("by_start_date").filter(gte startDate now)
  const events = await Event.find({ startDate: { $gte: now } });

  // Count events by category
  // Convex: counts[event.category] = (counts[event.category] || 0) + 1
  const counts = {};
  events.forEach((event) => {
    counts[event.category] = (counts[event.category] || 0) + 1;
  });

  return counts;
}