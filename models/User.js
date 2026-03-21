import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  state: { type: String },
  country: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, default: "" },
    tokenIdentifier: { type: String, required: true, unique: true },
    name: { type: String, default: "Anonymous" },
    imageUrl: { type: String },

    hasCompletedOnboarding: { type: Boolean, default: false },

    location: locationSchema,
    interests: [{ type: String }],

    freeEventsCreated: { type: Number, default: 0 },

    createdAt: { type: Number },
    updatedAt: { type: Number },
  },
  { versionKey: false }
);

userSchema.index({ tokenIdentifier: 1 });

export default mongoose.models.User || mongoose.model("User", userSchema);