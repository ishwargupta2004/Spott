import User from "@/models/User";
import connectDB from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// =========================
// 🔥 WEBHOOK FUNCTIONS
// =========================

// USER CREATED
export const handleUserCreated = async (data) => {
  await connectDB();

  const { id, email_addresses, first_name, last_name, image_url } = data;

  await User.create({
    clerkId: id,
    email: email_addresses[0]?.email_address ?? '',
    firstName: first_name,
    lastName: last_name,
    imageUrl: image_url,
    hasCompletedOnboarding: false,
    freeEventsCreated: 0,
  });
};

// USER UPDATED
export const handleUserUpdated = async (data) => {
  await connectDB();

  const { id, email_addresses, first_name, last_name, image_url } = data;

  const user = await User.findOneAndUpdate(
    { clerkId: id },
    {
      email: email_addresses[0]?.email_address ?? '',
      firstName: first_name,
      lastName: last_name,
      imageUrl: image_url,
    },
    { new: true }
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user._id;
};

// USER DELETED
export const handleUserDeleted = async (data) => {
  await connectDB();

  const { id } = data;

  if (id) {
    await User.deleteOne({ clerkId: id }).catch(() => {});
  }
};

// =========================
// 🔥 ORIGINAL LOGIC
// =========================

// GET CURRENT USER
export const getCurrentUser = async () => {
  await connectDB();

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await User.findOne({
    clerkId: userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// COMPLETE ONBOARDING
export const completeOnboarding = async ({ location, interests }) => {
  await connectDB();

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not found");
  }

  user.location = location;
  user.interests = interests;
  user.hasCompletedOnboarding = true;

  await user.save();

  return user._id;
};