import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

// Note: We can define the structure of the JSON by specifying its type using $type.

export const planEnum = pgEnum('Plan', ['FREE', 'PRO']);

export const user = pgTable(
  'user',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    externalId: text('externalId').unique(),
    quotaLimit: integer('quotaLimit').notNull(),
    plan: planEnum('plan').default('FREE').notNull(),
    email: text('email').unique().notNull(),
    apiKey: uuid('apiKey').unique().notNull().defaultRandom(),
    discordId: text('discordId'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (user) => [uniqueIndex('user_email_apiKey_index').on(user.email, user.apiKey)]
);

export const eventCategory = pgTable(
  'eventCategory',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    color: integer('color').notNull(),
    emoji: text('emoji'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique('eventCategory_name_userId_unique').on(table.name, table.userId),
  ]
);

export const deliveryStatusEnum = pgEnum('DeliveryStatus', [
  'PENDING',
  'DELIVERED',
  'FAILED',
]);

export const event = pgTable(
  'event',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    formattedMessage: text('formattedMessage').notNull(),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    name: text('name').notNull(),
    fields: jsonb('fields').notNull(),
    deliveryStatus: deliveryStatusEnum('deliveryStatus').default('PENDING'),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    eventCategoryId: uuid('eventCategoryId').references(() => eventCategory.id),
  },
  (event) => [index('event_createdAt_index').on(event.createdAt)]
);

export const quota = pgTable('quota', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('id')
    .unique()
    .notNull()
    .references(() => user.id),
  year: integer('year').notNull(),
  month: integer('month').notNull(),
  count: integer('count').default(0),
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const eventCategoriesRelations = relations(
  eventCategory,
  ({ one, many }) => ({
    user: one(user, {
      fields: [eventCategory.userId],
      references: [user.id],
    }),
    events: many(event),
  })
);

export const eventsRelations = relations(event, ({ one }) => ({
  user: one(user, {
    fields: [event.userId],
    references: [user.id],
  }),
  eventCategory: one(eventCategory, {
    fields: [event.eventCategoryId],
    references: [eventCategory.id],
  }),
}));

export const quotasRelations = relations(quota, ({ one }) => ({
  user: one(user, {
    fields: [quota.userId],
    references: [user.id],
  }),
}));
