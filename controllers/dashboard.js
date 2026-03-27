import Event from "@/models/Event";
import Registration from "@/models/Registration";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/controllers/user";

// ─── Get Event Dashboard ──────────────────────────────────────────────────────
export async function getEventDashboard(req, eventId) {
  await dbConnect();

  const user = await getCurrentUser(req);

  if (!user) {
    throw new Error("User not found");
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Check if user is the organizer
  if (event.organizerId.toString() !== user._id.toString()) {
    throw new Error("You are not authorized to view this dashboard");
  }

  // Get all registrations
  // Convex: .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
  const registrations = await Registration.find({ eventId: event._id });

  // Calculate stats
  const totalRegistrations = registrations.filter(
    (r) => r.status === "confirmed"
  ).length;

  const checkedInCount = registrations.filter(
    (r) => r.checkedIn && r.status === "confirmed"
  ).length;

  const pendingCount = totalRegistrations - checkedInCount;

  // Calculate revenue for paid events
  let totalRevenue = 0;
  if (event.ticketType === "paid" && event.ticketPrice) {
    totalRevenue = checkedInCount * event.ticketPrice;
  }

  // Calculate check-in rate
  const checkInRate =
    totalRegistrations > 0
      ? Math.round((checkedInCount / totalRegistrations) * 100)
      : 0;

  // Calculate time until event
  const now = Date.now();
  const timeUntilEvent = new Date(event.startDate).getTime() - now;
  const hoursUntilEvent = Math.max(
    0,
    Math.floor(timeUntilEvent / (1000 * 60 * 60))
  );

  const today = new Date().setHours(0, 0, 0, 0);
  const startDay = new Date(event.startDate).setHours(0, 0, 0, 0);
  const endDay = new Date(event.endDate).setHours(0, 0, 0, 0);
  const isEventToday = today >= startDay && today <= endDay;
  const isEventPast = new Date(event.endDate).getTime() < now;

  return {
    event,
    stats: {
      totalRegistrations,
      checkedInCount,
      pendingCount,
      capacity: event.capacity,
      checkInRate,
      totalRevenue,
      hoursUntilEvent,
      isEventToday,
      isEventPast,
    },
  };
}