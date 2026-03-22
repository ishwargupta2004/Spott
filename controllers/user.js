import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/User";
import dbConnect from "@/lib/db";

// ─── Create User (Webhook: user.created) ─────────────────────────────────────
export async function createUser(data) {
  await dbConnect();

  // Duplicate check — agar already exist karta hai toh create mat karo
  const existingUser = await User.findOne({ tokenIdentifier: data.id });
  if (existingUser) return existingUser._id;

  const user = await User.create({
    email: data.email_addresses?.[0]?.email_address ?? "",
    tokenIdentifier: data.id,             // Clerk user ID — sirf "user_xxx" format
    name:
      `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "Anonymous",
    imageUrl: data.image_url ?? null,
    hasCompletedOnboarding: false,
    freeEventsCreated: 0,
  });

  return user._id;
}

// ─── Update User (Webhook: user.updated) ─────────────────────────────────────
export async function updateUser(data) {
  await dbConnect();

  const existingUser = await User.findOne({ tokenIdentifier: data.id });
  if (!existingUser) return;

  const incomingName =
    `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "Anonymous";
  const incomingEmail = data.email_addresses?.[0]?.email_address ?? "";
  const incomingImageUrl = data.image_url ?? null;

  // Sirf changed fields update karo
  const updates = {};
  if (existingUser.name !== incomingName)           updates.name = incomingName;
  if (existingUser.email !== incomingEmail)         updates.email = incomingEmail;
  if (existingUser.imageUrl !== incomingImageUrl)   updates.imageUrl = incomingImageUrl;

  if (Object.keys(updates).length > 0) {
    await User.findOneAndUpdate({ tokenIdentifier: data.id }, updates);
  }
}

// ─── Delete User (Webhook: user.deleted) ─────────────────────────────────────
export async function deleteUser(data) {
  await dbConnect();

  await User.findOneAndDelete({ tokenIdentifier: data.id });
}

// ─── Get Current Authenticated User ──────────────────────────────────────────
export async function getCurrentUser(req) {
  await dbConnect();

  const { userId } = getAuth(req);   // userId = "user_xxx" format — webhook se jo store hua wahi

  if (!userId) {
    return null;
  }

  const user = await User.findOne({ tokenIdentifier: userId });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// ─── Complete Onboarding (Attendee Preferences) ───────────────────────────────
export async function completeOnboarding(req, { location, interests }) {
  await dbConnect();

  const user = await getCurrentUser(req);

  await User.findByIdAndUpdate(user._id, {
    location,                   // { city, state (optional), country }
    interests,                  // array of strings, min 3
    hasCompletedOnboarding: true,
  });

  return user._id;
}