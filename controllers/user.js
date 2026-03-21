import User from "@/models/User";
import connectDB from "@/lib/db";

// 🔥 USER CREATED (Convex store → create part)
export const handleUserCreated = async (data) => {
  await connectDB();

  const identity = {
    tokenIdentifier: data.id,
    name: data.first_name + " " + data.last_name,
    email: data.email_addresses?.[0]?.email_address,
    pictureUrl: data.image_url,
  };

  // Check if already exists (safety)
  const existingUser = await User.findOne({
    tokenIdentifier: identity.tokenIdentifier,
  });

  if (existingUser) {
    return existingUser._id;
  }

  const newUser = await User.create({
    email: identity.email ?? "",
    tokenIdentifier: identity.tokenIdentifier,
    name: identity.name ?? "Anonymous",
    imageUrl: identity.pictureUrl,
    hasCompletedOnboarding: false,
    freeEventsCreated: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return newUser._id;
};



// 🔥 USER UPDATED (Convex store → update part)
export const handleUserUpdated = async (data) => {
  await connectDB();

  const identity = {
    tokenIdentifier: data.id,
    name: data.first_name + " " + data.last_name,
    email: data.email_addresses?.[0]?.email_address,
    pictureUrl: data.image_url,
  };

  const user = await User.findOne({
    tokenIdentifier: identity.tokenIdentifier,
  });

  if (!user) {
    throw new Error("User not found");
  }

  let updated = false;

  if (user.name !== identity.name) {
    user.name = identity.name ?? "Anonymous";
    updated = true;
  }

  if (user.email !== identity.email) {
    user.email = identity.email ?? "";
    updated = true;
  }

  if (user.imageUrl !== identity.pictureUrl) {
    user.imageUrl = identity.pictureUrl;
    updated = true;
  }

  if (updated) {
    user.updatedAt = Date.now();
    await user.save();
  }

  return user._id;
};



// 🔥 USER DELETED
export const handleUserDeleted = async (data) => {
  await connectDB();

  const tokenIdentifier = data.id;

  const user = await User.findOne({
    tokenIdentifier,
  });

  if (!user) {
    return null;
  }

  await User.deleteOne({ _id: user._id });

  return user._id;
};



// 🔥 Get current user (Convex query → API logic)
export const getCurrentUser = async () => {
  await connectDB();

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await User.findOne({
    tokenIdentifier: userId,
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};



// 🔥 Complete onboarding
export const completeOnboarding = async ({ location, interests }) => {
  await connectDB();

  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not found");
  }

  user.location = location;
  user.interests = interests;
  user.hasCompletedOnboarding = true;
  user.updatedAt = Date.now();

  await user.save();

  return user._id;
};