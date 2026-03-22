import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ─── Clerk Auth ───────────────────────────────────────────────
    clerkId: {
      type: String,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Clerk ka unique user ID — primary auth lookup (replaces Convex index "by_token")
    tokenIdentifier: {
      type: String,
      required: true,
      unique: true, // index("by_token", ["tokenIdentifier"]) ka replacement
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
      state: { type: String, default: null },   // optional
      country: { type: String },
    },

    interests: {
      type: [String],   // Min 3 categories (validation app-level pe karna)
      default: [],
    },

    // ─── Organizer Tracking (User Subscription) ───────────────────
    freeEventsCreated: {
      type: Number,
      default: 0,   // Track free event limit (1 free)
    },
  },
  {
    // ─── Timestamps ───────────────────────────────────────────────
    // Convex mein createdAt/updatedAt manually number the, yahan Mongoose auto handle karega
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────
// Convex ka .index("by_token", ["tokenIdentifier"]) — primary auth lookup
userSchema.index({ tokenIdentifier: 1 });   // already unique above, explicit index for clarity
userSchema.index({ email: 1 });

// ─── Model ────────────────────────────────────────────────────────
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;