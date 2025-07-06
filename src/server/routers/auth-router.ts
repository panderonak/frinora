import { user as users } from '@/server/db/schema';
import { j, publicProcedure } from '@/server/jstack';
import { currentUser } from '@clerk/nextjs/server';

export const authRouter = j.router({
  getDatabaseSyncStatus: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;
    const auth = await currentUser();

    if (!auth) {
      return c.json({ isSynced: false });
    }

    const user = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user?.externalId, auth.id),
    });

    if (!user) {
      await db.insert(users).values({
        quotaLimit: 100,
        externalId: auth.id,
        email: auth.emailAddresses[0].emailAddress,
      });

      return c.json({ isSynced: true });
    }

    return c.json({ isSynced: true });
  }),
});
