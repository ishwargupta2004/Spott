import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    // ─── References ───────────────────────────────────────────────
    // Convex mein v.id("events") / v.id("users") tha
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ─── Attendee Info ────────────────────────────────────────────
    attendeeName: {
      type: String,
      required: true,
      trim: true,
    },

    attendeeEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // ─── QR Code for Entry ────────────────────────────────────────
    qrCode: {
      type: String,
      required: true,
      unique: true,   // index("by_qr_code", ["qrCode"]) ka replacement — QR unique hona chahiye
    },

    // ─── Check-in ─────────────────────────────────────────────────
    checkedIn: {
      type: Boolean,
      default: false,
    },

    checkedInAt: {
      type: Date,
      default: null,  // optional — sirf tab set hoga jab check-in ho
    },

    // ─── Status ───────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],   // v.union(v.literal(...))
      default: "confirmed",
    },

    // registeredAt Convex mein manually number tha
    // timestamps: true se createdAt automatically aa jayega
    // lekin agar alag field chahiye explicit:
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // ─── Timestamps ───────────────────────────────────────────────
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────
// Convex ke saare indexes reproduce kiye hain:
registrationSchema.index({ eventId: 1 });             // index("by_event", ["eventId"])
registrationSchema.index({ userId: 1 });              // index("by_user", ["userId"])
registrationSchema.index({ eventId: 1, userId: 1 });  // index("by_event_user", ["eventId", "userId"])
registrationSchema.index({ qrCode: 1 }, { unique: true }); // index("by_qr_code", ["qrCode"])

// ─── Model ────────────────────────────────────────────────────────
const Registration =
  mongoose.models.Registration ||
  mongoose.model("Registration", registrationSchema);

export default Registration;