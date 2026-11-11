import { db } from "../src/db";
import { user } from "../src/db/schema/auth";
import { jobsTable } from "../src/db/schema/jobs";
import { jobApplicationsTable } from "../src/db/schema/applications";
import { savedJobsTable } from "../src/db/schema/saved-jobs";
import { candidateProfilesTable } from "../src/db/schema/candidates";
import { eq, or, inArray } from "drizzle-orm";

async function cleanDemoData() {
  console.log("🧹 Starting TalentStream demo data cleanup...");

  try {
    // 1. Find demo users
    const demoUsers = await db
      .select({ id: user.id, email: user.email })
      .from(user)
      .where(
        or(
          eq(user.email, "employer@talentstream.com"),
          eq(user.email, "candidate@talentstream.com")
        )
      );

    const demoUserIds = demoUsers.map((u) => u.id);

    if (demoUserIds.length > 0) {
      console.log(`Found ${demoUserIds.length} demo user accounts to clean:`, demoUsers.map((u) => u.email));

      // Remove saved jobs by demo users
      await db.delete(savedJobsTable).where(inArray(savedJobsTable.userId, demoUserIds));

      // Remove applications by demo users
      await db.delete(jobApplicationsTable).where(inArray(jobApplicationsTable.candidateId, demoUserIds));

      // Remove candidate profiles
      await db.delete(candidateProfilesTable).where(inArray(candidateProfilesTable.userId, demoUserIds));

      // Remove jobs posted by demo employer
      await db.delete(jobsTable).where(inArray(jobsTable.employerId, demoUserIds));

      // Remove demo users (Better Auth cascade will clean sessions and accounts)
      await db.delete(user).where(inArray(user.id, demoUserIds));
    }

    // 2. Also clean any sample jobs created with default company "TalentStream Labs"
    const cleanedSampleJobs = await db
      .delete(jobsTable)
      .where(eq(jobsTable.companyName, "TalentStream Labs"))
      .returning({ id: jobsTable.id, title: jobsTable.title });

    if (cleanedSampleJobs.length > 0) {
      console.log(`Removed ${cleanedSampleJobs.length} sample job listings.`);
    }

    console.log("✅ Demo data cleaned successfully!");
    console.log("Database is now clean of demo employer, candidate, sample jobs, and applications.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to clean demo data:", error);
    process.exit(1);
  }
}

cleanDemoData();
