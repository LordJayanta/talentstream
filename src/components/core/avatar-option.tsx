'use client';

import React, { useState } from 'react'
import Avatar from '../avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { BadgeCheckIcon, LogOutIcon } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function AvatarOption() {
  const [loading, setLoading] = useState<boolean>(false);

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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="ghost" size={'icon-sm'} className="rounded-full">
          <Avatar />
        </Button>}
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheckIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={handleLogout}>
            <LogOutIcon />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
