import Header from "@/components/core/header";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BanknoteCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle,
  Clock,
  Dot,
  MapPin,
  Sparkles,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobByIdAction } from "@/actions/job-actions";
import JobDetailActions from "@/components/job-detail-actions";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatSalary(min?: number | null, max?: number | null) {
  if (!min && !max) return "Competitive Salary";
  if (min && max) {
    const minK = min >= 1000 ? `$${Math.round(min / 1000)}k` : `$${min}`;
    const maxK = max >= 1000 ? `$${Math.round(max / 1000)}k` : `$${max}`;
    return `${minK} - ${maxK} / year`;
  }
  if (min) return `From $${min >= 1000 ? Math.round(min / 1000) + "k" : min} / year`;
  return `Up to $${max! >= 1000 ? Math.round(max! / 1000) + "k" : max} / year`;
}

function timeAgo(dateInput: Date | string) {
  const date = new Date(dateInput);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) return "Posted today";
  if (diffInDays === 1) return "Posted yesterday";
  return `Posted ${diffInDays} days ago`;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const result = await getJobByIdAction(id);

  if (!result.success || !result.job) {
    notFound();
  }

  const { job, hasApplied, isSaved, matchAnalysis, isOwner } = result;

  const mustHaveSkills = job.mustHaveSkills ?? [];
  const niceToHaveSkills = job.niceToHaveSkills ?? [];
  const benefits = (job.companyBenefits as unknown as { id: string; label: string }[]) ?? [];

  return (
    <div className="min-h-screen bg-accent/40">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8 space-y-6">
            {/* Job Details Header */}
            <Card className="rounded-xl shadow-xs">
              <CardHeader className="gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
                      <Building2 size={32} />
                    </div>
                    <div>
                      <CardTitle>
                        <h1 className="font-bold text-2xl sm:text-3xl tracking-tight">
                          {job.title}
                        </h1>
                      </CardTitle>

                      <CardDescription className="flex flex-wrap items-center gap-2 mt-1.5 text-sm">
                        <span className="font-semibold text-foreground">
                          {job.companyName || "TalentStream"}
                        </span>
                        <Dot className="text-muted-foreground" />
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin size={14} />
                          {job.location || "Remote"}
                        </span>
                        {job.department && (
                          <>
                            <Dot className="text-muted-foreground" />
                            <span className="text-muted-foreground">{job.department}</span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>

                  <CardAction>
                    <JobDetailActions
                      jobId={job.id}
                      initialApplied={hasApplied}
                      initialSaved={isSaved}
                      isOwner={isOwner}
                    />
                  </CardAction>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-2 border-t">
                  <Badge variant="secondary" className="px-3 py-1 text-xs">
                    <BriefcaseBusiness size={14} className="mr-1.5" />
                    {job.employmentType || "Full Time"}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-xs">
                    <BanknoteCheck size={14} className="mr-1.5" />
                    {formatSalary(job.minSalary, job.maxSalary)}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-xs">
                    <Clock size={14} className="mr-1.5" />
                    {timeAgo(job.createdAt)}
                  </Badge>
                  {job.experience && (
                    <Badge variant="secondary" className="px-3 py-1 text-xs">
                      <Sparkles size={14} className="mr-1.5" />
                      {job.experience} yrs exp
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card className="rounded-xl shadow-xs">
              <CardHeader>
                <CardTitle className="text-lg font-bold">About the Role</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-zinc dark:prose-invert max-w-none text-foreground/90 whitespace-pre-line leading-relaxed text-sm">
                {job.description}
              </CardContent>
            </Card>

            {/* Required & Nice-to-Have Skills */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-xl shadow-xs">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    Must-Have Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mustHaveSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {mustHaveSkills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs px-2.5 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">General qualifications apply.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-xs">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground" />
                    Nice-to-Have Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {niceToHaveSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {niceToHaveSkills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs px-2.5 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No extra preferences listed.</p>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Benefits & Perks */}
            {benefits.length > 0 && (
              <Card className="rounded-xl shadow-xs">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 text-sm"
                      >
                        <Sparkles size={16} className="text-primary shrink-0" />
                        <span className="font-medium">{benefit.label || String(benefit)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </main>

          {/* Right Sidebar - Match Breakdown & Hiring Info */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Match Breakdown Card */}
            <Card className="rounded-xl shadow-xs border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-primary" />
                    <CardTitle className="text-base font-bold">AI Match Breakdown</CardTitle>
                  </div>
                  <div
                    className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                      matchAnalysis.score >= 80
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : matchAnalysis.score >= 60
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-amber-50 text-amber-700 border-amber-300"
                    }`}
                  >
                    {matchAnalysis.score}% Match
                  </div>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  {matchAnalysis.label} based on your candidate profile and skills.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-3 pt-4 text-xs">
                <div className="space-y-2">
                  <h6 className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                    Skills Comparison
                  </h6>
                  {matchAnalysis.skills.length > 0 ? (
                    <div className="space-y-1.5">
                      {matchAnalysis.skills.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-foreground/90">{item.skill}</span>
                          {item.matched ? (
                            <span className="flex items-center gap-1 text-emerald-600 font-medium text-[11px]">
                              <CheckCircle size={13} />
                              Matched
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-muted-foreground text-[11px]">
                              <XCircle size={13} />
                              Missing
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs">
                      Update your candidate profile with skills to see matching breakdown.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Link href="/candidate/profile" className="w-full">
                  <span className="text-xs text-primary hover:underline text-center block">
                    Update profile to improve match score →
                  </span>
                </Link>
              </CardFooter>
            </Card>

            {/* Hiring Team Info */}
            <Card className="rounded-xl shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold">Company & Hiring Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3.5 p-3.5 bg-muted/40 rounded-xl border">
                  <div className="w-12 h-12 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-lg">
                    {job.companyName ? job.companyName[0].toUpperCase() : "T"}
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm">{job.companyName || "TalentStream"}</h5>
                    <p className="text-xs text-muted-foreground">Verified Employer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
