import { parseColor } from '@/lib/utils';
import { CATEGORY_NAME_VALIDATOR } from '@/lib/validators/category-validator';
import { event, eventCategory } from '@/server/db/schema';
import { j, privateProcedure } from '@/server/jstack';
import { startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { and, eq, gte } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
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

  createEventCategory: privateProcedure
    .input(
      z.object({
        name: CATEGORY_NAME_VALIDATOR,
        color: z
          .string()
          .min(1, 'Color is required')
          .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format.'),
        emoji: z.string().emoji('Invalid emoji').optional(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;
      const { color, name, emoji } = input;

      const newEventCategory = await db
        .insert(eventCategory)
        .values({
          name: name.toLowerCase(),
          color: parseColor(color),
          emoji,
          userId: user.id,
        })
        .returning();

      return c.json({ newEventCategory });
    }),

  insertQuickStartCategories: privateProcedure.mutation(async ({ c, ctx }) => {
    const { db, user } = ctx;

    const categories = db
      .insert(eventCategory)
      .values(
        [
          { name: 'bug', emoji: '🐞', color: 0xff6b6b },
          { name: 'sale', emoji: '🤑', color: 0xffeb3b },
          { name: 'question', emoji: '🤔', color: 0x6c5ce7 },
        ].map((category) => ({
          ...category,
          userId: user.id,
        }))
      )
      .onConflictDoNothing();

    return c.json({ success: true, count: (await categories).rowCount });
  }),

  pollCategory: privateProcedure
    .input(z.object({ name: CATEGORY_NAME_VALIDATOR }))
    .query(async ({ c, ctx, input }) => {
      const { db, user } = ctx;

      const { name } = input;

      const category = await db.query.eventCategory.findFirst({
        where: ({ name, userId }, { eq, and }) =>
          and(eq(name, name), eq(userId, user.id)),
      });

      if (!category) {
        throw new HTTPException(404, {
          message: `Category '${name}' not found.`,
        });
      }

      const count = await db.$count(
        event,
        and(eq(event.eventCategoryId, category.id), eq(event.userId, user.id))
      );

      if (!count)
        throw new HTTPException(404, {
          message: `Category '${name}' has no events.`,
        });

      const hasEvents = count > 0;

      return c.json({ hasEvents });
    }),

  getEventsByCategoryName: privateProcedure
    .input(
      z.object({
        name: CATEGORY_NAME_VALIDATOR,
        page: z.number(),
        limit: z.number().max(30),
        timeRange: z.enum(['today', 'week', 'month']),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { limit, name, page, timeRange } = input;

      const { db, user } = ctx;

      const now = new Date();

      let startDate: Date;

      switch (timeRange) {
        case 'today':
          startDate = startOfDay(now);
          break;
        case 'week':
          startDate = startOfWeek(now, { weekStartsOn: 0 });
          break;
        case 'month':
          startDate = startOfMonth(now);
          break;
      }

      const [events, eventsCount, uniqueFieldCount] = await Promise.all([
        db.query.event.findMany({
          with: {
            eventCategory: true,
          },
          where: ({ createdAt }, { and, eq }) =>
            and(
              eq(eventCategory.name, name),
              eq(eventCategory.userId, user.id),
              gte(createdAt, startDate)
            ),
          orderBy: ({ createdAt }, { desc }) => desc(createdAt),
          limit,
          offset: (page - 1) * limit,
        }),

        db.$count(
          event,
          and(
            eq(eventCategory.name, name),
            eq(eventCategory.userId, user.id),
            gte(event.createdAt, startDate)
          )
        ),

        db.query.event
          .findMany({
            with: {
              eventCategory: true,
            },
            where: ({ createdAt }, { eq, and, gte }) =>
              and(
                eq(eventCategory.name, name),
                eq(eventCategory.userId, user.id),
                gte(createdAt, startDate)
              ),
            columns: {
              fields: true,
            },
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
      ]);

      return c.superjson({ events, eventsCount, uniqueFieldCount });
    }),
});
