'use client';

import { Bell, Settings } from 'lucide-react';
import AvatarOption from '../core/avatar-option';
import { useSession } from '@/lib/auth-client';

type Props = {
  title: string;
};

export default function HRHeader({ title }: Props) {
  const { data: session } = useSession();

  return (
    <div className='h-16 w-full'>
      <header className='absolute top-0 h-16 w-full flex justify-between items-center px-6 border-b border-accent-foreground/25 bg-background'>
        <div className="flex justify-between items-center gap-8">
          <div>
            <span className='text-secondary-foreground font-bold text-2xl'>{title}</span>
          </div>
        </div>

        {session && (
          <div className="flex justify-between items-center gap-4">
            <Bell size={18} className="text-muted-foreground" />
            <Settings size={18} className="text-muted-foreground" />
            {session?.user && <AvatarOption />}
          </div>
        )}
      </header>
    </div>
  );
}
