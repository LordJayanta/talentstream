import HRHeader from "@/components/hr-sections/hr-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHRDashboardMetricsAction } from "@/actions/application-actions";
import { getEmployerJobsAction } from "@/actions/job-actions";
import { BarChart3, TrendingUp, Users, CheckCircle2 } from "lucide-react";

export default async function AnalyticsPage() {
  const { metrics } = await getHRDashboardMetricsAction();
  const { jobs } = await getEmployerJobsAction();

  const total = metrics.totalApplicants || 1; // avoid divide by zero
  const shortlistedPct = Math.round((metrics.shortlisted / total) * 100);
  const reviewingPct = Math.round((metrics.underReview / total) * 100);

  return (
    <div>
      <HRHeader title="Recruitment Analytics" />
      <main className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hiring Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Key performance indicators, pipeline velocity, and candidate match quality.
          </p>
        </div>

        {/* Funnel Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-xl shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Total Applications</span>
                <Users size={18} className="text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-extrabold">{metrics.totalApplicants}</div>
              <p className="text-xs text-muted-foreground">Inflow across all open roles</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Under Active Review</span>
                <TrendingUp size={18} className="text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-extrabold">{metrics.underReview}</div>
              <p className="text-xs text-muted-foreground">{reviewingPct}% of total candidate pool</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, reviewingPct)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Shortlist Conversion</span>
                <CheckCircle2 size={18} className="text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-extrabold">{metrics.shortlisted}</div>
              <p className="text-xs text-muted-foreground">{shortlistedPct}% qualified candidate rate</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, shortlistedPct)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Breakdown by Job Requisitions */}
        <Card className="rounded-xl shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" />
              Requisition Pipeline Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              Candidate volume and status distribution for each active job post.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {jobs && jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 border rounded-xl bg-card space-y-2"
                  >
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{job.title}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {job.department || "General"}
                        </Badge>
                      </div>
                      <span className="text-xs font-semibold text-primary">
                        {job.applicantsCount} applicants
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden flex">
                      <div
                        className="bg-primary h-2"
                        style={{
                          width: `${Math.min(
                            100,
                            metrics.totalApplicants > 0
                              ? (job.applicantsCount / metrics.totalApplicants) * 100
                              : 0
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-6 text-center">
                Post jobs to see applicant pipeline analytics.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
