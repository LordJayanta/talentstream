"use server";

import { db } from "@/db";
import { candidateProfilesTable } from "@/db/schema/candidates";
import { jobApplicationsTable } from "@/db/schema/applications";
import { savedJobsTable } from "@/db/schema/saved-jobs";
import { jobsTable } from "@/db/schema/jobs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, desc, eq } from "drizzle-orm";
import { calculateMatchScore } from "@/lib/match-score";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function getCandidateProfileAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, profile: null, user: null };
  }

  try {
    const [profile] = await db
      .select()
      .from(candidateProfilesTable)
      .where(eq(candidateProfilesTable.userId, session.user.id))
      .limit(1);

    return {
      success: true,
      profile: profile ?? null,
      user: session.user,
    };
  } catch (error) {
    console.error("Failed to fetch candidate profile:", error);
    return { success: false, profile: null, user: session.user };
  }
}

export async function updateCandidateProfileAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: "Unauthorized. Please login." };
  }

  const headline = formData.get("headline") as string;
  const bio = formData.get("bio") as string;
  const location = formData.get("location") as string;
  const experienceLevel = formData.get("experienceLevel") as string;
  const skillsJson = formData.get("skills") as string;
  const resumeText = formData.get("resumeText") as string;

  let skills: string[] = [];
  if (skillsJson) {
    try {
      skills = JSON.parse(skillsJson);
    } catch {
      skills = skillsJson.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  let resumeUrl: string | undefined = undefined;
  let resumeFileName: string | undefined = undefined;

  const resumeFile = formData.get("resume") as File | null;
  if (resumeFile && resumeFile.size > 0 && resumeFile.name) {
    try {
      const bytes = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
      await mkdir(uploadDir, { recursive: true });
      const safeName = `${Date.now()}-${resumeFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      await writeFile(path.join(uploadDir, safeName), buffer);
      resumeUrl = `/uploads/resumes/${safeName}`;
      resumeFileName = resumeFile.name;
    } catch (uploadErr) {
      console.error("Failed to save resume file:", uploadErr);
    }
  }

  try {
    const [existing] = await db
      .select()
      .from(candidateProfilesTable)
      .where(eq(candidateProfilesTable.userId, session.user.id))
      .limit(1);

    if (existing) {
      await db
        .update(candidateProfilesTable)
        .set({
          headline: headline ?? existing.headline,
          bio: bio ?? existing.bio,
          location: location ?? existing.location,
          experienceLevel: experienceLevel ?? existing.experienceLevel,
          skills: skills.length > 0 ? skills : existing.skills,
          resumeUrl: resumeUrl ?? existing.resumeUrl,
          resumeFileName: resumeFileName ?? existing.resumeFileName,
          resumeText: resumeText ?? existing.resumeText,
        })
        .where(eq(candidateProfilesTable.userId, session.user.id));
    } else {
      await db.insert(candidateProfilesTable).values({
        userId: session.user.id,
        headline,
        bio,
        location,
        experienceLevel,
        skills,
        resumeUrl,
        resumeFileName,
        resumeText,
      });
    }

    revalidatePath("/profile");
    revalidatePath("/");
    return { success: true, message: "Profile & Resume updated successfully!" };
  } catch (error) {
    console.error("Failed to update candidate profile:", error);
    return { success: false, message: "Failed to update profile." };
  }
}

export async function applyJobAction(jobId: string, coverLetter?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: "Please log in to apply for this job." };
  }

  try {
    // 1. Check if job exists and is active
    const [job] = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.id, jobId))
      .limit(1);

    if (!job || job.status !== "active") {
      return { success: false, message: "This job is no longer accepting applications." };
    }

    // 2. Check if already applied
    const [existingApplication] = await db
      .select()
      .from(jobApplicationsTable)
      .where(
        and(
          eq(jobApplicationsTable.jobId, jobId),
          eq(jobApplicationsTable.candidateId, session.user.id)
        )
      )
      .limit(1);

    if (existingApplication) {
      return { success: false, message: "You have already applied for this position." };
    }

    // 3. Fetch candidate profile for resume & match score
    const [profile] = await db
      .select()
      .from(candidateProfilesTable)
      .where(eq(candidateProfilesTable.userId, session.user.id))
      .limit(1);

    const matchAnalysis = calculateMatchScore(
      profile?.skills ?? [],
      job.mustHaveSkills ?? [],
      job.niceToHaveSkills ?? []
    );

    // 4. Create application
    await db.insert(jobApplicationsTable).values({
      jobId,
      candidateId: session.user.id,
      applicantName: session.user.name || "Candidate",
      applicantEmail: session.user.email,
      resumeUrl: profile?.resumeUrl ?? null,
      coverLetter: coverLetter ?? null,
      status: "pending",
      matchScore: matchAnalysis.score,
    });

    revalidatePath(`/job/${jobId}`);
    revalidatePath("/hr/candidate");
    revalidatePath("/hr/job");
    return { success: true, message: "Application submitted successfully! Good luck!" };
  } catch (error) {
    console.error("Failed to apply for job:", error);
    return { success: false, message: "Failed to submit application. Please try again." };
  }
}

export async function toggleSaveJobAction(jobId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: "Please log in to save jobs." };
  }

  try {
    const [existing] = await db
      .select()
      .from(savedJobsTable)
      .where(
        and(
          eq(savedJobsTable.jobId, jobId),
          eq(savedJobsTable.userId, session.user.id)
        )
      )
      .limit(1);

    if (existing) {
      await db.delete(savedJobsTable).where(eq(savedJobsTable.id, existing.id));
      revalidatePath(`/job/${jobId}`);
      revalidatePath("/");
      return { success: true, saved: false, message: "Job removed from saved." };
    } else {
      await db.insert(savedJobsTable).values({
        jobId,
        userId: session.user.id,
      });
      revalidatePath(`/job/${jobId}`);
      revalidatePath("/");
      return { success: true, saved: true, message: "Job saved to your bookmarks." };
    }
  } catch (error) {
    console.error("Failed to toggle save job:", error);
    return { success: false, message: "Failed to update saved job." };
  }
}

export async function getCandidateApplicationsAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, applications: [] };
  }

  try {
    const applications = await db
      .select({
        id: jobApplicationsTable.id,
        jobId: jobApplicationsTable.jobId,
        jobTitle: jobsTable.title,
        companyName: jobsTable.companyName,
        location: jobsTable.location,
        status: jobApplicationsTable.status,
        matchScore: jobApplicationsTable.matchScore,
        appliedAt: jobApplicationsTable.appliedAt,
      })
      .from(jobApplicationsTable)
      .innerJoin(jobsTable, eq(jobApplicationsTable.jobId, jobsTable.id))
      .where(eq(jobApplicationsTable.candidateId, session.user.id))
      .orderBy(desc(jobApplicationsTable.appliedAt));

    return { success: true, applications };
  } catch (error) {
    console.error("Failed to get candidate applications:", error);
    return { success: false, applications: [] };
  }
}
