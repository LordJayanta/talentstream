import { getJobByIdAction } from "@/actions/job-actions";
import { notFound } from "next/navigation";
import HRHeader from "@/components/hr-sections/hr-header";
import HREditJobForm from "@/components/hr-sections/hr-edit-job-form";

interface EditJobPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;
  const result = await getJobByIdAction(id);

  if (!result.success || !result.job) {
    notFound();
  }

  return (
    <div>
      <HRHeader title="Edit Job Post" />
      <main className="py-6 px-12">
        <HREditJobForm job={result.job} />
      </main>
    </div>
  );
}
