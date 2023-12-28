
import { relations, sql } from "drizzle-orm";
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";

export const USER_ROLES = ['user', 'admin'] as const;
export const CONTEST_STATUS = ['pending', 'active', 'finished'] as const;
export const OP_STATUS = ['pending', 'rejected', 'executed'] as const;
export const OP_TYPE = ['accept_prize', 'notification', 'buy', 'sell'] as const;
export type OperationTypeType = typeof OP_TYPE[number];
export type OperationStatusType = typeof OP_STATUS[number];

export const user = sqliteTable('user', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: USER_ROLES }).notNull().default('user'),
  fullName: text('full_name').notNull(),
  remainingVotes: integer('remaining_votes', { mode: 'number' }).notNull().default(0),
  funds: real('funds').notNull().default(0),  
  creationTimestamp: integer('creation_timestamp', { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const userPhoto = sqliteTable('user_photo', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => user.id),
  photoKey: text('photo_key').unique().notNull(),
  title: text('title').notNull(),
  size: integer('size', { mode: 'number' }).notNull(),
  md5: text('md5').notNull().unique(),  
  account: text('account').notNull(),
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
  status: text('status', { enum: CONTEST_STATUS }).default('pending').notNull(),
  initTimestamp: integer('init_timestamp', { mode: 'timestamp_ms' }).notNull(),
  endTimestamp: integer('end_timestamp', { mode: 'timestamp_ms' }).notNull(),
  winingPhotoId: integer('wining_photo_id').references(() => userPhoto.id),
  userDrawWinningId: integer('user_draw_winning_id').references(() => user.id),
  totalPrize: real('total_prize'),
  creationTimestamp: integer('creation_timestamp', { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contestPhoto = sqliteTable('contest_photo', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  photoId: integer('photo_id').references(() => userPhoto.id),
  contestId: integer('contest_id').references(() => contest.id),
  votes: integer('votes').notNull(),
  salePrice: real('sale_price').notNull(),
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
  userId: integer('user_id').references(() => user.id).notNull(),
  contestPhotoId: integer('contest_photo_id').references(() => contestPhoto.id).notNull(),
  type: text('type', { enum: OP_TYPE }).notNull(),
  status: text('status', { enum: OP_STATUS }).default('pending').notNull(),
  message: text('message').notNull(),
  destinationUserId: integer('destination_user_id').references(() => user.id),
  destinationAddress: text('destination_address'),
  executionTimestamp: integer('execution_timestamp', { mode: 'timestamp_ms' }),
  expirationTimestamp: integer('expiration_timestamp', { mode: 'timestamp_ms' }).notNull(),
  rejectionTimestamp: integer('rejection_timestamp', { mode: 'timestamp_ms' }),
  rejectionReason: text('rejection_reason'),
  creationTimestamp: integer('creation_timestamp', { mode: 'timestamp_ms' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const votesPricing = sqliteTable('votes_pricing', {
  numVotes: integer('num_votes', { mode: 'number' }).primaryKey(),
  price: integer('price').notNull()
});


