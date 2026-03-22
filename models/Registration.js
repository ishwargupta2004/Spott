import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true, // by_event
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // by_user
    },

    // Attendee info
    attendeeName: {
      type: String,
      required: true,
    },
    attendeeEmail: {
      type: String,
      required: true,
    },

    // QR Code
    qrCode: {
      type: String,
      required: true,
      unique: true, // by_qr_code
      index: true,
    },

    // Check-in
    checkedIn: {
      type: Boolean,
      required: true,
    },
    checkedInAt: {
      type: Number,
    },

    // Status
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      required: true,
    },

    registeredAt: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

// Compound index (by_event_user)
registrationSchema.index({ eventId: 1, userId: 1 });

export default mongoose.models.Registration ||
  mongoose.model("Registration", registrationSchema);