// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/lib/db/schema.ts
// Description      : Drizzle ORM table definitions for the two off-chain data stores:
//                    profiles (per-wallet display settings) and organizer_requests
//                    (role applications awaiting admin approval).
// First Written on : Tuesday, 21-Apr-2026
// Last Modified on : Tuesday, 21-Apr-2026

import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  address:     text("address").primaryKey(),
  displayName: text("display_name"),
  bio:         text("bio"),
  careerGoal:  text("career_goal"),
  avatarUri:   text("avatar_uri"),
  createdAt:   timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:   timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const organizerRequests = pgTable("organizer_requests", {
  address:      text("address").primaryKey(),
  displayName:  text("display_name").notNull(),
  organization: text("organization").notNull(),
  reason:       text("reason").notNull(),
  status:       text("status").notNull().default("pending"),
  requestedAt:  timestamp("requested_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:    timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
