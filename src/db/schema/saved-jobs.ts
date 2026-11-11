import { pgTable, text, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { jobsTable } from "./jobs";

// --- SAVED JOBS / BOOKMARKS TABLE ---
export const savedJobsTable = pgTable(
  "saved_jobs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("saved_jobs_user_job_idx").on(table.userId, table.jobId),
  ]
);

export type InsertSavedJob = typeof savedJobsTable.$inferInsert;
export type SelectSavedJob = typeof savedJobsTable.$inferSelect;

