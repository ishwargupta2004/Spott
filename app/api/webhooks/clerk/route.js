import { verifyWebhook } from '@clerk/backend/webhooks'
import { NextRequest } from 'next/server'
import { createUser, updateUser, deleteUser } from '@/controllers/user'

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req)
    
    if (evt.type === 'user.created') {
      await createUser(evt.data)
    }
    
    if (evt.type === 'user.updated') {
      await updateUser(evt.data)
    }
    
    if (evt.type === 'user.deleted') {
      await deleteUser(evt.data)
    }
    
    return new Response('Webhook processed', { status: 200 })
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Invalid webhook', { status: 400 })
  }
}