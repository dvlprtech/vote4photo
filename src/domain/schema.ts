
import { sql } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export const USER_ROLES: [string, ...string[]] = ['user', 'admin'];
export const CONTEST_STATUS: [string, ...string[]] = ['pending', 'in_progress', 'finished'];
export const OP_STATUS: [string, ...string[]] = ['pending', 'rejected', 'executed'];
export const OP_TYPE: [string, ...string[]] = ['transfer', 'buy'];


export const user = sqliteTable('user', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: USER_ROLES }).notNull().default('user'),
  fullName: text('full_name').notNull(),
  accounts: text('accounts', { mode: 'json' }),
  creationTimestamp: integer('creation_timestamp', { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  remainingVotes: integer('remaining_votes', { mode: 'number' }).notNull().default(0),
  funds: real('funds').notNull().default(0),  
});

export const userPhoto = sqliteTable('user_photo', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => user.id),
  photoUri: text('photo_uri').notNull(),
  title: text('title').notNull(),
  tokenAddress: text('token_address').notNull(),
  tokenId: integer('token_id').notNull(),
  ownerSince: integer('owner_since', { mode: 'timestamp_ms' }).notNull(),
  mintTx: text('mint_tx').notNull(),
  lastTransferTx: text('last_transfer_tx').notNull(),
  creationTimestamp: integer('creation_timestamp', { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contest = sqliteTable('contest', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status', { enum: CONTEST_STATUS }).default('pending'),
  initTimestamp: integer('init_timestamp', { mode: 'timestamp_ms' }).notNull(),
  endTimestamp: integer('end_timestamp', { mode: 'timestamp_ms' }).notNull(),
  winingThoto_id: integer('wining_photo_id').references(() => userPhoto.id),
  userDrawWinningId: integer('user_draw_winning_id').references(() => user.id),
  totalPrize: real('total_prize'),
  creationTimestamp: integer('creation_timestamp', { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contestPhoto = sqliteTable('contest_photo', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  photoId: integer('photo_id').references(() => userPhoto.id),
  contestId: integer('contest_id').references(() => contest.id),
  votes: integer('votes').notNull(),
  saleIrice: integer('sale_price').notNull(),
  creationTimestamp: integer('creation_timestamp', { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const logVotes = sqliteTable('log_votes', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => user.id),
  contestPhotoId: integer('contest_photo_id').references(() => contestPhoto.id),
  votes: integer('votes').notNull(),
  executionTimestamp: integer('execution_timestamp', { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const userVotes = sqliteTable('user_votes', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => user.id),
  contestPhotoId: integer('contest_photo_id').references(() => contestPhoto.id),
  votes: integer('votes').notNull(),
  wantBuy: integer('want_buy', {mode: "boolean"}).notNull(),
  executionTimestamp: integer('execution_timestamp', { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const operations = sqliteTable('operations', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => user.id),
  contestPhotoId: integer('contest_photo_id').references(() => contestPhoto.id),
  type: text('type', { enum: OP_TYPE }),
  status: text('status', { enum: OP_STATUS }).default('pending'),
  executionTimestamp: integer('execution_timestamp', { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  expirationTimestamp: integer('expiration_timestamp', { mode: 'timestamp_ms' }).notNull(),
  rejectionReason: text('rejection_reason'),
  creationTimestamp: integer('creation_timestamp', { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const votesPricing = sqliteTable('votes_pricing', {
  numVotes: integer('num_votes', { mode: 'number' }).primaryKey(),
  price: integer('price').notNull()
});


