const userSchema = new mongoose.Schema(
  {
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
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    hasCompletedOnboarding: {
      type: Boolean,
      default: false,
    },
    location: locationSchema,
    interests: [{ type: String }],
    freeEventsCreated: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);