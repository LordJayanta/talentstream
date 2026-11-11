import type { Metadata } from "next";
import HRSidebar from "@/components/hr-sections/hr-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "HR Portal - Talent Stream",
  description: "Job Management - Talent Stream",
};

export default async function HRLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session) redirect("/login");
  if (session?.user?.role !== "employer") redirect("/");
  
  return (
    <div className='grid grid-cols-12 min-h-screen'>
      <div className="col-span-2">
        <HRSidebar />
      </div>
      <div className='relative col-span-10 bg-accent min-h-screen'>
        {children}
      </div>
    </div>
  );
}
