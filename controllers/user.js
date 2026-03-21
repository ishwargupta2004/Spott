import User from '@/models/User'

/**
 * 🔹 USER CREATED (Webhook)
 */
export const handleUserCreated = async (data) => {
  try {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
      created_at,
    } = data

    const email = email_addresses[0]?.email_address ?? ''
    const tokenIdentifier = id // ✅ Convex ke hisaab se (IMPORTANT)
    const fullName =
      [first_name, last_name].filter(Boolean).join(' ') || 'Anonymous'

    // 🔁 Upsert (Convex store jaisa behavior)
    const user = await User.findOneAndUpdate(
      { tokenIdentifier }, // ✅ primary lookup FIXED
      {
        email,
        tokenIdentifier,
        name: fullName,
        imageUrl: image_url,
        hasCompletedOnboarding: false,
        freeEventsCreated: 0,
        createdAt: created_at || Date.now(),
        updatedAt: Date.now(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    )

    console.log('✅ User created/updated:', user.tokenIdentifier)
    return user
  } catch (error) {
    console.error('❌ Error creating user:', error)
    throw error
  }
}

/**
 * 🔹 USER UPDATED (Webhook)
 */
export const handleUserUpdated = async (data) => {
  try {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
      updated_at,
    } = data

    const email = email_addresses[0]?.email_address ?? ''
    const tokenIdentifier = id
    const fullName =
      [first_name, last_name].filter(Boolean).join(' ') || 'Anonymous'

    let user = await User.findOne({ tokenIdentifier })

    // 🔁 Agar user exist karta hai → update only changed fields (Convex logic)
    if (user) {
      let updated = false

      if (user.name !== fullName) {
        user.name = fullName
        updated = true
      }

      if (user.email !== email) {
        user.email = email
        updated = true
      }

      if (user.imageUrl !== image_url) {
        user.imageUrl = image_url
        updated = true
      }

      if (updated) {
        user.updatedAt = updated_at || Date.now()
        await user.save()
      }

      console.log('✅ User updated:', user.tokenIdentifier)
      return user
    }

    // 🆕 Agar user nahi mila → create karo (Convex jaisa fallback)
    console.log('⚠️ User not found, creating new user')
    return await handleUserCreated(data)
  } catch (error) {
    console.error('❌ Error updating user:', error)
    throw error
  }
}

/**
 * 🔹 USER DELETED (Webhook)
 */
export const handleUserDeleted = async (data) => {
  try {
    const { id } = data

    if (id) {
      const result = await User.deleteOne({
        tokenIdentifier: id, // ✅ FIXED
      })

      if (result.deletedCount > 0) {
        console.log('✅ User deleted:', id)
      } else {
        console.log('⚠️ User not found for deletion:', id)
      }
    }
  } catch (error) {
    console.error('❌ Error deleting user:', error)
  }
}

/**
 * 🔹 Get Current User
 */
export const getCurrentUser = async (req, res) => {
  try {
    const identity = req.auth;

    if (!identity) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({
      tokenIdentifier: identity.userId,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * 🔹 Complete Onboarding
 */
export const completeOnboarding = async (req, res) => {
  try {
    const identity = req.auth;

    if (!identity) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { location, interests } = req.body;

    // Validation (Convex me implicit tha)
    if (!location || !location.city || !location.country) {
      return res.status(400).json({ error: "Invalid location data" });
    }

    if (!interests || interests.length < 3) {
      return res
        .status(400)
        .json({ error: "At least 3 interests required" });
    }

    const user = await User.findOne({
      tokenIdentifier: identity.userId,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.location = location;
    user.interests = interests;
    user.hasCompletedOnboarding = true;
    user.updatedAt = Date.now();

    await user.save();

    return res.status(200).json({
      message: "Onboarding completed",
      userId: user._id,
    });
  } catch (error) {
    console.error("Onboarding Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};