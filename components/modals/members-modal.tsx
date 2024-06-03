'use client';

import {
  Check,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react';
import { useState } from 'react';

import { ServerWithMembersWithProfiles } from '@/types';
import { useModal } from '../../hooks/useModalStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import UserAvatar from '../user-avatar';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className='h-5 w-5 ml-2 text-indigo-500' />,
  ADMIN: <ShieldAlert className='h-5 w-5 ml-2 text-rose-500' />,
};

export default function MembersModal() {
  const [loadingId, setLoadingId] = useState('');

  const { isOpen, onClose, onOpen, type, data } = useModal();

  const isModalOpen = isOpen && type === 'members';
  const { server } = data as { server: ServerWithMembersWithProfiles };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Manage members
          </DialogTitle>

          <DialogDescription className='text-center text-zinc-500'>
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='mt-8 max-h-[420px] pr-6'>
          {server?.members?.map((member) => (
            <div key={member.id} className='flex items-center gap-x-2 mb-6'>
              <UserAvatar
                key={member.profile.id}
                src={member.profile.imageUrl}
              />
              <div className='flex flex-col gap-y-1'>
                <div className='text-xs font-semibold flex items-center gap-x-1'>
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className='text-xs text-zinc-500'>{member.profile.email}</p>
              </div>

              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className='ml-auto'>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className='h-4 w-4 text-zinc-400' />
                      </DropdownMenuTrigger>

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className='flex items-center'>
                          <ShieldQuestion className='h-4 w-4 mr-2' />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <Shield className='h-4 w-4 mr-2' />
                          <DropdownMenuItem>Guest</DropdownMenuItem>
                          {member.role === 'GUEST' && (
                            <Check className='h-4 w-4 ml-auto' />
                          )}
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenu>
                  </div>
                )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
