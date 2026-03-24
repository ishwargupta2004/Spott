import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ─── Clerk Auth ───────────────────────────────────────────────
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Clerk ka unique user ID — primary auth lookup
    tokenIdentifier: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      default: null,
    },

    // ─── Onboarding ───────────────────────────────────────────────
    hasCompletedOnboarding: {
      type: Boolean,
      default: false,
    },

    // ─── Attendee Preferences (from onboarding) ───────────────────
    location: {
      city: { type: String },
      state: { type: String, default: null },
      country: { type: String },
    },

    interests: {
      type: [String],
      default: [],
    },

    // ─── Organizer Tracking (User Subscription) ───────────────────
    freeEventsCreated: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────
userSchema.index({ tokenIdentifier: 1 });
userSchema.index({ email: 1 });

// ─── Model ────────────────────────────────────────────────────────
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;