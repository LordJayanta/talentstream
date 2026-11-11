"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Bot, Loader2, MapPin, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import JobFeed from "@/components/job-feed";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { JobFilterOptions } from "@/actions/job-actions";
import { autoApplyTopMatchesAction } from "@/actions/candidate-actions";
import Link from "next/link";
import { JobCardData } from "./job-card";

interface JobSearchFeedProps {
  initialJobs?: JobCardData[];
  viewerRole?: string | null;
}

export default function JobSearchFeed({ initialJobs = [], viewerRole }: JobSearchFeedProps) {
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [minSalary, setMinSalary] = useState<string>("");
  const [maxSalary, setMaxSalary] = useState<string>("");
  const [isAutoApplying, setIsAutoApplying] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [appliedFilters, setAppliedFilters] = useState<JobFilterOptions>({});

  const handleAutoApply = async () => {
    if (
      !confirm(
        "Apply to every open role where you match 85% or higher? This cannot be undone."
      )
    ) {
      return;
    }
    setIsAutoApplying(true);
    try {
      const res = await autoApplyTopMatchesAction(85);
      alert(res.message);
      if (res.success) {
        setRefreshKey((key) => key + 1);
      }
    } catch {
      alert("Please sign in as a candidate to use Auto-Apply.");
    } finally {
      setIsAutoApplying(false);
    }
  };

  const handleSearch = () => {
    setAppliedFilters({
      search: searchInput.trim() || undefined,
      location: locationInput.trim() || undefined,
      isRemote: isRemote || undefined,
      employmentType: selectedType || undefined,
      minSalary: minSalary ? Number.parseInt(minSalary, 10) : undefined,
      maxSalary: maxSalary ? Number.parseInt(maxSalary, 10) : undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleRemote = () => {
    const next = !isRemote;
    setIsRemote(next);
    setAppliedFilters((prev) => ({ ...prev, isRemote: next || undefined }));
  };

  const toggleType = (type: string) => {
    const next = selectedType === type ? "" : type;
    setSelectedType(next);
    setAppliedFilters((prev) => ({ ...prev, employmentType: next || undefined }));
  };

  return (
    <>
      {/* Search Bar Section */}
      <section className="py-10 bg-gradient-to-b from-background to-accent/30 border-b">
        <div className="max-w-4xl mx-auto flex flex-col gap-6 px-4">
          <div className="text-center space-y-2">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Find Your Next Great Match
            </h1>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Smart AI matching connects you with top jobs matching your skills and experience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center bg-card p-2 rounded-xl shadow-xs border">
            <InputGroup className="h-12 w-full sm:w-72">
              <InputGroupInput
                placeholder="Job title, skill, or department..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <InputGroupAddon>
                <Search size={18} className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>

            <InputGroup className="h-12 w-full sm:w-60">
              <InputGroupInput
                placeholder="Location or Remote..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <InputGroupAddon>
                <MapPin size={18} className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>

            <InputGroupButton
              onClick={handleSearch}
              className="h-12 w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Search Jobs
            </InputGroupButton>
          </div>

          <div className="flex flex-wrap gap-2 items-center justify-center">
            <button
              type="button"
              onClick={toggleRemote}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                isRemote
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground hover:bg-accent"
              }`}
            >
              {isRemote ? "✓ Remote Only" : "+ Remote Only"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchInput("Engineering");
                setAppliedFilters((prev) => ({ ...prev, search: "Engineering" }));
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium border bg-background text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              Engineering
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchInput("Design");
                setAppliedFilters((prev) => ({ ...prev, search: "Design" }));
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium border bg-background text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              Design
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setLocationInput("");
                setIsRemote(false);
                setSelectedType("");
                setMinSalary("");
                setMaxSalary("");
                setAppliedFilters({});
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-dashed text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="col-span-1 space-y-6">
          <Card className="rounded-xl shadow-xs">
            <CardHeader className="flex flex-row gap-2 items-center pb-3">
              <SlidersHorizontal size={18} className="text-primary" />
              <CardTitle className="text-base font-bold">Filters</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-5 pt-4">
              <div className="space-y-2.5">
                <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Employment Type
                </h2>
                <div className="space-y-1.5 text-sm">
                  {[
                    { label: "Full Time", value: "FULL_TIME" },
                    { label: "Part Time", value: "PART_TIME" },
                    { label: "Contract", value: "CONTRACT" },
                    { label: "Internship", value: "INTERNSHIP" },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center gap-2 cursor-pointer text-foreground/80 hover:text-foreground"
                    >
                      <input
                        type="radio"
                        name="employment-type-filter"
                        checked={selectedType === item.value}
                        onChange={() => toggleType(item.value)}
                        className="border-input text-primary focus:ring-primary h-4 w-4"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2.5">
                <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Salary Range (Annual)
                </h2>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min ($)"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="h-9 text-xs"
                  />
                  <Input
                    type="number"
                    placeholder="Max ($)"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSearch}
                  className="w-full text-xs h-8"
                >
                  Apply Salary Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Smart Match Banner */}
          {viewerRole === "candidate" && (
            <Card className="rounded-xl bg-card border-primary/20 shadow-xs">
              <CardHeader className="flex flex-row gap-2 items-center pb-2">
                <Sparkles size={20} className="text-primary" />
                <CardTitle className="text-sm font-bold">Smart Match Active</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Jobs are scored based on your resume and skills. Update your profile to see your exact match percentage.
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href="/candidate/profile"
                  className={buttonVariants({ variant: "outline", size: "sm", className: "w-full text-xs" })}
                >
                  Update Resume &amp; Skills
                </Link>
              </CardFooter>
            </Card>
          )}

          {/* AI Auto-Apply Assistant */}
          {viewerRole === "candidate" && (
            <Card className="rounded-xl bg-primary/5 border-primary/25 shadow-xs">
              <CardHeader className="flex flex-row gap-2 items-center pb-2">
                <Bot size={18} className="text-primary" />
                <CardTitle className="text-sm font-bold">AI Auto-Apply</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Instantly submit your profile to all open roles where you have an 85%+ match score.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="default"
                  size="sm"
                  disabled={isAutoApplying}
                  onClick={handleAutoApply}
                  className="w-full text-xs gap-1.5"
                >
                  {isAutoApplying ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Applying to Matches...
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      Auto-Apply Top Matches
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </aside>

        {/* Job Listings Column */}
        <div className="col-span-1 md:col-span-3">
          <JobFeed
            initialJobs={initialJobs}
            initialFilters={appliedFilters}
            viewerRole={viewerRole}
            refreshKey={refreshKey}
          />
        </div>
      </section>
    </>
  );
}
