import HRHeader from "@/components/hr-sections/hr-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { Building2, ShieldCheck, User } from "lucide-react";

async function updateRecruiterName(formData: FormData) {
  "use server";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return;

  const name = (formData.get("name") as string)?.trim();
  if (!name) return;

  await db.update(user).set({ name }).where(eq(user.id, session.user.id));
  revalidatePath("/hr/profile");
}

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
            Manage your recruiter account details.
          </p>
        </div>

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
          <CardContent>
            <form action={updateRecruiterName} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="recruiter-name" className="text-xs font-semibold">
                    Representative Name
                  </label>
                  <Input
                    id="recruiter-name"
                    name="name"
                    defaultValue={session?.user?.name || ""}
                    className="text-xs"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="recruiter-email" className="text-xs font-semibold">
                    Email Address
                  </label>
                  <Input
                    id="recruiter-email"
                    defaultValue={session?.user?.email || ""}
                    disabled
                    className="bg-muted text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <ShieldCheck size={16} />
                <span>Verified Employer Role active on this account.</span>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" size="sm">
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Building2 size={18} className="text-primary" />
              Company Information
            </CardTitle>
            <CardDescription className="text-xs">
              Company name and role details are set on each job posting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              To change the company name shown on a public listing, edit that job from{" "}
              <a href="/hr/job" className="text-primary underline underline-offset-2 hover:text-primary/80">
                Job Postings
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
