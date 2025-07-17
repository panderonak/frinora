import { FREE_QUOTA, PRO_QUOTA } from '@/config';
import { DiscordClient } from '@/lib/discord-client';
import { CATEGORY_NAME_VALIDATOR } from '@/lib/validators/category-validator';
import { db } from '@/server/db/db';
import { event as events, quota } from '@/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const REQUEST_VALIDATOR = z
  .object({
    category: CATEGORY_NAME_VALIDATOR,
    fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
    description: z.string().optional(),
  })
  .strict();

export const POST = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get('Authorization');
    console.log(authHeader);
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          message: "Invalid auth header format. Expected: 'Bearer [API_KEY]'",
        },
        { status: 401 }
      );
    }

    const APIKEY = authHeader.split(' ')[1];

    if (!APIKEY || APIKEY.trim() === '') {
      return NextResponse.json(
        { message: 'Invalid API key.' },
        { status: 401 }
      );
    }

    const user = await db.query.user.findFirst({
      where: ({ apiKey }, { eq }) => eq(apiKey, APIKEY),
      with: {
        eventCategories: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid API key.' },
        { status: 401 }
      );
    }

    if (!user.discordId) {
      return NextResponse.json(
        {
          message: 'Please enter your discord ID in your account settings.',
        },
        { status: 403 }
      );
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const userQuota = await db.query.quota.findFirst({
      where: ({ userId, month, year }, { and, eq }) =>
        and(
          eq(userId, user.id),
          eq(month, currentMonth),
          eq(year, currentYear)
        ),
    });

    const quotaLimit =
      user.plan === 'FREE'
        ? FREE_QUOTA.maxEventsPerMonth
        : PRO_QUOTA.maxEventsPerMonth;

    if (
      userQuota &&
      typeof userQuota?.count === 'number' &&
      userQuota.count >= quotaLimit
    ) {
      return NextResponse.json(
        {
          message:
            'Monthly quota reached. Please upgrade your plan for more events.',
        },
        { status: 429 }
      );
    }

    const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN);

    const dmChannel = await discord.createDM(user.discordId);

    let requestData: unknown;

    try {
      requestData = await req.json();
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: 'Invalid JSON request body.',
        },
        { status: 400 }
      );
    }

    const validationResult = REQUEST_VALIDATOR.parse(requestData);

    const category = user.eventCategories.find(
      (category) => category.name === validationResult.category
    );

    if (!category) {
      return NextResponse.json(
        {
          message: `You dont have a category named "${validationResult.category}"`,
        },
        { status: 404 }
      );
    }

    const eventData = {
      title: `${category.emoji || '🔔'} ${
        category.name.charAt(0).toUpperCase() + category.name.slice(1)
      }`,
      description:
        validationResult.description ||
        `A new ${category.name} event has occurred!`,
      color: category.color,
      timestamp: new Date().toISOString(),
      fields: Object.entries(validationResult.fields || {}).map(
        ([key, value]) => {
          return {
            name: key,
            value: String(value),
            inline: true,
          };
        }
      ),
    };

    const [event] = await db
      .insert(events)
      .values({
        name: category.name,
        formattedMessage: `${eventData.title}\n\n${eventData.description}`,
        userId: user.id,
        fields: validationResult.fields || {},
        eventCategoryId: category.id,
      })
      .returning({ id: events.id });

    try {
      await discord.sendEmbed(dmChannel.id, eventData);

      await db
        .update(events)
        .set({ deliveryStatus: 'DELIVERED' })
        .where(eq(events.id, event.id));

      await db
        .insert(quota)
        .values({
          userId: user.id,
          month: currentMonth,
          year: currentYear,
          count: 1,
        })
        .onConflictDoUpdate({
          target: [quota.userId, quota.month, quota.year],
          set: {
            count: sql`${quota.count} + 1`,
          },
        });
    } catch (error) {
      console.error(error);

      await db
        .update(events)
        .set({
          deliveryStatus: 'FAILED',
        })
        .where(eq(events.id, event.id));

      return NextResponse.json(
        {
          message: 'Error processing event',
          eventId: event.id,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Event processed successfully.',
      eventId: event.id,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 422 });
    }

    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 }
    );
  }
};
