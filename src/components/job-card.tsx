"use client";

import { Card, CardDescription, CardHeader } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import JobProfile from "@/assets/JobUser.jpg";
import { Badge } from "./ui/badge";
import { BanknoteCheck, Bookmark, BriefcaseBusiness, Sparkles, Zap, CheckCircle2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { useState } from "react";
import { applyJobAction, toggleSaveJobAction } from "@/actions/candidate-actions";
import { formatEmploymentType, timeAgo } from "@/lib/utils";

export interface JobCardData {
  id: string;
  title: string;
  companyName?: string | null;
  location?: string | null;
  employmentType?: string | null;
  department?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  description: string;
  mustHaveSkills?: string[] | null;
  niceToHaveSkills?: string[] | null;
  matchScore?: number;
  matchLabel?: string;
  hasApplied?: boolean;
  isSaved?: boolean;
  createdAt: Date | string;
}

interface JobCardProps {
  job: JobCardData;
  viewerRole?: string | null;
}

function formatSalary(min?: number | null, max?: number | null) {
  if (!min && !max) return "Competitive";
  if (min && max) {
    const minK = min >= 1000 ? `$${Math.round(min / 1000)}k` : `$${min}`;
    const maxK = max >= 1000 ? `$${Math.round(max / 1000)}k` : `$${max}`;
    return `${minK} - ${maxK}`;
  }
  if (min) return `From $${min >= 1000 ? Math.round(min / 1000) + "k" : min}`;
  return `Up to $${max! >= 1000 ? Math.round(max! / 1000) + "k" : max}`;
}

export default function JobCard({ job, viewerRole }: JobCardProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(job.hasApplied ?? false);
  const [isSaved, setIsSaved] = useState(job.isSaved ?? false);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const result = await applyJobAction(job.id);
      if (result.success) {
        setHasApplied(true);
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch {
      alert("Failed to apply. Please sign in as a candidate first.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      const result = await toggleSaveJobAction(job.id);
      if (result.success) {
        setIsSaved(result.saved ?? !isSaved);
      } else {
        alert(result.message);
      }
    } catch {
      alert("Please sign in to save jobs.");
    }
  };

  const match = job.matchScore ?? 0;
  const isCandidate = viewerRole === "candidate";

  return (
    <Card className="rounded-md gap-4 hover:border-primary/50 transition-colors">
      <CardHeader className="gap-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <AspectRatio ratio={1 / 1} className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              <Image
                src={JobProfile}
                alt={job.companyName || "Company"}
                width={48}
                height={48}
                className="rounded-lg object-cover grayscale dark:brightness-20"
              />
            </AspectRatio>
            <div>
              <Link href={`/job/${job.id}`}>
                <h3 className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer">
                  {job.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">
                {job.companyName || "TalentStream"} • {job.location || "Remote"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            {isCandidate && job.matchScore != null && (
              <>
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-md border-2 font-bold ${
                    match >= 85
                      ? "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                      : match >= 70
                      ? "border-primary text-primary bg-primary/10"
                      : "border-amber-500 text-amber-600 bg-amber-50"
                  }`}
                >
                  <span className="text-sm">{match}%</span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground tracking-wider mt-0.5">
                  MATCH
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="secondary">
            <BanknoteCheck size={14} className="mr-1" />
            {formatSalary(job.minSalary, job.maxSalary)}
          </Badge>
          {job.employmentType && (
            <Badge variant="secondary">
              <BriefcaseBusiness size={14} className="mr-1" />
              {formatEmploymentType(job.employmentType)}
            </Badge>
          )}
          {job.department && (
            <Badge variant="outline">{job.department}</Badge>
          )}
          {job.mustHaveSkills && job.mustHaveSkills.slice(0, 3).map((skill, i) => (
            <Badge key={i} variant="secondary" className="bg-primary/5 text-primary text-xs">
              <Sparkles size={10} className="mr-1" />
              {skill}
            </Badge>
          ))}
        </div>

        <CardDescription className="line-clamp-2 text-sm text-foreground/80">
          {job.description.replace(/[#*`_]/g, "")}
        </CardDescription>

        <div className="mx-auto w-[98%]">
          <Separator />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Posted {timeAgo(job.createdAt)}
          </span>

          <div className="flex gap-2">
            {isCandidate ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className={`h-9 px-3 ${isSaved ? "text-primary border-primary" : ""}`}
                  title={isSaved ? "Saved" : "Save job"}
                  aria-label={isSaved ? "Remove saved job" : "Save job"}
                >
                  <Bookmark size={16} className={isSaved ? "fill-primary" : ""} />
                </Button>

                {hasApplied ? (
                  <Button size="sm" disabled className="h-9 gap-1 bg-emerald-600 text-white">
                    <CheckCircle2 size={16} />
                    Applied
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleApply}
                    disabled={isApplying}
                    className="h-9 gap-1.5"
                  >
                    <Zap size={15} />
                    <span>{isApplying ? "Applying..." : "One-Click Apply"}</span>
                  </Button>
                )}
              </>
            ) : viewerRole ? null : (
              <Link
                href="/login"
                className={buttonVariants({ variant: "outline", size: "sm", className: "h-9 gap-1.5" })}
              >
                <Zap size={15} />
                Sign in to apply
              </Link>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
