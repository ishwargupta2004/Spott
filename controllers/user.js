import User from "@/models/User";
import connectDB from "@/lib/db"; // assume db connection file
import { auth } from "@clerk/nextjs/server";

// 🔥 Store / Update user (Convex store → API logic)
export const storeUser = async () => {
  await connectDB();

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Called storeUser without authentication present");
  }

  const identity = {
    tokenIdentifier: userId,
    name: sessionClaims?.name,
    email: sessionClaims?.email,
    pictureUrl: sessionClaims?.picture,
  };

  // 🔹 Find user by tokenIdentifier (same as by_token index)
  const user = await User.findOne({
    tokenIdentifier: identity.tokenIdentifier,
  });

  if (user) {
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
  }

  // 🔹 Create new user (same defaults as Convex)
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