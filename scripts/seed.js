import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import SAMPLE_EVENTS from "@/data/eventdata";

// ─── Helper Functions ─────────────────────────────────────────────────────────
function getRandomFutureDate(minDays = 7, maxDays = 90) {
  const now = Date.now();
  const randomDays = Math.floor(Math.random() * (maxDays - minDays) + minDays);
  return now + randomDays * 24 * 60 * 60 * 1000;
}

function getEventEndTime(startTime) {
  const durationHours = Math.floor(Math.random() * 3) + 2;
  return startTime + durationHours * 60 * 60 * 1000;
}

function generateSlug(title) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    `-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
  );
}

// ─── Run: Seed Events ─────────────────────────────────────────────────────────
export async function run() {
  await dbConnect();

  // Pehle get or create default organizer user
  let organizer = await User.findOne();

  if (!organizer) {
    // Agar koi user nahi hai toh default organizer create karo
    organizer = await User.create({
      email: "organizer@eventhub.com",
      tokenIdentifier: "seed-user-token",
      name: "EventHub Team",
      hasCompletedOnboarding: true,
      location: {
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
      },
      interests: ["tech", "music", "business"],
      freeEventsCreated: 0,
    });
  }

  const createdEvents = [];

  for (const eventData of SAMPLE_EVENTS) {
    const startDate = new Date(getRandomFutureDate());
    const endDate = new Date(getEventEndTime(startDate.getTime()));
    const registrationCount = Math.floor(
      Math.random() * eventData.capacity * 0.7
    );

    const event = {
      ...eventData,
      slug: generateSlug(eventData.title),
      organizerId: organizer._id,
      organizerName: organizer.name,
      startDate,
      endDate,
      timezone: "Asia/Kolkata",
      locationType: "physical",
      country: "India",
      registrationCount,
    };

    await Event.create(event);
    createdEvents.push(eventData.title);
  }

  console.log(`✅ Successfully seeded ${createdEvents.length} events!`);
  return {
    success: true,
    count: createdEvents.length,
    events: createdEvents,
  };
}

// ─── Clear: Delete All Events & Registrations ─────────────────────────────────
export async function clear() {
  await dbConnect();

  const events = await Event.find();
  let count = 0;

  for (const event of events) {
    // Pehle event ki saari registrations delete karo
    await Registration.deleteMany({ eventId: event._id });
    await Event.findByIdAndDelete(event._id);
    count++;
  }

  console.log(`🗑️ Cleared ${count} events`);
  return { success: true, deleted: count };
}