import { FREE_QUOTA, PRO_QUOTA } from '@/config';
import { eventCategory, user as users } from '@/server/db/schema';
import { j, privateProcedure } from '@/server/jstack';
import { addMonths, startOfMonth } from 'date-fns';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const projectRouter = j.router({
  getUsage: privateProcedure.query(async ({ c, ctx }) => {
    const { db, user } = ctx;
    const currentDate = startOfMonth(new Date());

    const quota = await db.query.quota.findFirst({
      where: ({ userId, year, month }, { and, eq }) =>
        and(
          eq(userId, user.id),
          eq(year, currentDate.getFullYear()),
          eq(month, currentDate.getMonth() + 1)
        ),
    });

    const eventCount = quota?.count ?? 0;

    const categoryCount = db.$count(
      eventCategory,
      and(eq(eventCategory.userId, user.id))
    );

    const limits = user.plan === 'PRO' ? PRO_QUOTA : FREE_QUOTA;

    const resetDate = addMonths(currentDate, 1);

    return c.superjson({
      categoriesUsed: categoryCount,
      categoriesLimit: limits.maxEventCategories,
      eventsUsed: eventCount,
      eventsLimit: limits.maxEventsPerMonth,
      resetDate,
    });
  }),

  setDiscordId: privateProcedure
    .input(z.object({ discordId: z.string().max(20) }))
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;

      const { discordId } = input;

      await db.update(users).set({ discordId }).where(eq(users.id, user.id));

      return c.json({ success: true });
    }),
});
