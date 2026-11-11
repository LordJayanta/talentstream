import HRHeader from "@/components/hr-sections/hr-header";
import { getEmployerApplicationsAction } from "@/actions/application-actions";
import { getEmployerJobsAction } from "@/actions/job-actions";
import HRCandidatePipeline from "@/components/hr-sections/hr-candidate-pipeline";

interface PageProps {
  searchParams?: Promise<{
    jobId?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialJobId = resolvedSearchParams?.jobId;

  const { applications } = await getEmployerApplicationsAction(initialJobId);
  const { jobs } = await getEmployerJobsAction();

  const formattedJobs = (jobs || []).map((j) => ({
    id: j.id,
    title: j.title,
  }));

  return (
    <div>
      <HRHeader title="Candidate Pipeline" />
      <main className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidate Pipeline</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Review applicant profiles, check AI match scores, and progress candidates through hiring stages.
          </p>
        </div>

        <HRCandidatePipeline
          initialApplications={applications || []}
          jobs={formattedJobs}
          initialJobId={initialJobId}
        />
      </main>
    </div>
  );
}
