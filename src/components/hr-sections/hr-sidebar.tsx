'use client';

import { BriefcaseBusiness, ChartNoAxesColumnIncreasing, LayoutDashboard, Settings, UserRoundPen, Users } from 'lucide-react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

type NavLink = {
  icon: React.ReactNode;
  label: string;
  route: string;
}

const navLink: NavLink[] = [
  {
    icon: <LayoutDashboard size={18} />,
    label: 'Dashboard',
    route: '/hr/dashboard'
  },
  {
    icon: <BriefcaseBusiness size={18} />,
    label: 'Job Postings',
    route: '/hr/job'
  },
  {
    icon: <Users size={18} />,
    label: 'Candidate Pipeline',
    route: '/hr/candidate'
  },
  {
    icon: <ChartNoAxesColumnIncreasing size={18} />,
    label: 'Analytics',
    route: '/hr/analytics'
  },
  {
    icon: <UserRoundPen size={18} />,
    label: 'HR Profile',
    route: '/hr/profile'
  },
  {
    icon: <Settings size={18} />,
    label: 'Settings',
    route: '/hr/settings'
  },
]


export default function HRSidebar() {
  const pathname = usePathname();

  return (
    <aside className='border-b md:border-b-0 md:border-r border-accent-foreground/25 p-3 md:p-5 md:h-screen md:sticky md:top-0 space-y-3 md:space-y-8'>
      <div className="">
        <Link href="/" className='text-primary font-bold text-xl md:text-2xl'>TalentStream</Link>
      </div>
      <nav className="flex gap-1 overflow-x-auto md:overflow-visible md:flex-col pb-1 md:pb-0">
        {
          navLink.map((item, index) => (
            <Link key={index} href={item.route} className={`flex items-center justify-start gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-[12px] text-xs md:text-sm whitespace-nowrap shrink-0 ${(pathname.includes(item.route)) && 'bg-primary/15 text-primary'}`}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))
        }
      </nav>
    </aside>
  )
}
