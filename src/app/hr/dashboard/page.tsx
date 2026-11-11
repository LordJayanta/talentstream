import HRHeader from "@/components/hr-sections/hr-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Briefcase,
  Users,
  UserCheck,
  Clock,
  Sparkles,
  CirclePlus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { getHRDashboardMetricsAction } from "@/actions/application-actions";

export default async function Page() {
  const { metrics, recentApplications } = await getHRDashboardMetricsAction();

  const statCards = [
    {
      title: "Active Job Posts",
      value: metrics.activeJobs,
      subtext: "Open for applications",
      icon: <Briefcase className="text-primary" size={22} />,
      href: "/hr/job",
    },
    {
      title: "Total Applicants",
      value: metrics.totalApplicants,
      subtext: "Across all postings",
      icon: <Users className="text-blue-500" size={22} />,
      href: "/hr/candidate",
    },
    {
      title: "Under Review",
      value: metrics.underReview,
      subtext: "Awaiting your evaluation",
      icon: <Clock className="text-amber-500" size={22} />,
      href: "/hr/candidate",
    },
    {
      title: "Shortlisted",
      value: metrics.shortlisted,
      subtext: "High-potential matches",
      icon: <UserCheck className="text-emerald-500" size={22} />,
      href: "/hr/candidate",
    },
  ];

  return (
    <div>
      <HRHeader title="Recruitment Dashboard" />
      <main className="p-6 space-y-8">
        {/* Welcome Banner & Quick Post Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border shadow-xs">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Recruiter Overview
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor hiring velocity, candidate matches, and active requisitions in real time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/hr/job/new" className={buttonVariants({ className: "gap-2" })}>
              <CirclePlus size={18} />
              <span>Post New Job</span>
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, idx) => (
            <Link key={idx} href={card.href}>
              <Card className="rounded-xl shadow-xs hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {card.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-muted/50">{card.icon}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold">{card.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{card.subtext}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Applications Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Recent Applications</h2>
              <p className="text-xs text-muted-foreground">
                Latest candidates who applied to your open positions.
              </p>
            </div>
            <Link
              href="/hr/candidate"
              className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5 text-xs" })}
            >
              <span>View All Candidates</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="border rounded-xl bg-card overflow-x-auto shadow-xs">
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job Role</TableHead>
                  <TableHead className="text-center">AI Match</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Applied Date</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications && recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/20">
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {app.applicantName[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-foreground">
                              {app.applicantName}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {app.applicantEmail}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {app.jobTitle}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className="text-[11px] font-semibold gap-1"
                        >
                          <Sparkles size={11} className="text-primary" />
                          {app.matchScore != null ? `${app.matchScore}%` : "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            app.status === "shortlisted" || app.status === "hired"
                              ? "standred"
                              : "secondary"
                          }
                          className="capitalize text-[10px] rounded-full"
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Link
                          href={`/hr/candidate?jobId=${app.jobId}`}
                          className={buttonVariants({ variant: "ghost", size: "sm", className: "text-xs h-7" })}
                        >
                          Review
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground text-xs">
                      No applications received yet. Once candidates apply, they will appear here.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>
    </div>
  );
}
