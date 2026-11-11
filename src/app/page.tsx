import Header from "@/components/core/header";
import JobSearchFeed from "@/components/job-search-feed";
import { getJobsAction } from "@/actions/job-actions";
import { JobCardData } from "@/components/job-card";

export default async function Home() {
  const result = await getJobsAction();
  const initialJobs = (result?.jobs as unknown as JobCardData[]) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <JobSearchFeed initialJobs={initialJobs} />
      </main>
    </div>
  );
}
