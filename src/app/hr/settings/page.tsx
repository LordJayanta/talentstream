import HRHeader from "@/components/hr-sections/hr-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Sparkles } from "lucide-react";

export default function HRSettingsPage() {
  return (
    <div>
      <HRHeader title="Recruitment Settings" />
      <main className="p-6 max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure matching rules, notifications, and default pipeline preferences.
          </p>
        </div>

        {/* AI Matching Rules */}
        <Card className="rounded-xl shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              AI Matching Engine Preferences
            </CardTitle>
            <CardDescription className="text-xs">
              Define how applicant scores are calculated and highlighted in your pipeline.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs text-foreground">Auto-Highlight Exceptional Matches</p>
                <p className="text-[11px] text-muted-foreground">
                  Highlight candidates with match score over 85% with an exceptional badge.
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs text-foreground">Prioritize Must-Have Skills Weighting</p>
                <p className="text-[11px] text-muted-foreground">
                  Give 75% score weight to must-have skills and 25% to nice-to-have skills.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="rounded-xl shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              Notifications & Alerts
            </CardTitle>
            <CardDescription className="text-xs">
              Configure when you receive notifications about incoming applicants.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs text-foreground">Instant Application Notification</p>
                <p className="text-[11px] text-muted-foreground">
                  Notify hiring team immediately when a candidate applies.
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs text-foreground">Daily Candidate Digest</p>
                <p className="text-[11px] text-muted-foreground">
                  Receive a daily summary of all new candidate applications across your jobs.
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-2">
            <Button size="sm">Save Preferences</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
