import { stripe } from '@/lib/stripe';
import { db } from '@/server/db/db';
import { user } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  const event = stripe.webhooks.constructEvent(
    body,
    signature ?? '',
    process.env.STRIPE_WEBHOOK_SECRET ?? ''
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const { userId } = session.metadata || { userId: null };

    if (!userId) {
      return new Response('Invalid metadata', { status: 400 });
    }

    await db.update(user).set({ plan: 'PRO' }).where(eq(user.id, userId));
  }

  return new NextResponse('OK');
}
