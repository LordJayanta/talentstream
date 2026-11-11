"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import JobCard, { JobCardData } from "./job-card";
import { getJobsAction, JobFilterOptions } from "@/actions/job-actions";
import { Briefcase, Loader2, Sparkles } from "lucide-react";

interface JobFeedProps {
  initialFilters?: JobFilterOptions;
}

export default function JobFeed({ initialFilters = {} }: JobFeedProps) {
  const [jobs, setJobs] = useState<JobCardData[]>([]);
  const [sortBy, setSortBy] = useState<"match" | "newest">("match");
  const [isPending, startTransition] = useTransition();

  const loadJobs = (sortOption = sortBy) => {
    startTransition(async () => {
      const res = await getJobsAction({ ...initialFilters, sortBy: sortOption });
      if (res.success && res.jobs) {
        setJobs(res.jobs as unknown as JobCardData[]);
      }
    });
  };

  useEffect(() => {
    loadJobs(sortBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters.search, initialFilters.location, initialFilters.isRemote, initialFilters.employmentType, initialFilters.minSalary, initialFilters.maxSalary, sortBy]);

  const handleSortChange = (newSort: "match" | "newest") => {
    setSortBy(newSort);
    loadJobs(newSort);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold flex items-center gap-2">
          Recommended Jobs{" "}
          <span className="text-sm text-muted-foreground font-normal">
            ({jobs.length} results)
          </span>
          {isPending && <Loader2 size={16} className="animate-spin text-primary" />}
        </h4>

        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Sparkles size={14} className="text-primary" />
              Sort by: {sortBy === "match" ? "Match Score" : "Newest First"}
            </Button>
          } />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleSortChange("match")}>
                Sort by: Match Score
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("newest")}>
                Sort by: Newest First
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <section className="space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : isPending ? (
          <div className="py-16 text-center border rounded-lg bg-card">
            <Loader2 className="animate-spin mx-auto text-primary mb-2" size={28} />
            <p className="text-muted-foreground text-sm">Finding best job matches...</p>
          </div>
        ) : (
          <div className="py-16 text-center border rounded-lg bg-card space-y-3">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
              <Briefcase size={24} />
            </div>
            <h5 className="font-semibold text-base">No jobs found</h5>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              No jobs currently match your search criteria. Try removing some filters or check back later.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
