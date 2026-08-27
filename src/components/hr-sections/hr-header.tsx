'use server'

import Link from 'next/link'
import { Bell, Settings } from 'lucide-react'
import AvatarOption from '../core/avatar-option';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

type Props = {
  title: string;
}

async function HRHeader({ title }: Props) {
  const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    if (!session) redirect("/login");
    if (session?.user?.role !== "employer") redirect("/");
  
  return (
    <div className='h-16 w-full'>
      <header className='absolute top-0 h-16 w-full flex justify-between items-center px-6 border-b border-accent-foreground/25'>
        <div className="flex justify-between items-center gap-8">
          <div className="">
            <Link href="/" className='text-secondary-foreground font-bold text-2xl'>{title}</Link>
          </div>
        </div>

        {session  && <div className="flex justify-between items-center gap-4">
          <Bell />
          <Settings />
          {session?.user && <AvatarOption />}
        </div>}
      </header>
    </div>
  )
}

export default HRHeader