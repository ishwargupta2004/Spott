import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    // Clerk auth
    clerkId: { type: String, required: true, unique: true, index: true },

    email: {
      type: String,
      unique:true,
      required: true,
    },
    tokenIdentifier: {
      type: String,
      required: true,
      index: true, // by_token index
    },
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },

    // Onboarding
    hasCompletedOnboarding: {
      type: Boolean,
      required: true,
    },

    // Location
    location: locationSchema,

    // Interests
    interests: [
      {
        type: String,
      },
    ],

    // Organizer tracking
    freeEventsCreated: {
      type: Number,
      required: true,
    },

    // Timestamps (EXACT same as Convex)
    createdAt: {
      type: Number,
      required: true,
    },
    updatedAt: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);