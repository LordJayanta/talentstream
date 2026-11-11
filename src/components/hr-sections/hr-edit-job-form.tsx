"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Plus, X, Loader2, ArrowLeft } from "lucide-react";
import { updateJobAction } from "@/actions/job-actions";
import { SelectJob } from "@/db/schema/jobs";
import Link from "next/link";

interface HREditJobFormProps {
  job: SelectJob;
}

export default function HREditJobForm({ job }: HREditJobFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(job.title);
  const [companyName, setCompanyName] = useState(job.companyName || "");
  const [department, setDepartment] = useState(job.department || "");
  const [location, setLocation] = useState(job.location || "");
  const [employmentType, setEmploymentType] = useState(job.employmentType || "FULL_TIME");
  const [experience, setExperience] = useState(job.experience || "3-5");
  const [minSalary, setMinSalary] = useState(job.minSalary ? String(job.minSalary) : "");
  const [maxSalary, setMaxSalary] = useState(job.maxSalary ? String(job.maxSalary) : "");
  const [status, setStatus] = useState(job.status);
  const [description, setDescription] = useState(job.description);

  const [mustHaveSkills, setMustHaveSkills] = useState<string[]>(job.mustHaveSkills || []);
  const [newMustSkill, setNewMustSkill] = useState("");

  const [niceToHaveSkills, setNiceToHaveSkills] = useState<string[]>(job.niceToHaveSkills || []);
  const [newNiceSkill, setNewNiceSkill] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMustSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMustSkill.trim();
    if (trimmed && !mustHaveSkills.includes(trimmed)) {
      setMustHaveSkills([...mustHaveSkills, trimmed]);
      setNewMustSkill("");
    }
  };

  const handleAddNiceSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newNiceSkill.trim();
    if (trimmed && !niceToHaveSkills.includes(trimmed)) {
      setNiceToHaveSkills([...niceToHaveSkills, trimmed]);
      setNewNiceSkill("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("companyName", companyName);
      formData.append("department", department);
      formData.append("location", location);
      formData.append("employmentType", employmentType);
      formData.append("experience", experience);
      formData.append("minSalary", minSalary);
      formData.append("maxSalary", maxSalary);
      formData.append("status", status);
      formData.append("description", description);
      formData.append("mustHaveSkills", JSON.stringify(mustHaveSkills));
      formData.append("niceToHaveSkills", JSON.stringify(niceToHaveSkills));

      const res = await updateJobAction(job.id, formData);
      if (res.success) {
        alert(res.message);
        router.push("/hr/job");
        router.refresh();
      } else {
        alert(res.message);
      }
    } catch {
      alert("Failed to update job post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/hr/job" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back to Jobs
        </Link>
        <div className="flex items-center gap-2">
          <label htmlFor="job-status" className="text-xs font-semibold text-muted-foreground">Status:</label>
          <select
            id="job-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2.5 text-xs font-medium focus:ring-1 focus:ring-primary outline-hidden"
          >
            <option value="active">Active (Accepting Applications)</option>
            <option value="draft">Draft</option>
            <option value="stopped">Stopped / Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <Card className="rounded-xl shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Info size={18} className="text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="job-title" className="text-xs font-semibold">Job Title</label>
            <Input
              id="job-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="job-company" className="text-xs font-semibold">Company Name</label>
            <Input
              id="job-company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="job-department" className="text-xs font-semibold">Department</label>
              <Input
                id="job-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Engineering, Product, Marketing"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="job-location" className="text-xs font-semibold">Location</label>
              <Input
                id="job-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Remote"
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="job-employment-type" className="text-xs font-semibold">Employment Type</label>
              <select
                id="job-employment-type"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-1 focus:ring-primary outline-hidden"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="job-experience" className="text-xs font-semibold">Experience Level</label>
              <select
                id="job-experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:ring-1 focus:ring-primary outline-hidden"
              >
                <option value="0-1">Freshers (0 - 1 years)</option>
                <option value="1-3">1 to 3 years</option>
                <option value="3-5">3 to 5 years</option>
                <option value="5-10">5 to 10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="job-min-salary" className="text-xs font-semibold">Minimum Salary ($ / year)</label>
              <Input
                id="job-min-salary"
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder="100000"
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="job-max-salary" className="text-xs font-semibold">Maximum Salary ($ / year)</label>
              <Input
                id="job-max-salary"
                type="number"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                placeholder="150000"
                className="text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="rounded-xl shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold">Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            aria-label="Job Description"
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write the responsibilities, team overview, and requirements..."
            required
            className="text-sm"
          />
        </CardContent>
      </Card>

      {/* Skills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="rounded-xl shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Must-Have Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={newMustSkill}
                onChange={(e) => setNewMustSkill(e.target.value)}
                placeholder="Add skill (e.g. React)..."
                className="text-xs"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddMustSkill} className="text-xs shrink-0">
                <Plus size={14} /> Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {mustHaveSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs gap-1">
                  {skill}
                  <button
                    type="button"
                    aria-label={`Remove ${skill} skill`}
                    onClick={() => setMustHaveSkills(mustHaveSkills.filter((s) => s !== skill))}
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Nice-to-Have Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={newNiceSkill}
                onChange={(e) => setNewNiceSkill(e.target.value)}
                placeholder="Add skill (e.g. AWS)..."
                className="text-xs"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddNiceSkill} className="text-xs shrink-0">
                <Plus size={14} /> Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {niceToHaveSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs gap-1">
                  {skill}
                  <button
                    type="button"
                    aria-label={`Remove ${skill} skill`}
                    onClick={() => setNiceToHaveSkills(niceToHaveSkills.filter((s) => s !== skill))}
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Link href="/hr/job" className={buttonVariants({ variant: "outline" })}>
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving Changes...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}

