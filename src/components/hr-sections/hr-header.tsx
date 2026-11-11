'use client';

import { Settings } from 'lucide-react';
import Link from 'next/link';
import AvatarOption from '../core/avatar-option';
import { useSession } from '@/lib/auth-client';

type Props = {
  title: string;
};

export default function HRHeader({ title }: Props) {
  const { data: session } = useSession();

  return (
    <header className='sticky top-0 z-40 h-16 w-full flex justify-between items-center px-4 sm:px-6 border-b border-accent-foreground/25 bg-background'>
      <div className="flex justify-between items-center gap-8">
        <div>
          <span className='text-secondary-foreground font-bold text-lg sm:text-2xl'>{title}</span>
        </div>
      </div>

      {session && (
        <div className="flex justify-between items-center gap-4">
          <Link href="/hr/settings" aria-label="Recruitment settings">
            <Settings size={18} className="text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
          {session?.user && <AvatarOption />}
        </div>
      )}
    </header>
  );
}
