"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Filter,
  Mail,
  Sparkles,
  Users,
  CheckCircle,
  XCircle,
  ChevronDown,
  Clock,
} from "lucide-react";
import { ApplicationStatus } from "@/db/schema/applications";
import { updateApplicationStatusAction } from "@/actions/application-actions";
import { useRouter } from "next/navigation";

export interface PipelineApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  applicantName: string;
  applicantEmail: string;
  resumeUrl?: string | null;
  coverLetter?: string | null;
  status: string;
  matchScore: number | null;
  appliedAt: Date | string;
}

interface HRCandidatePipelineProps {
  initialApplications: PipelineApplication[];
  jobs: { id: string; title: string }[];
  initialJobId?: string;
}

const STATUS_VARIANTS: Record<
  string,
  { label: string; badgeVariant: "standred" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pending Review", badgeVariant: "secondary" },
  reviewing: { label: "In Review", badgeVariant: "outline" },
  shortlisted: { label: "Shortlisted", badgeVariant: "standred" },
  hired: { label: "Hired", badgeVariant: "standred" },
  rejected: { label: "Rejected", badgeVariant: "destructive" },
};

export default function HRCandidatePipeline({
  initialApplications,
  jobs,
  initialJobId,
}: HRCandidatePipelineProps) {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<string>(initialJobId || "all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeAppDetails, setActiveAppDetails] = useState<PipelineApplication | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!activeAppDetails) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveAppDetails(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeAppDetails]);

  const filteredApps = initialApplications.filter((app) => {
    if (selectedJob !== "all" && app.jobId !== selectedJob) return false;
    if (statusFilter !== "all" && app.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    setIsUpdating(true);
    try {
      const res = await updateApplicationStatusAction(appId, newStatus);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.message);
      }
    } catch {
      alert("Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Job Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Filter size={15} />
            <span>Filter Job:</span>
          </div>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-primary outline-hidden"
          >
            <option value="all">All Jobs ({jobs.length})</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5">
          {["all", "pending", "reviewing", "shortlisted", "hired", "rejected"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors cursor-pointer ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="border rounded-xl bg-card overflow-x-auto shadow-xs">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[30%]">Applicant</TableHead>
              <TableHead>Applied For</TableHead>
              <TableHead className="text-center">AI Match</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Applied Date</TableHead>
              <TableHead className="text-right pr-6">Workflow</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApps.length > 0 ? (
              filteredApps.map((app) => {
                const statusMeta = STATUS_VARIANTS[app.status] || {
                  label: app.status,
                  badgeVariant: "secondary" as const,
                };

                return (
                  <TableRow key={app.id} className="hover:bg-muted/20">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {app.applicantName[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {app.applicantName}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail size={12} /> {app.applicantEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-medium text-xs text-foreground">
                        {app.jobTitle}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      {app.matchScore != null ? (
                        <Badge
                          variant="secondary"
                          className={`text-xs gap-1 font-semibold ${
                            app.matchScore >= 85
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : app.matchScore >= 70
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          <Sparkles size={11} />
                          {app.matchScore}%
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant={statusMeta.badgeVariant}
                        className="rounded-full capitalize text-[11px]"
                      >
                        {statusMeta.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center text-xs text-muted-foreground">
                      <span className="flex items-center justify-center gap-1">
                        <Clock size={12} />
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </TableCell>

                    <TableCell className="pr-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(app.resumeUrl || app.coverLetter) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 gap-1"
                            onClick={() => setActiveAppDetails(app)}
                          >
                            <FileText size={13} />
                            Details
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isUpdating}
                              className="text-xs h-7 gap-1"
                            >
                              Update Status <ChevronDown size={12} />
                            </Button>
                          } />
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(app.id, "reviewing")}
                              >
                                Mark as In Review
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(app.id, "shortlisted")}
                                className="text-primary font-medium"
                              >
                                Shortlist Candidate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(app.id, "hired")}
                                className="text-emerald-600 font-medium"
                              >
                                <CheckCircle size={14} className="mr-1.5" />
                                Mark as Hired
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(app.id, "rejected")}
                                className="text-destructive font-medium"
                              >
                                <XCircle size={14} className="mr-1.5" />
                                Reject Application
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  <div className="space-y-2">
                    <Users size={28} className="mx-auto text-muted-foreground/60" />
                    <p className="font-medium text-sm">No candidates in this pipeline stage.</p>
                    <p className="text-xs text-muted-foreground">
                      Candidates applying for your jobs will appear here automatically.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Application Details Modal */}
      {activeAppDetails && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveAppDetails(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Application details for ${activeAppDetails.applicantName}`}
            className="bg-card border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{activeAppDetails.applicantName}</h3>
                <p className="text-xs text-muted-foreground">
                  Applied for {activeAppDetails.jobTitle}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close application details"
                onClick={() => setActiveAppDetails(null)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="p-3 bg-muted/40 rounded-lg space-y-1">
                <span className="font-semibold text-muted-foreground">Applicant Email:</span>
                <p className="text-sm font-medium">{activeAppDetails.applicantEmail}</p>
              </div>

              {activeAppDetails.coverLetter && (
                <div className="space-y-1">
                  <span className="font-semibold text-muted-foreground">Cover Note:</span>
                  <div className="p-3 bg-muted/30 rounded-lg text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {activeAppDetails.coverLetter}
                  </div>
                </div>
              )}

              {activeAppDetails.resumeUrl ? (
                <div className="p-3 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-primary" />
                    <span className="font-medium">Uploaded Resume Document</span>
                  </div>
                  <a
                    href={activeAppDetails.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold"
                  >
                    Open Resume ↗
                  </a>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No separate resume PDF uploaded.</p>
              )}
            </div>

            <div className="flex justify-end pt-3">
              <Button size="sm" onClick={() => setActiveAppDetails(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

