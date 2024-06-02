'use client';

import { MemberRole } from '@prisma/client';

import type { ServerWithMembersWithProfiles } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react';
import { useModal } from '@/hooks/useModalStore';

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export default function ServerHeader({ server, role }: ServerHeaderProps) {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  const { onOpen } = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        <button className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
          {server.name}
          <ChevronDown className='ml-auto h-5 w-5' />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-56 text-xs font-medium to-black dark:text-neutral-400 space-y-[2px]'>
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen('invite')}
            className='text-indigo-500 dark:text-indigo-300 px-3 py-2 text-sm cursor-pointer'
          >
            Invite People
            <UserPlus className='ml-auto h-5 w-5' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className='text-indigo-500 dark:text-indigo-300 px-3 py-2 text-sm cursor-pointer'>
            Server Settings
            <Settings className='ml-auto h-5 w-5' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className='text-indigo-500 dark:text-indigo-300 px-3 py-2 text-sm cursor-pointer'>
            Manage Members
            <Users className='ml-auto h-5 w-5' />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className='text-indigo-500 dark:text-indigo-300 px-3 py-2 text-sm cursor-pointer'>
            Create Channel
            <PlusCircle className='ml-auto h-5 w-5' />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem className='text-rose-500 dark:text-indigo-300 px-3 py-2 text-sm cursor-pointer'>
            Delete Server
            <Trash className='ml-auto h-5 w-5' />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className='text-rose-500 dark:text-indigo-300 px-3 py-2 text-sm cursor-pointer'>
            Leave Server
            <LogOut className='ml-auto h-5 w-5' />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
