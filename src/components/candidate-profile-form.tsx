"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Upload, X, Check, Loader2 } from "lucide-react";
import { updateCandidateProfileAction } from "@/actions/candidate-actions";
import { SelectCandidateProfile } from "@/db/schema/candidates";

interface CandidateProfileFormProps {
  user: { name?: string | null; email?: string | null } | null;
  initialProfile: SelectCandidateProfile | null;
}

export default function CandidateProfileForm({
  user,
  initialProfile,
}: CandidateProfileFormProps) {
  const [headline, setHeadline] = useState(initialProfile?.headline || "");
  const [bio, setBio] = useState(initialProfile?.bio || "");
  const [location, setLocation] = useState(initialProfile?.location || "");
  const [experienceLevel, setExperienceLevel] = useState(initialProfile?.experienceLevel || "3-5 years");
  const [skills, setSkills] = useState<string[]>(initialProfile?.skills || ["React", "TypeScript", "Next.js"]);
  const [newSkill, setNewSkill] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const formData = new FormData();
      formData.append("headline", headline);
      formData.append("bio", bio);
      formData.append("location", location);
      formData.append("experienceLevel", experienceLevel);
      formData.append("skills", JSON.stringify(skills));
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const res = await updateCandidateProfileAction(formData);
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        alert("Profile and Resume updated successfully! Job match scores have been recalculated.");
      } else {
        alert(res.message);
      }
    } catch {
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="rounded-xl shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Basic Information</CardTitle>
          <CardDescription className="text-xs">
            Personal and contact details associated with your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
              <Input value={user?.name || ""} disabled className="bg-muted text-xs" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
              <Input value={user?.email || ""} disabled className="bg-muted text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Headline / Target Role</label>
              <Input
                placeholder="e.g. Senior Frontend Engineer"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Location</label>
              <Input
                placeholder="e.g. San Francisco, CA or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Years of Experience</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus:ring-1 focus:ring-primary outline-hidden"
            >
              <option value="0-1 years">Freshers (0 - 1 years)</option>
              <option value="1-3 years">Junior (1 - 3 years)</option>
              <option value="3-5 years">Mid-Level (3 - 5 years)</option>
              <option value="5-10 years">Senior (5 - 10 years)</option>
              <option value="10+ years">Lead / Principal (10+ years)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Bio / Professional Summary</label>
            <Textarea
              placeholder="Highlight your key achievements, engineering background, and domains of interest..."
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills Card */}
      <Card className="rounded-xl shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Skills & Technologies</CardTitle>
          <CardDescription className="text-xs">
            Add your core skills. The AI match engine scores all jobs based on matches against these skills.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill (e.g. Python, Docker, Figma, GraphQL)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill(e);
                }
              }}
              className="text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSkill}
              className="gap-1 text-xs shrink-0"
            >
              <Plus size={14} /> Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-3 py-1 text-xs gap-1.5 bg-primary/10 text-primary border border-primary/20"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-destructive cursor-pointer"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
            {skills.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No skills added yet. Add at least 3 skills to see match scores.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resume File Upload Card */}
      <Card className="rounded-xl shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Resume Document</CardTitle>
          <CardDescription className="text-xs">
            Upload your resume file (PDF or DOCX). Employers will be able to review this when you apply.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {initialProfile?.resumeUrl && (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2.5">
                <FileText size={20} className="text-primary" />
                <div>
                  <p className="text-xs font-semibold">
                    {initialProfile.resumeFileName || "Uploaded Resume.pdf"}
                  </p>
                  <a
                    href={initialProfile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-primary hover:underline"
                  >
                    View / Download Resume
                  </a>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px]">Active Resume</Badge>
            </div>
          )}

          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/10 transition-colors">
            <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-xs font-semibold">
              {resumeFile ? resumeFile.name : "Click to select a new resume file"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Supports PDF, DOC, DOCX up to 10MB
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setResumeFile(e.target.files[0]);
                }
              }}
              className="mt-3 text-xs mx-auto block file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 pt-2">
          <Button type="submit" disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving Profile...
              </>
            ) : savedSuccess ? (
              <>
                <Check size={16} /> Saved!
              </>
            ) : (
              "Save Profile & Update Matches"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
