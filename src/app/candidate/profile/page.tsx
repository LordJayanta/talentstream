import Header from "@/components/core/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  getCandidateProfileAction,
  getCandidateApplicationsAction,
  getCandidateSavedJobsAction,
} from "@/actions/candidate-actions";
import CandidateProfileForm from "@/components/candidate-profile-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Bookmark, Briefcase, Clock, MapPin } from "lucide-react";

export default async function CandidateProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { profile, user } = await getCandidateProfileAction();
  const { applications } = await getCandidateApplicationsAction();
  const { savedJobs } = await getCandidateSavedJobsAction();

  return (
    <div className="min-h-screen bg-accent/30">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Candidate Profile & Resume</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your profile acts as your live resume. Jobs in TalentStream are automatically scored against the skills and experience you provide here.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CandidateProfileForm
              user={user}
              initialProfile={profile}
            />
          </div>

          <aside className="space-y-6">
            {/* My Job Applications Card */}
            <Card className="rounded-xl shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Briefcase size={18} className="text-primary" />
                  My Applications ({applications?.length || 0})
                </CardTitle>
                <CardDescription className="text-xs">
                  Track status of jobs you have applied for.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {applications && applications.length > 0 ? (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="p-3 border rounded-lg bg-card space-y-2 text-xs"
                      >
                        <div className="flex justify-between items-start">
                          <Link
                            href={`/job/${app.jobId}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {app.jobTitle}
                          </Link>
                          <Badge
                            variant={
                              app.status === "shortlisted" || app.status === "hired"
                                ? "standred"
                                : "secondary"
                            }
                            className="text-[10px] capitalize"
                          >
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{app.companyName}</p>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                          <span className="font-medium text-primary">
                            {app.matchScore}% match
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No applications submitted yet.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Jobs Bookmarks */}
            <Card className="rounded-xl shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Bookmark size={18} className="text-primary" />
                  Saved Jobs ({savedJobs?.length || 0})
                </CardTitle>
                <CardDescription className="text-xs">
                  Jobs you bookmarked for later.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {savedJobs && savedJobs.length > 0 ? (
                  <div className="space-y-2.5">
                    {savedJobs.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border rounded-lg bg-card text-xs space-y-1"
                      >
                        <Link
                          href={`/job/${item.jobId}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <p className="text-muted-foreground">{item.companyName}</p>
                        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {item.location || "Remote"}
                          </span>
                          <Link
                            href={`/job/${item.jobId}`}
                            className="text-primary hover:underline font-semibold"
                          >
                            View & Apply →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No saved jobs yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
