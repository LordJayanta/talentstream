import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const jobStatusEnum = pgEnum("job_status", [
  "active",
  "draft",
  "closed",
  "stopped",
]);

// --- JOBS TABLE ---
export const jobsTable = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Relational link to the recruiter/employer
  recruiterId: text("recruiter_id").notNull().references(() => user.id, {onDelete: 'cascade'}),

  title: text("title").notNull(),
  experience: text("experience"),
  department: text("department"),
  employmentType: text("employment_type"),
  location: text("location"),
  description: text("description").notNull(), // Stores your markdown text from the editor
  minSalary: integer("min_salary"),
  maxSalary: integer("max_salary"),
  companyBenefits: text("company_benefits").array(),
  mustHaveSkills: text("must_have_skills").array(),
  niceToHaveSkills: text("Nice_to_have_skills").array(),
  status: jobStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertJob = typeof jobsTable.$inferInsert;
export type SelectJob = typeof jobsTable.$inferSelect;

