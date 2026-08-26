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
    <aside className='h-screen border-r border-accent-foreground/25 p-5 space-y-8'>
      <div className="">
        <Link href="/" className='text-primary font-bold text-2xl'>TalentStream</Link>
      </div>
      <nav className="md:visible invisible flex flex-col gap-1">
        {
          navLink.map((item, index) => (
            <Link key={index} href={item.route} className={`flex items-center justify-start gap-3 px-4 py-3 rounded-[12px] ${(pathname.includes(item.route)) && 'bg-primary/15 text-primary'}`}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))
        }
      </nav>
    </aside>
  )
}
