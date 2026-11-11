import Header from "@/components/core/header";
import JobSearchFeed from "@/components/job-search-feed";
import { getJobsAction } from "@/actions/job-actions";
import { JobCardData } from "@/components/job-card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const [result, session] = await Promise.all([
    getJobsAction(),
    auth.api.getSession({ headers: await headers() }),
  ]);
  const initialJobs = (result?.jobs as unknown as JobCardData[]) || [];
  const viewerRole = (session?.user as { role?: string } | undefined)?.role ?? null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <JobSearchFeed initialJobs={initialJobs} viewerRole={viewerRole} />
      </main>
    </div>
  );
}
