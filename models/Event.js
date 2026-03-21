import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      index: true, // by_slug
    },

    // Organizer
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // by_organizer
    },
    organizerName: {
      type: String,
      required: true,
    },

    // Event details
    category: {
      type: String,
      required: true,
      index: true, // by_category
    },
    tags: [
      {
        type: String,
        required: true,
      },
    ],

    // Date & Time
    startDate: {
      type: Number,
      required: true,
      index: true, // by_start_date
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
    venue: {
      type: String,
    },
    address: {
      type: String,
    },
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
    },
    registrationCount: {
      type: Number,
      required: true,
    },

    // Customization
    coverImage: {
      type: String,
    },
    themeColor: {
      type: String,
    },

    // Timestamps
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

// (Optional) Text index for search_title
eventSchema.index({ title: "text" });

export default mongoose.models.Event || mongoose.model("Event", eventSchema);