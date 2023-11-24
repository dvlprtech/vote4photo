
import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export const USER_ROLES: [string, ...string[]] = ['user', 'admin'];
export const CONTEST_STATUS: [string, ...string[]] = ['pending', 'in_progress', 'finished'];
export const OP_STATUS: [string, ...string[]] = ['pending', 'rejected', 'executed'];
export const OP_TYPE: [string, ...string[]] = ['transfer', 'buy'];


const user = sqliteTable('user', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  email: text('').notNull(),
  password: text('').notNull(),
  role: text('', { enum: USER_ROLES }).default('user'),
  full_name: text('').notNull().default(sql`CURRENT_TIMESTAMP`),
  accounts: text('', { mode: 'json' }),
  creation_timestamp: integer('', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  remainig_votes: integer('', { mode: 'number' }).notNull().default(0),
  funds: real('funds').notNull().default(0),  
});

const userPhoto = sqliteTable('user_photo', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  user_id: integer('').references(() => user.id),
  photo_uri: text('').notNull(),
  title: text('').notNull(),
  token_address: text('').notNull(),
  token_id: integer('').notNull(),
  owner_since: integer('', { mode: 'timestamp' }).notNull(),
  mint_tx: text('').notNull(),
  last_transfer_tx: text('').notNull(),
  creation_timestamp: integer('', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

const contest = sqliteTable('contest', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('').notNull(),
  description: text('').notNull(),
  status: text('', { enum: CONTEST_STATUS }).default('pending'),
  init_timestamp: integer('', { mode: 'timestamp' }).notNull(),
  end_timestamp: integer('', { mode: 'timestamp' }).notNull(),
  wining_photo_id: integer('').references(() => userPhoto.id),
  user_draw_winning_id: integer('').references(() => user.id),
  total_prize: integer('').notNull(),
  creation_timestamp: integer('', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

const contestPhoto = sqliteTable('contest_photo', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  photo_id: integer('').references(() => userPhoto.id),
  contest_id: integer('').references(() => contest.id),
  votes: integer('').notNull(),
  sale_price: integer('').notNull(),
  creation_timestamp: integer('', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

const logVotes = sqliteTable('log_votes', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  user_id: integer('').references(() => user.id),
  contest_photo_id: integer('').references(() => contestPhoto.id),
  votes: integer('').notNull(),
  execution_timestamp: integer('', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

const userVotes = sqliteTable('user_votes', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  user_id: integer('').references(() => user.id),
  contest_photo_id: integer('').references(() => contestPhoto.id),
  votes: integer('').notNull(),
  want_buy: integer('', {mode: "boolean"}).notNull(),
  execution_timestamp: integer('', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

const operations = sqliteTable('operations', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  user_id: integer('').references(() => user.id),
  contest_photo_id: integer('').references(() => contestPhoto.id),
  
  type: text('', { enum: OP_TYPE }),
  status: text('', { enum: OP_STATUS }).default('pending'),

  execution_timestamp: integer('', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  expiration_timestamp: integer('', { mode: 'timestamp' }).notNull(),
  rejection_reason: text(''),
  creation_timestamp: integer('', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

const votesPricing = sqliteTable('votes_pricing', {
  num_votes: integer('', { mode: 'number' }).primaryKey(),
  price: integer('').notNull()
});


