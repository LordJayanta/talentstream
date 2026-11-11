"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Eye, Pen, Users, Trash2 } from "lucide-react";
import Link from "next/link";
import { updateJobStatusAction, deleteJobAction } from "@/actions/job-actions";
import { useRouter } from "next/navigation";

interface HRJobRowActionsProps {
  jobId: string;
  status: "active" | "draft" | "closed" | "stopped";
}

export default function HRJobRowActions({
  jobId,
  status,
}: HRJobRowActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (
    newStatus: "active" | "draft" | "closed" | "stopped"
  ) => {
    setIsUpdating(true);
    try {
      const res = await updateJobStatusAction(jobId, newStatus);
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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this job post?")) {
      return;
    }
    setIsUpdating(true);
    try {
      const res = await deleteJobAction(jobId);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.message);
      }
    } catch {
      alert("Failed to delete job.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="h-full flex items-center gap-1.5 justify-end">
      {status === "draft" && (
        <Button
          variant="outline"
          size="sm"
          disabled={isUpdating}
          onClick={() => handleStatusChange("active")}
          className="text-xs h-7 text-emerald-600 border-emerald-300"
        >
          Publish
        </Button>
      )}

      <Link
        href={`/hr/candidate?jobId=${jobId}`}
        className={buttonVariants({ variant: "ghost", size: "sm", className: "text-xs h-7 gap-1" })}
      >
        <Users size={14} />
        <span>Applicants</span>
      </Link>

      <Link
        href={`/job/${jobId}`}
        target="_blank"
        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        title="View Public Post"
      >
        <Eye size={16} className="text-muted-foreground" />
      </Link>

      <Link
        href={`/hr/job/${jobId}/edit`}
        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        title="Edit Job"
      >
        <Pen size={16} className="text-muted-foreground" />
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" size="icon-sm" disabled={isUpdating} aria-label="Job actions" title="Job actions">
            <EllipsisVertical size={16} className="text-muted-foreground" />
          </Button>
        } />
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            {status === "active" && (
              <DropdownMenuItem onClick={() => handleStatusChange("closed")}>
                Close Job
              </DropdownMenuItem>
            )}
            {(status === "closed" || status === "stopped") && (
              <DropdownMenuItem onClick={() => handleStatusChange("active")}>
                Reopen Job
              </DropdownMenuItem>
            )}
            {status === "active" && (
              <DropdownMenuItem onClick={() => handleStatusChange("stopped")}>
                Pause / Stop Job
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              variant="destructive"
              onClick={handleDelete}
              className="gap-2 text-destructive"
            >
              <Trash2 size={14} />
              Delete Job
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

