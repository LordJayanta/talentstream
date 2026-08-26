import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import HRSidebar from "@/components/hr-sections/hr-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "New Job - Talent Stream",
  description: "Job Editor - Talent Stream",
};

export default async function HRLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if(!session) redirect("/login");
  if(session?.user?.role !== "employer") redirect("/");
  
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <div className='grid grid-cols-12'>
          <div className="col-span-2">
            <HRSidebar />
          </div>
          <div className='relative col-span-10 bg-accent'>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
