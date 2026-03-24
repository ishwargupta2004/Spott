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
      unique: true,   // index("by_slug", ["slug"]) ka replacement
      lowercase: true,
      trim: true,
    },

    // ─── Organizer ────────────────────────────────────────────────
    // Convex mein v.id("users") tha, MongoDB mein ObjectId reference
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,   // index("by_organizer", ["organizerId"]) neeche hai
    },

    organizerName: {
      type: String,
      required: true,
      trim: true,
    },

    // ─── Event Details ────────────────────────────────────────────
    category: {
      type: String,
      required: true,   // index("by_category", ["category"]) neeche hai
    },

    tags: {
      type: [String],
      default: [],
    },

    // ─── Date & Time ──────────────────────────────────────────────
    // Convex mein v.number() (Unix timestamp) tha, MongoDB mein Date store karo — better querying
    startDate: {
      type: Date,
      required: true,   // index("by_start_date", ["startDate"]) neeche hai
    },

    endDate: {
      type: Date,
      required: true,
    },

    timezone: {
      type: String,
      required: true,
    },

    // ─── Location ─────────────────────────────────────────────────
    locationType: {
      type: String,
      enum: ["physical", "online"],   // v.union(v.literal("physical"), v.literal("online"))
      required: true,
    },

    venue: {
      type: String,
      default: null,
    },

    address: {
      type: String,
      default: null,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      default: null,  // optional
    },

    country: {
      type: String,
      required: true,
    },

    // ─── Capacity & Ticketing ─────────────────────────────────────
    capacity: {
      type: Number,
      required: true,
    },

    ticketType: {
      type: String,
      enum: ["free", "paid"],   // v.union(v.literal("free"), v.literal("paid"))
      required: true,
    },

    ticketPrice: {
      type: Number,
      default: null,  // only for paid events
    },

    registrationCount: {
      type: Number,
      default: 0,
    },

    // ─── Customization ────────────────────────────────────────────
    coverImage: {
      type: String,
      default: null,
    },

    themeColor: {
      type: String,
      default: null,
    },
  },
  {
    // ─── Timestamps ───────────────────────────────────────────────
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────
// Convex ke saare indexes reproduce kiye hain:
eventSchema.index({ organizerId: 1 });          // index("by_organizer", ["organizerId"])
eventSchema.index({ category: 1 });             // index("by_category", ["category"])
eventSchema.index({ startDate: 1 });            // index("by_start_date", ["startDate"])
eventSchema.index({ slug: 1 }, { unique: true }); // index("by_slug", ["slug"])

// Convex ka searchIndex("search_title", { searchField: "title" }) ka replacement
// MongoDB Atlas use kar rahe ho toh Atlas Search use karo
// Local/self-hosted ke liye text index:
eventSchema.index({ title: "text", description: "text" }); // full-text search

// ─── Model ────────────────────────────────────────────────────────
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;