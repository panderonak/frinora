import { createCheckoutSession } from '@/lib/stripe';
import { j, privateProcedure } from '@/server/jstack';

export const paymentRouter = j.router({
  createCheckoutSession: privateProcedure.mutation(async ({ c, ctx }) => {
    const { user } = ctx;

    const session = await createCheckoutSession({
      userEmail: user.email,
      userId: user.id,
    });

    return c.json({ url: session.url });
  }),

  getUserPlan: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx;

    return c.json({ plan: user.plan });
  }),
});
