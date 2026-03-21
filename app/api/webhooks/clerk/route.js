import { verifyWebhook } from '@clerk/backend/webhooks' 
import connectDB from '@/lib/db'
import { handleUserCreated, handleUserUpdated, handleUserDeleted } from '@/controllers/user'

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req)
    
    await connectDB()

    if (evt.type === 'user.created') {
      await handleUserCreated(evt.data)
    }

    if (evt.type === 'user.updated') {
      await handleUserUpdated(evt.data)
    }

    if (evt.type === 'user.deleted') {
      await handleUserDeleted(evt.data)
    }

    return new Response('Webhook processed', { status: 200 })
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Invalid webhook', { status: 400 })
  }
}