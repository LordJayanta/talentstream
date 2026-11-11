"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Bookmark, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { applyJobAction, toggleSaveJobAction } from "@/actions/candidate-actions";

interface JobDetailActionsProps {
  jobId: string;
  initialApplied?: boolean;
  initialSaved?: boolean;
  isOwner?: boolean;
  viewerRole?: string | null;
}

export default function JobDetailActions({
  jobId,
  initialApplied = false,
  initialSaved = false,
  isOwner = false,
  viewerRole,
}: JobDetailActionsProps) {
  const [hasApplied, setHasApplied] = useState(initialApplied);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isApplying, setIsApplying] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const res = await applyJobAction(jobId, coverLetter.trim() || undefined);
      if (res.success) {
        setHasApplied(true);
        setShowCoverLetter(false);
        alert(res.message);
      } else {
        alert(res.message);
      }
    } catch {
      alert("Failed to apply. Please log in as a candidate first.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await toggleSaveJobAction(jobId);
      if (res.success) {
        setIsSaved(res.saved ?? !isSaved);
      } else {
        alert(res.message);
      }
    } catch {
      alert("Please log in to save jobs.");
    }
  };

  if (isOwner) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/hr/job/${jobId}/edit`} className={buttonVariants({ variant: "outline" })}>
          Edit Job
        </Link>
        <Link href="/hr/job" className={buttonVariants({ variant: "default" })}>
          Manage in HR Portal
        </Link>
      </div>
    );
  }

  if (!viewerRole) {
    return (
      <Link href="/login" className={buttonVariants({ variant: "default" })}>
        <Zap size={16} className="mr-1.5" />
        Sign in to apply
      </Link>
    );
  }

  if (viewerRole !== "candidate") {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={handleSave}
          className={isSaved ? "text-primary border-primary" : ""}
        >
          <Bookmark size={16} className={`mr-1.5 ${isSaved ? "fill-primary" : ""}`} />
          {isSaved ? "Saved" : "Save"}
        </Button>

        {hasApplied ? (
          <Button disabled className="bg-emerald-600 text-white gap-2">
            <CheckCircle2 size={16} />
            Application Submitted
          </Button>
        ) : (
          <Button
            onClick={() => setShowCoverLetter(!showCoverLetter)}
            disabled={isApplying}
            className="gap-2"
          >
            <Zap size={16} />
            Apply Now
          </Button>
        )}
      </div>

      {showCoverLetter && !hasApplied && (
        <div className="mt-2 p-4 border rounded-lg bg-card space-y-3">
          <h5 className="font-semibold text-sm">Submit Your Application</h5>
          <textarea
            className="w-full p-2.5 text-sm border rounded-md bg-background focus:ring-1 focus:ring-primary outline-hidden"
            rows={3}
            placeholder="Add an optional note or cover letter to the hiring team..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCoverLetter(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              disabled={isApplying}
            >
              {isApplying ? "Submitting..." : "Confirm Application"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

