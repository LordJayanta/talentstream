import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { jobsTable } from "./jobs";

// --- JOB APPLICATIONS TABLE ---
export const jobApplicationsTable = pgTable("job_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobsTable.id, { onDelete: "cascade" }),
  candidateId: text("candidate_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  applicantName: text("applicant_name").notNull(),
  applicantEmail: text("applicant_email").notNull(),
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"),
  status: text("status", {
    enum: ["pending", "reviewing", "shortlisted", "rejected", "hired"],
  })
    .default("pending")
    .notNull(),
  matchScore: integer("match_score").default(0),
  appliedAt: timestamp("applied_at", { withTimezone: true }).defaultNow().notNull(),
});

export type InsertJobApplication = typeof jobApplicationsTable.$inferInsert;
export type SelectJobApplication = typeof jobApplicationsTable.$inferSelect;
export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "hired";

