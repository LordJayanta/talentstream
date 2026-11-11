import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

// --- CANDIDATE PROFILES & RESUME TABLE ---
export const candidateProfilesTable = pgTable("candidate_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  headline: text("headline"), // e.g., "Senior Full Stack Engineer"
  bio: text("bio"),
  location: text("location"),
  experienceLevel: text("experience_level"), // e.g. "3-5 years"
  skills: text("skills").array(), // e.g. ["React", "TypeScript", "Next.js", "Node.js"]
  resumeUrl: text("resume_url"), // URL or path to uploaded resume file
  resumeFileName: text("resume_file_name"),
  resumeText: text("resume_text"), // Extracted or pasted resume text
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type InsertCandidateProfile = typeof candidateProfilesTable.$inferInsert;
export type SelectCandidateProfile = typeof candidateProfilesTable.$inferSelect;

