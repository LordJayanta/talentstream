import HRHeader from "@/components/hr-sections/hr-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Building2, ShieldCheck, User } from "lucide-react";

export default async function HRProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <HRHeader title="HR Profile" />
      <main className="p-6 max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employer Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your company details and recruiter contact information.
          </p>
        </div>

        <Card className="rounded-xl shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Building2 size={18} className="text-primary" />
              Company & Organization Information
            </CardTitle>
            <CardDescription className="text-xs">
              This information is displayed on your public job postings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Company Name</label>
                <Input defaultValue="TalentStream Inc." className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Industry</label>
                <Input defaultValue="Software & Technology" className="text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Company Website</label>
                <Input defaultValue="https://talentstream.example.com" className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Headquarters</label>
                <Input defaultValue="San Francisco, CA" className="text-xs" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <User size={18} className="text-primary" />
              Hiring Manager / Recruiter Account
            </CardTitle>
            <CardDescription className="text-xs">
              Credentials and role assigned to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Representative Name</label>
                <Input defaultValue={session?.user?.name || "HR Manager"} className="text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Email Address</label>
                <Input defaultValue={session?.user?.email || ""} disabled className="bg-muted text-xs" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <ShieldCheck size={16} />
              <span>Verified Employer Role active on this account.</span>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm">Save Profile Changes</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
