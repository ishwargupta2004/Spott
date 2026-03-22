import { verifyWebhook } from '@clerk/backend/webhooks'
import connectDB from '@/lib/db'
import { handleUserCreated, handleUserUpdated, handleUserDeleted } from '@/controllers/user'

export async function POST(req) {
  try {
    console.log("🔥 WEBHOOK HIT");

    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET
    });

    console.log("📌 EVENT TYPE:", evt.type);
    console.log("📦 EVENT DATA:", evt.data);

    await connectDB();

    if (evt.type === 'user.created') {
      console.log("✅ Creating user...");
      await handleUserCreated(evt.data);
    }

    if (evt.type === 'user.updated') {
      console.log("✏️ Updating user...");
      await handleUserUpdated(evt.data);
    }

    if (evt.type === 'user.deleted') {
      console.log("🗑️ Deleting user...");
      await handleUserDeleted(evt.data);
    }

    return new Response('Webhook processed', { status: 200 });

  } catch (err) {
    console.error('❌ Webhook error:', err);
    return new Response('Invalid webhook', { status: 400 });
  }
}