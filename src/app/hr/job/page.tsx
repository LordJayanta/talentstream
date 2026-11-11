import HRHeader from "@/components/hr-sections/hr-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase, CirclePlus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { getEmployerJobsAction } from "@/actions/job-actions";
import HRJobRowActions from "@/components/hr-sections/hr-job-row-actions";

export default async function Page() {
  const { jobs } = await getEmployerJobsAction();

  return (
    <div>
      <HRHeader title="Job Postings" />
      <main className="p-6 grid gap-6">
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Jobs</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              View, edit, and track performance of all your job requisitions.
            </p>
          </div>
          <div>
            <Link href="/hr/job/new">
              <Button className="gap-2">
                <CirclePlus size={18} />
                <span>Post New Job</span>
              </Button>
            </Link>
          </div>
        </section>

        <section className="border rounded-xl bg-card overflow-hidden shadow-xs">
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[35%]">Title & Details</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Date Posted</TableHead>
                <TableHead className="text-center">Applicants</TableHead>
                <TableHead className="text-center">Location</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs && jobs.length > 0 ? (
                jobs.map((job) => (
                  <TableRow key={job.id} className="hover:bg-muted/20">
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-base text-foreground">
                          {job.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {job.department || "General"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          job.status === "active"
                            ? "standred"
                            : job.status === "closed"
                            ? "destructive"
                            : "secondary"
                        }
                        className="rounded-full capitalize text-xs"
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-primary">
                        {job.applicantsCount || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {job.location || "Remote"}
                    </TableCell>
                    <TableCell className="pr-4">
                      <HRJobRowActions
                        jobId={job.id}
                        status={job.status as "active" | "draft" | "closed" | "stopped"}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="space-y-2">
                      <Briefcase size={28} className="mx-auto text-muted-foreground/60" />
                      <p className="font-medium text-sm">No jobs posted yet.</p>
                      <Link href="/hr/job/new">
                        <Button variant="outline" size="sm" className="mt-2 text-xs">
                          Create your first job post
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </section>
      </main>
    </div>
  );
}
