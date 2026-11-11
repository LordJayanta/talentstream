'use client';

import React, { useState } from 'react'
import Avatar from '../avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { BadgeCheckIcon, LogOutIcon } from 'lucide-react'
import { authClient, useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function AvatarOption() {
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);

    try {
      const { data, error } = await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/');
            router.refresh();
          }
        }
      });

      if (error) throw error;

      console.log(data);
    } catch (error) {
      console.error(error);
      alert((error as Error)?.message);
    } finally {
      setLoading(false);
    }
  }
  const isEmployer = session?.user && (session.user as { role?: string }).role === 'employer';
  const profileRoute = isEmployer ? '/hr/profile' : '/candidate/profile';
  const displayName = session?.user?.name?.trim() || session?.user?.email || '';
  const fallbackWord = displayName ? displayName[0].toUpperCase() : '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="ghost" size={'icon-sm'} className="rounded-full">
          <Avatar
            src={(session?.user as { image?: string | null } | undefined)?.image ?? undefined}
            fallbackWord={fallbackWord}
          />
        </Button>}
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(profileRoute)}>
            <BadgeCheckIcon />
            {isEmployer ? 'HR Profile' : 'Profile & Resume'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' disabled={loading} onClick={handleLogout}>
            <LogOutIcon />
            {loading ? "Logging out..." : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
