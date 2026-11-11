import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import AvatarOption from './avatar-option'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Briefcase, User } from 'lucide-react'

async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className='h-16 w-full'>
      <header className='fixed top-0 left-0 right-0 z-50 h-16 w-full flex justify-between items-center px-6 border-b bg-background/95 backdrop-blur-sm'>
        <div className="flex justify-between items-center gap-8">
          <div>
            <Link href="/" className='text-primary font-bold text-2xl tracking-tight'>TalentStream</Link>
          </div>
          <nav className="hidden md:flex justify-between items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Find Jobs</Link>
            {session?.user?.role === "employer" && (
              <Link href="/hr/dashboard" className="text-primary hover:text-primary/80 font-semibold flex items-center gap-1.5">
                <Briefcase size={16} />
                HR Portal
              </Link>
            )}
            {session?.user?.role === "candidate" && (
              <Link href="/candidate/profile" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                <User size={16} />
                My Resume & Profile
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="flex items-center gap-3">
              {session.user.role === "employer" ? (
                <Link href="/hr/job/new">
                  <Button size="sm" className="hidden sm:inline-flex">
                    Post a Job
                  </Button>
                </Link>
              ) : (
                <Link href="/candidate/profile">
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    Edit Resume
                  </Button>
                </Link>
              )}
              <AvatarOption />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default Header