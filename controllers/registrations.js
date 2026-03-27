import Registration from "@/models/Registration";
import Event from "@/models/Event";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/controllers/user";

// Generate unique QR code ID
function generateQRCode() {
  return `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// ─── Register for an event ────────────────────────────────────────────────────
export async function registerForEvent(req, { eventId, attendeeName, attendeeEmail }) {
  await dbConnect();

  const user = await getCurrentUser(req);

  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Check if event is full
  if (event.registrationCount >= event.capacity) {
    throw new Error("Event is full");
  }

  // Check if user already registered
  const existingRegistration = await Registration.findOne({
    eventId,
    userId: user._id,
  });

  if (existingRegistration) {
    throw new Error("You are already registered for this event");
  }

  // Create registration
  const qrCode = generateQRCode();
  const registration = await Registration.create({
    eventId,
    userId: user._id,
    attendeeName,
    attendeeEmail,
    qrCode,
    checkedIn: false,
    status: "confirmed",
    registeredAt: Date.now(),
  });

  // Update event registration count
  await Event.findByIdAndUpdate(eventId, {
    $inc: { registrationCount: 1 },
  });

  return registration._id;
}

// ─── Check if user is registered for an event ─────────────────────────────────
export async function checkRegistration(req, { eventId }) {
  await dbConnect();

  const user = await getCurrentUser(req);

  if (!user) return null;

  const registration = await Registration.findOne({
    eventId,
    userId: user._id,
  });

  return registration;
}

// ─── Get user's registrations (tickets) ───────────────────────────────────────
export async function getMyRegistrations(req) {
  await dbConnect();

  const user = await getCurrentUser(req);

  const registrations = await Registration.find({ userId: user._id })
    .sort({ registeredAt: -1 });

  // Fetch event details for each registration
  const registrationsWithEvents = await Promise.all(
    registrations.map(async (reg) => {
      const event = await Event.findById(reg.eventId);
      return {
        ...reg.toObject(),
        event,
      };
    })
  );

  return registrationsWithEvents;
}

// ─── Cancel registration ───────────────────────────────────────────────────────
export async function cancelRegistration(req, { registrationId }) {
  await dbConnect();

  const user = await getCurrentUser(req);

  const registration = await Registration.findById(registrationId);
  if (!registration) {
    throw new Error("Registration not found");
  }

  // Check if user owns this registration
  if (registration.userId.toString() !== user._id.toString()) {
    throw new Error("You are not authorized to cancel this registration");
  }

  const event = await Event.findById(registration.eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Update registration status
  await Registration.findByIdAndUpdate(registrationId, {
    status: "cancelled",
  });

  // Decrement event registration count
  if (event.registrationCount > 0) {
    await Event.findByIdAndUpdate(registration.eventId, {
      $inc: { registrationCount: -1 },
    });
  }

  return { success: true };
}

// ─── Get registrations for an event (for organizers) ──────────────────────────
export async function getEventRegistrations(req, { eventId }) {
  await dbConnect();

  const user = await getCurrentUser(req);

  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Check if user is the organizer
  if (event.organizerId.toString() !== user._id.toString()) {
    throw new Error("You are not authorized to view registrations");
  }

  const registrations = await Registration.find({ eventId });

  return registrations;
}

// ─── Check-in attendee with QR code ───────────────────────────────────────────
export async function checkInAttendee(req, { qrCode }) {
  await dbConnect();

  const user = await getCurrentUser(req);

  const registration = await Registration.findOne({ qrCode });

  if (!registration) {
    throw new Error("Invalid QR code");
  }

  const event = await Event.findById(registration.eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Check if user is the organizer
  if (event.organizerId.toString() !== user._id.toString()) {
    throw new Error("You are not authorized to check in attendees");
  }

  // Check if already checked in
  if (registration.checkedIn) {
    return {
      success: false,
      message: "Already checked in",
      registration,
    };
  }

  // Check in
  await Registration.findByIdAndUpdate(registration._id, {
    checkedIn: true,
    checkedInAt: Date.now(),
  });

  return {
    success: true,
    message: "Check-in successful",
    registration: {
      ...registration.toObject(),
      checkedIn: true,
      checkedInAt: Date.now(),
    },
  };
}