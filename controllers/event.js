import { getAuth } from "@clerk/nextjs/server";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/controllers/user";

// ─── Create Event ─────────────────────────────────────────────────────────────
export async function createEvent(req, args) {
  await dbConnect();

  try {
    const user = await getCurrentUser(req);

    const {
      title,
      description,
      category,
      tags,
      startDate,
      endDate,
      timezone,
      locationType,
      venue,
      address,
      city,
      state,
      country,
      capacity,
      ticketType,
      ticketPrice,
      coverImage,
      themeColor,
      hasPro,
    } = args;

    // SERVER-SIDE CHECK: Verify event limit for Free users
    if (!hasPro && user.freeEventsCreated >= 1) {
      throw new Error(
        "Free event limit reached. Please upgrade to Pro to create more events."
      );
    }

    // SERVER-SIDE CHECK: Verify custom color usage
    const defaultColor = "#1e3a8a";
    if (!hasPro && themeColor && themeColor !== defaultColor) {
      throw new Error(
        "Custom theme colors are a Pro feature. Please upgrade to Pro."
      );
    }

    // Force default color for Free users
    const validatedColor = hasPro ? themeColor : defaultColor;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Create event
    const event = await Event.create({
      title,
      description,
      category,
      tags,
      startDate: new Date(startDate),   // Convex mein number tha, MongoDB mein Date
      endDate: new Date(endDate),
      timezone,
      locationType,
      venue,
      address,
      city,
      state,
      country,
      capacity,
      ticketType,
      ticketPrice,
      coverImage,
      themeColor: validatedColor,       // Use validated color
      slug: `${slug}-${Date.now()}`,
      organizerId: user._id,
      organizerName: user.name,
      registrationCount: 0,
      // createdAt & updatedAt — Mongoose timestamps:true se auto set hoga
    });

    // Update user's free event count
    await User.findByIdAndUpdate(user._id, {
      freeEventsCreated: user.freeEventsCreated + 1,
    });

    return event._id;
  } catch (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }
}

// ─── Get Event by Slug ────────────────────────────────────────────────────────
export async function getEventBySlug(slug) {
  await dbConnect();

  // Convex: .withIndex("by_slug", (q) => q.eq("slug", args.slug))
  const event = await Event.findOne({ slug });

  return event;
}

// ─── Get My Events (by organizer) ─────────────────────────────────────────────
export async function getMyEvents(req) {
  await dbConnect();

  const user = await getCurrentUser(req);

  // Convex: .withIndex("by_organizer", ...).order("desc")
  const events = await Event.find({ organizerId: user._id }).sort({
    createdAt: -1,
  });

  return events;
}

// ─── Delete Event ─────────────────────────────────────────────────────────────
export async function deleteEvent(req, eventId) {
  await dbConnect();

  const user = await getCurrentUser(req);

  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Check if user is the organizer
  if (event.organizerId.toString() !== user._id.toString()) {
    throw new Error("You are not authorized to delete this event");
  }

  // Delete all registrations for this event
  // Convex: .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
  await Registration.deleteMany({ eventId: event._id });

  // Delete the event
  await Event.findByIdAndDelete(eventId);

  // Update free event count if it was a free event
  if (event.ticketType === "free" && user.freeEventsCreated > 0) {
    await User.findByIdAndUpdate(user._id, {
      freeEventsCreated: user.freeEventsCreated - 1,
    });
  }

  return { success: true };
}