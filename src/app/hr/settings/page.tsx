import HRHeader from "@/components/hr-sections/hr-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function HRSettingsPage() {
  return (
    <div>
      <HRHeader title="Recruitment Settings" />
      <main className="p-6 max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Matching rules currently applied across the recruitment pipeline.
          </p>
        </div>

        <Card className="rounded-xl shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              AI Matching Engine Preferences
            </CardTitle>
            <CardDescription className="text-xs">
              These rules are applied automatically to every applicant score.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs text-foreground">Auto-Highlight Exceptional Matches</p>
                <p className="text-[11px] text-muted-foreground">
                  Candidates with a match score over 85% are highlighted in the pipeline.
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 size={16} /> Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div className="space-y-0.5">
                <p className="font-semibold text-xs text-foreground">Prioritize Must-Have Skills Weighting</p>
                <p className="text-[11px] text-muted-foreground">
                  Must-have skills carry 75% of the score and nice-to-have skills the remaining 25%.
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <CheckCircle2 size={16} /> Active
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
