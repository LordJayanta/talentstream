"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Upload, X, Check, Loader2, Sparkles } from "lucide-react";
import { updateCandidateProfileAction } from "@/actions/candidate-actions";
import { SelectCandidateProfile } from "@/db/schema/candidates";
import { extractSkillsFromText, COMMON_TECH_SKILLS } from "@/lib/match-score";

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
  const [skills, setSkills] = useState<string[]>(initialProfile?.skills || []);
  const [resumeText, setResumeText] = useState(initialProfile?.resumeText || "");
  const [newSkill, setNewSkill] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [currentResume, setCurrentResume] = useState<{ url?: string | null; name?: string | null }>({
    url: initialProfile?.resumeUrl,
    name: initialProfile?.resumeFileName,
  });
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

  const handleAutoDetectSkills = () => {
    const combinedText = `${headline} ${bio} ${resumeText}`;
    const detected = extractSkillsFromText(combinedText);
    if (detected.length === 0) {
      alert("No recognized skills found in your headline, bio, or resume text. Add keywords like React, Python, Docker, or AWS.");
      return;
    }
    const newSkills = Array.from(new Set([...skills, ...detected]));
    const addedCount = newSkills.length - skills.length;
    setSkills(newSkills);
    if (addedCount > 0) {
      alert(`✨ Detected and added ${addedCount} skill(s): ${detected.filter((s) => !skills.includes(s)).join(", ")}`);
    } else {
      alert("All detected skills are already present in your profile list.");
    }
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
      formData.append("resumeText", resumeText);
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const res = await updateCandidateProfileAction(formData);
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        if (res.resumeUrl) {
          setCurrentResume({ url: res.resumeUrl, name: res.resumeFileName });
        }
        if (resumeFile) {
          setResumeFile(null);
          setFileInputKey((key) => key + 1);
        }
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold">Skills & Technologies</CardTitle>
              <CardDescription className="text-xs">
                Add your core skills. The AI match engine scores all jobs based on matches against these skills.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutoDetectSkills}
              className="gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/10 shrink-0 self-start sm:self-auto"
            >
              <Sparkles size={13} className="text-primary" /> Auto-Detect from Bio
            </Button>
          </div>
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

          {/* Quick Suggestions */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Popular Skill Suggestions (Click to Add):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_TECH_SKILLS.filter((s) => !skills.includes(s))
                .slice(0, 10)
                .map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setSkills([...skills, suggestion])}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-dashed border-muted-foreground/40 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  >
                    + {suggestion}
                  </button>
                ))}
            </div>
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

      {/* Resume File & Text Card */}
      <Card className="rounded-xl shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Resume & Work Experience</CardTitle>
          <CardDescription className="text-xs">
            Upload your resume file or paste your resume text. Your profile serves as a live resume for one-click job applications and AI scoring.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentResume.url && (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2.5">
                <FileText size={20} className="text-primary" />
                <div>
                  <p className="text-xs font-semibold">
                    {currentResume.name || "Uploaded Resume.pdf"}
                  </p>
                  <a
                    href={currentResume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-primary hover:underline"
                  >
                    View / Download Resume
                  </a>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px]">Active Resume File</Badge>
            </div>
          )}

          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/10 transition-colors">
            <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-xs font-semibold">
              {resumeFile ? resumeFile.name : "Click to select a new resume document"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Supports PDF, DOC, DOCX up to 10MB
            </p>
            <input
              key={fileInputKey}
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

          <div className="pt-3 border-t space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Pasted Resume / Work Summary (Optional):
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const detected = extractSkillsFromText(resumeText);
                  if (detected.length > 0) {
                    const combined = Array.from(new Set([...skills, ...detected]));
                    const addedCount = combined.length - skills.length;
                    setSkills(combined);
                    alert(`✨ Extracted ${detected.length} skills (${addedCount} new) from your resume text!`);
                  } else {
                    alert("No recognized skills found in the pasted text. Paste text mentioning your tech stack!");
                  }
                }}
                className="h-6 text-xs text-primary gap-1 hover:bg-primary/10"
              >
                <Sparkles size={12} /> Extract Skills from Text
              </Button>
            </div>
            <Textarea
              placeholder="Paste your resume sections, work history, or tech stack here..."
              rows={4}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="text-xs font-mono"
            />
            <p className="text-[11px] text-muted-foreground">
              Tip: Pasting your work history allows employers to review your qualifications directly in the candidate pipeline.
            </p>
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

