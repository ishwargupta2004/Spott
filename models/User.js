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
    // Clerk auth - clerkId is the recommended field name
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
      default: false,
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
      default: 0,
    },
  },
  {
    timestamps: true, // Mongoose automatically creates createdAt and updatedAt
    versionKey: false,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);