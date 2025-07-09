import { CATEGORY_NAME_VALIDATOR } from '@/lib/validators/category-validator';
import { event, eventCategory } from '@/server/db/schema';
import { j, privateProcedure } from '@/server/jstack';
import { startOfMonth } from 'date-fns';
import { and, eq, gte } from 'drizzle-orm';
import { z } from 'zod';

export const categoryRouter = j.router({
  getEventCategories: privateProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;

    const categories = await db.query.eventCategory.findMany({
      where: ({ userId }, { eq }) => eq(userId, ctx.user.id),
      columns: {
        id: true,
        name: true,
        emoji: true,
        color: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: ({ updatedAt }, { desc }) => desc(updatedAt),
    });

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const now = new Date();
        const firstDayOfMonth = startOfMonth(now);

        const [uniqueFieldCount, eventsCount, lastPing] = await Promise.all([
          db.query.event
            .findMany({
              where: ({ eventCategoryId, createdAt }, { eq, gte, and }) =>
                and(
                  eq(eventCategoryId, category.id),
                  gte(createdAt, firstDayOfMonth)
                ),
              columns: { fields: true, createdAt: true },
            })
            .then((events) => {
              const fieldNames = new Set<string>();

              events.forEach((event) => {
                Object.keys(event.fields as object).forEach((fieldName) => {
                  fieldNames.add(fieldName);
                });
              });
              return fieldNames.size;
            }),

          db.$count(
            event,
            and(
              eq(event.eventCategoryId, category.id),
              gte(event.createdAt, firstDayOfMonth)
            )
          ),

          db.query.event.findFirst({
            where: ({ eventCategoryId }, { eq }) =>
              eq(eventCategoryId, category.id),
            orderBy: ({ createdAt }, { desc }) => desc(createdAt),
            columns: { createdAt: true },
          }),
        ]);

        return {
          ...category,
          uniqueFieldCount,
          eventsCount,
          lastPing: lastPing?.createdAt || null,
        };
      })
    );

    return c.superjson({ categories: categoriesWithCount });
  }),

  deleteCategory: privateProcedure
    .input(z.object({ name: CATEGORY_NAME_VALIDATOR }))
    .mutation(async ({ c, ctx, input }) => {
      const { name } = input;
      const { db, user } = ctx;

      await db
        .delete(eventCategory)
        .where(
          and(eq(eventCategory.name, name), eq(eventCategory.userId, user.id))
        );

      return c.json({ success: true });
    }),
});
