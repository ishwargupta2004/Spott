import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true, // ✅ important
      index: true,
    },

    // Organizer
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    organizerName: {
      type: String,
      required: true,
    },

    // Event details
    category: {
      type: String,
      required: true,
      index: true,
    },

    tags: [String], // ✅ simple & flexible

    // Date & Time
    startDate: {
      type: Number,
      required: true,
      index: true,
    },

    endDate: {
      type: Number,
      required: true,
    },

    timezone: {
      type: String,
      required: true,
    },

    // Location
    locationType: {
      type: String,
      enum: ["physical", "online"],
      required: true,
    },

    venue: String,
    address: String,

    city: {
      type: String,
      required: true,
    },

    state: String,

    country: {
      type: String,
      required: true,
    },

    // Capacity & Ticketing
    capacity: {
      type: Number,
      required: true,
    },

    ticketType: {
      type: String,
      enum: ["free", "paid"],
      required: true,
    },

    ticketPrice: {
      type: Number,
      default: 0, // ✅ safe for free events
    },

    registrationCount: {
      type: Number,
      default: 0, // ✅ important fix
    },

    // Customization
    coverImage: String,
    themeColor: String,

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

// 🔍 Search index
eventSchema.index({ title: "text" });

export default mongoose.models.Event || mongoose.model("Event", eventSchema);