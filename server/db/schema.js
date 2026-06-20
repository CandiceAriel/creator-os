import { pgTable, serial, text, varchar, numeric, date, timestamp, integer } from 'drizzle-orm/pg-core';

export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  contactName: varchar('contact_name', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  status: varchar('status', { length: 50 }).default('prospect'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const campaigns = pgTable('campaigns', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id').references(() => brands.id),
  title: varchar('title', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).default('active'),
  budget: numeric('budget'),
  startDate: date('start_date'),
  endDate: date('end_date'),
});

export const deliverables = pgTable('deliverables', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id').references(() => campaigns.id),
  title: varchar('title', { length: 255 }),
  platform: varchar('platform', { length: 50 }),
  dueDate: date('due_date'),
  status: varchar('status', { length: 50 }).default('planned'),
});

export const affiliateLinks = pgTable('affiliate_links', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id').references(() => brands.id),
  productName: varchar('product_name', { length: 255 }),
  url: text('url'),
  clicks: integer('clicks').default(0),
  conversions: integer('conversions').default(0),
  revenue: numeric('revenue').default('0'),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id').references(() => campaigns.id),
  amount: numeric('amount'),
  status: varchar('status', { length: 50 }).default('pending'),
  dueDate: date('due_date'),
});

export const reminders = pgTable('reminders', {
  id: serial('id').primaryKey(),
  brandId: integer('brand_id').references(() => brands.id),
  note: text('note'),
  remindAt: timestamp('remind_at'),
  done: integer('done').default(0),
});