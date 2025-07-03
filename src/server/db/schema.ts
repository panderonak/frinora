// import { pgTable, serial, text, timestamp, index } from 'drizzle-orm/pg-core';

// export const posts = pgTable(
//   'posts',
//   {
//     id: serial('id').primaryKey(),
//     name: text('name').notNull(),
//     createdAt: timestamp('createdAt').defaultNow().notNull(),
//     updatedAt: timestamp('updatedAt').defaultNow().notNull(),
//   },
//   (table) => [index('Post_name_idx').on(table.name)]
// );

// drizzle/schema.ts
import {
  pgTable,
  text,
  integer,
  timestamp,
  json,
  pgEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const planEnum = pgEnum('Plan', ['FREE', 'PRO']);
export const deliveryStatusEnum = pgEnum('DeliveryStatus', [
  'PENDING',
  'DELIVERED',
  'FAILED',
]);

export const users = pgTable(
  'User',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    externalId: text('externalId').unique().nullable(),
    quotaLimit: integer('quotaLimit').notNull(),
    plan: planEnum('plan').default('FREE'),
    email: text('email').unique().notNull(),
    apiKey: text('apiKey')
      .unique()
      .$defaultFn(() => createId()),
    discordId: text('discordId').nullable(),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (user) => ({
    emailApiKeyIndex: index('user_email_apiKey_idx').on(
      user.email,
      user.apiKey
    ),
  })
);

export const eventCategories = pgTable(
  'EventCategory',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text('name').notNull(),
    color: integer('color').notNull(),
    emoji: text('emoji').nullable(),
    userId: text('userId')
      .notNull()
      .references(() => users.id),

    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (category) => ({
    nameUserUnique: uniqueIndex('eventCategory_name_userId').on(
      category.name,
      category.userId
    ),
  })
);

export const events = pgTable(
  'Event',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    formattedMessage: text('formattedMessage').notNull(),

    userId: text('userId')
      .notNull()
      .references(() => users.id),

    name: text('name').notNull(),
    fields: json('fields').notNull(),
    deliveryStatus: deliveryStatusEnum('deliveryStatus').default('PENDING'),

    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),

    eventCategoryId: text('eventCategoryId')
      .nullable()
      .references(() => eventCategories.id),
  },
  (event) => ({
    createdAtIndex: index('event_createdAt_idx').on(event.createdAt),
  })
);

export const quotas = pgTable('Quota', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('userId')
    .notNull()
    .unique()
    .references(() => users.id),

  year: integer('year').notNull(),
  month: integer('month').notNull(),
  count: integer('count').default(0),

  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
