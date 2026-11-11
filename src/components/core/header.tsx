import Link from 'next/link'
import React from 'react'
import { buttonVariants } from '../ui/button'
import AvatarOption from './avatar-option'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Briefcase, Search, User } from 'lucide-react'

async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className='h-16 w-full'>
      <header className='fixed top-0 left-0 right-0 z-50 h-16 w-full flex justify-between items-center px-4 sm:px-6 border-b bg-background/95 backdrop-blur-sm'>
        <div className="flex justify-between items-center gap-4 sm:gap-8">
          <div>
            <Link href="/" className='text-primary font-bold text-xl sm:text-2xl tracking-tight'>TalentStream</Link>
          </div>
          <nav className="flex justify-between items-center gap-3 sm:gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1.5" aria-label="Find Jobs">
              <Search size={16} className="sm:hidden" />
              <span className="hidden sm:inline">Find Jobs</span>
            </Link>
            {session?.user?.role === "employer" && (
              <Link href="/hr/dashboard" className="text-primary hover:text-primary/80 font-semibold flex items-center gap-1.5" aria-label="HR Portal">
                <Briefcase size={16} />
                <span className="hidden sm:inline">HR Portal</span>
              </Link>
            )}
            {session?.user?.role === "candidate" && (
              <Link href="/candidate/profile" className="hover:text-foreground transition-colors flex items-center gap-1.5" aria-label="My Resume & Profile">
                <User size={16} />
                <span className="hidden sm:inline">My Resume &amp; Profile</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {session?.user ? (
            <div className="flex items-center gap-3">
              {session.user.role === "employer" ? (
                <Link href="/hr/job/new" className={buttonVariants({ size: "sm", className: "hidden sm:inline-flex" })}>
                  Post a Job
                </Link>
              ) : (
                <Link href="/candidate/profile" className={buttonVariants({ variant: "outline", size: "sm", className: "hidden sm:inline-flex" })}>
                  Edit Resume
                </Link>
              )}
              <AvatarOption />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>Sign In</Link>
              <Link href="/signup" className={buttonVariants({ size: "sm" })}>Get Started</Link>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default Header