import Header from "@/components/core/header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BanknoteCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Clock3,
  GraduationCap,
  HeartPulse,
  Laptop,
  MapPin,
  Sparkles,
  TrainFront,
  TreePalm,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobByIdAction } from "@/actions/job-actions";
import JobDetailActions from "@/components/job-detail-actions";
import JobDescription from "@/components/job-description";
import { parseJobDescription } from "@/lib/job-description";
import { formatEmploymentType, timeAgo } from "@/lib/utils";

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

const BENEFIT_ICONS: Array<[RegExp, LucideIcon]> = [
  [/health|dental|vision|wellbeing|insurance/i, HeartPulse],
  [/401|equity|bonus|pension|matching/i, TrendingUp],
  [/learning|education|course|budget/i, GraduationCap],
  [/vacation|pto|time off|holiday/i, TreePalm],
  [/home office|remote|equipment|stipend/i, Laptop],
  [/commut|transport|travel/i, TrainFront],
  [/mentor|team|community|culture/i, Users],
  [/hours|schedule/i, Clock3],
];

function BenefitIcon({ label }: { label: string }) {
  const match = BENEFIT_ICONS.find(([pattern]) => pattern.test(label));
  const Icon = match?.[1] ?? Sparkles;
  return <Icon size={20} className="text-primary" />;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const result = await getJobByIdAction(id);

  if (!result.success || !result.job) {
    notFound();
  }

  const { job, hasApplied, isSaved, matchAnalysis, employerName, employerImage, isOwner, viewerRole } =
    result;

  const companyName = job.companyName || "TalentStream";
  const companyInitial = companyName.charAt(0).toUpperCase();
  const shortCompanyName = companyName.split(/\s+/)[0] || companyName;

  const { about, responsibilities } = parseJobDescription(job.description);
  const mustHaveSkills = (job.mustHaveSkills ?? []).filter(Boolean);
  const niceToHaveSkills = (job.niceToHaveSkills ?? []).filter(Boolean);
  const hasRequirements = mustHaveSkills.length > 0 || niceToHaveSkills.length > 0;
  const benefits = (job.companyBenefits as unknown as { id: string; label: string }[]) ?? [];

  const scoreTone =
    matchAnalysis.score >= 80
      ? { border: "border-emerald-500", text: "text-emerald-700" }
      : matchAnalysis.score >= 60
        ? { border: "border-primary", text: "text-primary" }
        : { border: "border-amber-500", text: "text-amber-700" };

  const hiringContact = employerName || companyName;
  const hiringInitial = hiringContact.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-accent/40">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <main className="space-y-6 lg:col-span-8">
            {/* Job header */}
            <Card className="gap-0 rounded-xl py-0">
              <div className="p-6 sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-xl border bg-muted/40 text-2xl font-bold text-primary sm:size-20">
                      {companyInitial}
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{job.title}</h1>
                      <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{companyName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={14} />
                          {job.location || "Remote"}
                        </span>
                        {job.department && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{job.department}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <JobDetailActions
                      jobId={job.id}
                      initialApplied={hasApplied}
                      initialSaved={isSaved}
                      isOwner={isOwner}
                      viewerRole={viewerRole}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
                  <Badge variant="outline" className="rounded-full px-3 py-1.5">
                    <BriefcaseBusiness size={14} className="mr-1" />
                    {formatEmploymentType(job.employmentType)}
                  </Badge>
                  <Badge variant="outline" className="rounded-full px-3 py-1.5">
                    <BanknoteCheck size={14} className="mr-1" />
                    {formatSalary(job.minSalary, job.maxSalary)}
                  </Badge>
                  <Badge variant="outline" className="rounded-full px-3 py-1.5">
                    <Clock size={14} className="mr-1" />
                    Posted {timeAgo(job.createdAt)}
                  </Badge>
                  {job.experience && (
                    <Badge variant="outline" className="rounded-full px-3 py-1.5">
                      <Sparkles size={14} className="mr-1" />
                      {job.experience} yrs exp
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* About the role */}
            {about && (
              <Card className="gap-0 rounded-xl py-0">
                <div className="p-6 sm:p-7">
                  <h2 className="text-xl font-bold tracking-tight">About the Role</h2>
                  <div className="mt-4">
                    <JobDescription markdown={about} />
                  </div>
                </div>
              </Card>
            )}

            {/* Responsibilities and requirements */}
            {(responsibilities.length > 0 || hasRequirements) && (
              <section
                className={
                  responsibilities.length > 0 && hasRequirements
                    ? "grid grid-cols-1 gap-6 md:grid-cols-2"
                    : "grid grid-cols-1 gap-6"
                }
              >
                {responsibilities.length > 0 && (
                  <Card className="gap-0 rounded-xl py-0">
                    <div className="p-6">
                      <h2 className="text-xl font-bold tracking-tight">Key Responsibilities</h2>
                      <ul className="mt-4 space-y-3">
                        {responsibilities.map((item, index) => (
                          <li
                            key={`${item}-${index}`}
                            className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80"
                          >
                            <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                )}

                {hasRequirements && (
                  <Card className="gap-0 rounded-xl py-0">
                    <div className="p-6">
                      <h2 className="text-xl font-bold tracking-tight">Requirements</h2>

                      {mustHaveSkills.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-[11px] font-semibold tracking-wide text-foreground uppercase">
                            Must-Haves
                          </h3>
                          <ul className="mt-2 space-y-2 border-l-2 border-primary/70 pl-3 text-sm leading-relaxed text-foreground/80">
                            {mustHaveSkills.map((skill, index) => (
                              <li key={`${skill}-${index}`}>{skill}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {niceToHaveSkills.length > 0 && (
                        <div className={mustHaveSkills.length > 0 ? "mt-5" : "mt-4"}>
                          <h3 className="text-[11px] font-semibold tracking-wide text-foreground uppercase">
                            Nice-to-Haves
                          </h3>
                          <ul className="mt-2 space-y-2 border-l-2 border-border pl-3 text-sm leading-relaxed text-foreground/80">
                            {niceToHaveSkills.map((skill, index) => (
                              <li key={`${skill}-${index}`}>{skill}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </section>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <Card className="gap-0 rounded-xl py-0">
                <div className="p-6 sm:p-7">
                  <h2 className="text-xl font-bold tracking-tight">Life at {shortCompanyName}</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {benefits.map((benefit, index) => {
                      const label = benefit.label || String(benefit);
                      return (
                        <div
                          key={`${label}-${index}`}
                          className="rounded-lg border bg-muted/30 p-5"
                        >
                          <BenefitIcon label={label} />
                          <h3 className="mt-3 text-sm font-semibold">{label}</h3>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-4">
            {viewerRole === "candidate" && (
              <Card className="gap-0 rounded-xl bg-primary/[0.035] py-0 ring-primary/15">
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-primary" />
                    <h2 className="text-lg font-bold">AI Match Breakdown</h2>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <div
                      className={`flex size-18 shrink-0 items-center justify-center rounded-xl border-2 bg-card ${scoreTone.border}`}
                    >
                      <span className={`text-2xl font-bold ${scoreTone.text}`}>
                        {matchAnalysis.score}%
                      </span>
                    </div>
                    <div>
                      <p className={`font-semibold ${scoreTone.text}`}>{matchAnalysis.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Based on your candidate profile and skills.
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-6 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    Skills Comparison
                  </h3>
                  {matchAnalysis.skills.length > 0 ? (
                    <ul className="mt-3 space-y-2.5 text-sm">
                      {matchAnalysis.skills.map((item, index) => (
                        <li key={`${item.skill}-${index}`} className="flex items-center justify-between gap-3">
                          <span className="flex items-center gap-2 text-foreground/90">
                            <span
                              aria-hidden="true"
                              className={`size-2 rounded-full ${
                                item.matched ? "bg-emerald-500" : "bg-muted-foreground/40"
                              }`}
                            />
                            {item.skill}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              item.matched ? "text-emerald-700" : "text-muted-foreground"
                            }`}
                          >
                            {item.matched ? "100%" : "Not Found"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Add skills to your profile to see a matching breakdown.
                    </p>
                  )}

                  <Link
                    href="/candidate/profile"
                    className="mt-5 inline-block text-xs font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    Update profile to improve match score
                  </Link>
                </div>
              </Card>
            )}

            <Card className="gap-0 rounded-xl py-0">
              <div className="p-6">
                <h2 className="text-lg font-bold">Hiring Team</h2>
                <div className="mt-4 flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
                  <Avatar size="lg" className="size-12">
                    {employerImage ? (
                      <AvatarImage src={employerImage} alt={hiringContact} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
                      {hiringInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{hiringContact}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {employerName ? `Hiring Manager · ${companyName}` : "Verified Employer"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
