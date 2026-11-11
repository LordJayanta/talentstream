import { db } from "../src/db";
import { jobsTable } from "../src/db/schema/jobs";
import { candidateProfilesTable } from "../src/db/schema/candidates";
import { jobApplicationsTable } from "../src/db/schema/applications";
import { savedJobsTable } from "../src/db/schema/saved-jobs";
import { user } from "../src/db/schema/auth";
import { auth } from "../src/lib/auth";
import { eq } from "drizzle-orm";
import { calculateMatchScore } from "../src/lib/match-score";

async function seed() {
  console.log("🌱 Starting TalentStream database demo data import...");

  // 1. Create or fetch Demo Employer
  const existingEmployers = await db
    .select()
    .from(user)
    .where(eq(user.email, "employer@talentstream.com"))
    .limit(1);

  let employerId: string | null = null;

  if (existingEmployers.length > 0) {
    employerId = existingEmployers[0].id;
    console.log("Found existing employer account:", employerId);
  } else {
    console.log("Creating demo employer: employer@talentstream.com / password123");
    try {
      const res = await auth.api.signUpEmail({
        body: {
          name: "Sarah Jenkins",
          email: "employer@talentstream.com",
          password: "password123",
          role: "employer",
        },
      });
      if (res?.user?.id) {
        employerId = res.user.id;
      }
    } catch (e) {
      console.log("Note during employer creation:", e);
      const [fetched] = await db
        .select()
        .from(user)
        .where(eq(user.email, "employer@talentstream.com"))
        .limit(1);
      if (fetched) employerId = fetched.id;
    }
  }

  // 2. Create or fetch Demo Candidate
  const existingCandidates = await db
    .select()
    .from(user)
    .where(eq(user.email, "candidate@talentstream.com"))
    .limit(1);

  let candidateId: string | null = null;
  let candidateName = "Alex Rivera";
  let candidateEmail = "candidate@talentstream.com";

  if (existingCandidates.length > 0) {
    candidateId = existingCandidates[0].id;
    candidateName = existingCandidates[0].name;
    candidateEmail = existingCandidates[0].email;
    console.log("Found existing candidate account:", candidateId);
  } else {
    console.log("Creating demo candidate: candidate@talentstream.com / password123");
    try {
      const res = await auth.api.signUpEmail({
        body: {
          name: "Alex Rivera",
          email: "candidate@talentstream.com",
          password: "password123",
          role: "candidate",
        },
      });
      if (res?.user?.id) {
        candidateId = res.user.id;
        candidateName = res.user.name;
        candidateEmail = res.user.email;
      }
    } catch (e) {
      console.log("Note during candidate creation:", e);
      const [fetched] = await db
        .select()
        .from(user)
        .where(eq(user.email, "candidate@talentstream.com"))
        .limit(1);
      if (fetched) {
        candidateId = fetched.id;
        candidateName = fetched.name;
        candidateEmail = fetched.email;
      }
    }
  }

  const candidateSkills = [
    "React",
    "TypeScript",
    "Next.js",
    "Tailwind CSS",
    "Node.js",
    "PostgreSQL",
    "Docker",
    "GraphQL",
  ];

  // 3. Upsert Candidate Profile
  if (candidateId) {
    const [existingProfile] = await db
      .select()
      .from(candidateProfilesTable)
      .where(eq(candidateProfilesTable.userId, candidateId))
      .limit(1);

    if (!existingProfile) {
      console.log("Creating candidate profile & resume skills...");
      await db.insert(candidateProfilesTable).values({
        userId: candidateId,
        headline: "Senior Full Stack & Frontend Engineer",
        location: "San Francisco, CA (or Remote)",
        experienceLevel: "5-10 years",
        bio: "Full stack software engineer with 6+ years of experience building modern web applications, scalable APIs, and reactive interfaces using React, Next.js, TypeScript, and cloud services.",
        skills: candidateSkills,
        resumeFileName: "Alex_Rivera_Resume.pdf",
        resumeUrl: "/uploads/resumes/Alex_Rivera_Resume.pdf",
      });
    }
  }

  // 4. Sample Jobs with realistic descriptions and skills
  const sampleJobs = [
    {
      title: "Senior Full Stack Engineer",
      department: "Engineering",
      location: "San Francisco, CA (Remote)",
      employmentType: "FULL_TIME",
      experience: "5-10",
      minSalary: 140000,
      maxSalary: 175000,
      status: "active",
      mustHaveSkills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      niceToHaveSkills: ["Next.js", "Docker", "Tailwind CSS"],
      companyBenefits: [
        "Comprehensive Healthcare",
        "401(k) Matching 5%",
        "Unlimited Flexible PTO",
        "$2,000 Home Office Stipend",
      ],
      description: `We are looking for an experienced Full Stack Engineer to lead our core application development.\n\n### Responsibilities\n- Design and implement end-to-end features with high scalability and test coverage.\n- Collaborate across engineering, product management, and UX design.\n- Modernize legacy codebases to Next.js and TypeScript.\n\n### What We Value\n- Deep knowledge of React component patterns and state management.\n- Hands-on experience with SQL schema design, Drizzle, and PostgreSQL optimization.\n- Strong communication and pride in software craftsmanship.`,
    },
    {
      title: "Frontend Tech Lead",
      department: "Engineering",
      location: "Remote (US)",
      employmentType: "FULL_TIME",
      experience: "5-10",
      minSalary: 160000,
      maxSalary: 195000,
      status: "active",
      mustHaveSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      niceToHaveSkills: ["Performance Optimization", "Design Systems"],
      companyBenefits: [
        "Health, Dental & Vision",
        "Competitive Equity Grant",
        "$1,500 Annual Learning Budget",
      ],
      description: `Lead our frontend architecture initiatives and build high-performance web experiences.\n\n### The Role\nAs Frontend Tech Lead, you will drive technical excellence, define coding standards, and guide engineers in shipping responsive, accessible UI.\n\n### Requirements\n- 5+ years building production applications with modern React and TypeScript.\n- Experience architecting component systems with Tailwind CSS and Radix/Base UI.\n- Passion for clean design and fast load times.`,
    },
    {
      title: "DevOps / Infrastructure Specialist",
      department: "Infrastructure",
      location: "Remote",
      employmentType: "FULL_TIME",
      experience: "3-5",
      minSalary: 130000,
      maxSalary: 160000,
      status: "active",
      mustHaveSkills: ["Docker", "Kubernetes", "Linux", "AWS"],
      niceToHaveSkills: ["Terraform", "PostgreSQL", "CI/CD"],
      companyBenefits: [
        "Full Health Coverage",
        "Flexible Working Hours",
      ],
      description: `Scale our cloud infrastructure, improve deployment velocity, and monitor platform health.\n\n### Responsibilities\n- Manage containerized workloads across staging and production.\n- Implement automated CI/CD pipelines.\n- Ensure 99.9% service uptime and automated recovery.`,
    },
    {
      title: "Senior Product Designer",
      department: "Design",
      location: "New York, NY (Hybrid)",
      employmentType: "FULL_TIME",
      experience: "5-10",
      minSalary: 130000,
      maxSalary: 165000,
      status: "active",
      mustHaveSkills: ["Figma", "UI/UX", "Design Systems", "Prototyping"],
      niceToHaveSkills: ["User Research", "Basic HTML/CSS"],
      companyBenefits: [
        "Premium Health & Dental",
        "Commuter Benefits",
        "Generous Vacation Policy",
      ],
      description: `Design intuitive interfaces for enterprise workflows.\n\n### What You Will Do\n- Lead user research interviews and translate insights into prototypes.\n- Expand our design system library in Figma.\n- Partner directly with frontend developers to ensure pixel-perfect fidelity.`,
    },
    {
      title: "Lead Data Analyst",
      department: "Analytics",
      location: "Austin, TX (Hybrid)",
      employmentType: "FULL_TIME",
      experience: "3-5",
      minSalary: 110000,
      maxSalary: 140000,
      status: "active",
      mustHaveSkills: ["SQL", "Python", "Data Visualization", "PostgreSQL"],
      niceToHaveSkills: ["Tableau", "Machine Learning"],
      companyBenefits: [
        "Comprehensive Healthcare",
        "Annual Performance Bonus",
      ],
      description: `Drive data-informed decisions across product and growth teams.\n\n### Key Tasks\n- Build analytics dashboards and automated reporting.\n- Analyze funnel conversion metrics and recommend growth initiatives.\n- Write performant SQL queries against large datasets.`,
    },
    {
      title: "Junior Backend Engineer",
      department: "Engineering",
      location: "Remote",
      employmentType: "FULL_TIME",
      experience: "1-3",
      minSalary: 85000,
      maxSalary: 110000,
      status: "active",
      mustHaveSkills: ["Node.js", "SQL", "JavaScript"],
      niceToHaveSkills: ["TypeScript", "Docker"],
      companyBenefits: [
        "Dedicated Mentorship",
        "Health & Vision",
      ],
      description: `Great opportunity for early-career developers looking to work with a passionate team.\n\n### You will:\n- Build REST and GraphQL APIs.\n- Learn best practices around database indexing and caching.\n- Review pull requests and write unit tests.`,
    },
  ];

  console.log("Checking existing jobs in database...");
  const existingJobs = await db.select().from(jobsTable);
  const createdJobs = [];

  if (existingJobs.length === 0) {
    console.log(`Inserting ${sampleJobs.length} sample jobs...`);
    for (const jobData of sampleJobs) {
      const [inserted] = await db
        .insert(jobsTable)
        .values({
          employerId: employerId ?? undefined,
          companyName: "TalentStream Labs",
          title: jobData.title,
          department: jobData.department,
          location: jobData.location,
          employmentType: jobData.employmentType,
          experience: jobData.experience,
          minSalary: jobData.minSalary,
          maxSalary: jobData.maxSalary,
          status: jobData.status,
          mustHaveSkills: jobData.mustHaveSkills,
          niceToHaveSkills: jobData.niceToHaveSkills,
          companyBenefits: jobData.companyBenefits,
          description: jobData.description,
        })
        .returning();
      createdJobs.push(inserted);
    }
  } else {
    createdJobs.push(...existingJobs);
  }

  // 5. Seed Applications if candidate exists and applications table is empty
  if (candidateId && createdJobs.length > 0) {
    const existingApps = await db.select().from(jobApplicationsTable);
    if (existingApps.length === 0) {
      console.log("Seeding sample candidate applications for HR pipeline...");

      const appStages: Array<{
        jobIdx: number;
        status: "shortlisted" | "reviewing" | "pending";
        letter: string;
      }> = [
        {
          jobIdx: 0,
          status: "shortlisted",
          letter:
            "Hi Sarah! I am deeply passionate about Full Stack engineering and have worked with React, Node, and TypeScript for 6+ years. Would love to discuss this role!",
        },
        {
          jobIdx: 1,
          status: "reviewing",
          letter:
            "Hello! As a seasoned frontend architect with a strong background in Next.js and design systems, this Tech Lead position aligns perfectly with my goals.",
        },
        {
          jobIdx: 2,
          status: "pending",
          letter:
            "Excited about TalentStream's mission. I have experience managing containers with Docker and Linux infrastructure.",
        },
      ];

      for (const stage of appStages) {
        const targetJob = createdJobs[stage.jobIdx];
        if (!targetJob) continue;

        const match = calculateMatchScore(
          candidateSkills,
          targetJob.mustHaveSkills ?? [],
          targetJob.niceToHaveSkills ?? []
        );

        await db.insert(jobApplicationsTable).values({
          jobId: targetJob.id,
          candidateId: candidateId,
          applicantName: candidateName,
          applicantEmail: candidateEmail,
          status: stage.status,
          matchScore: match.score,
          coverLetter: stage.letter,
          resumeUrl: "/uploads/resumes/Alex_Rivera_Resume.pdf",
        });
      }

      // 6. Seed a Saved Job
      if (createdJobs[3]) {
        await db.insert(savedJobsTable).values({
          jobId: createdJobs[3].id,
          userId: candidateId,
        });
      }
    }
  }

  console.log("✅ Seed completed successfully!");
  console.log("==========================================");
  console.log("Demo Accounts Available:");
  console.log("👤 Employer:  employer@talentstream.com  | password123");
  console.log("👤 Candidate: candidate@talentstream.com | password123");
  console.log("==========================================");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
