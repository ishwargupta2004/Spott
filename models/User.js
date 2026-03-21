import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    city: String,
    state: String,
    country: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    // Clerk auth
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // ✅ avoids crash if email missing
    },

    name: {
      type: String,
      default: "Anonymous", // ✅ safe fallback
    },

    imageUrl: String,

    // Onboarding
    hasCompletedOnboarding: {
      type: Boolean,
      default: false,
    },

    // Location
    location: locationSchema,

    // Interests
    interests: [String],

    // Organizer tracking
    freeEventsCreated: {
      type: Number,
      default: 0,
    },

    // Timestamps (Convex compatible)
    createdAt: {
      type: Number,
      default: () => Date.now(),
    },
    updatedAt: {
      type: Number,
      default: () => Date.now(),
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);