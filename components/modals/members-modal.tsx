'use client';

import {
  Check,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react';
import { MemberRole } from '@prisma/client';
import qs from 'query-string';
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
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className='h-5 w-5 ml-2 text-indigo-500' />,
  ADMIN: <ShieldAlert className='h-5 w-5 ml-2 text-rose-500' />,
};

export default function MembersModal() {
  const [loadingId, setLoadingId] = useState('');
  const router = useRouter();

  const { isOpen, onClose, onOpen, type, data } = useModal();

  const isModalOpen = isOpen && type === 'members';
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.delete(url);
      router.refresh();
      onOpen('members', { server: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId('');
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
          memberId,
        },
      });
      const response = await axios.patch(url, { role });
      router.refresh();
      onOpen('members', { server: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId('');
    }
  };

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
                          <DropdownMenuItem
                            onClick={() => onRoleChange(member.id, 'ADMIN')}
                          >
                            Guest
                            {member.role === 'GUEST' && (
                              <Check className='h-4 w-4 ml-auto' />
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onRoleChange(member.id, 'MODERATOR')}
                          >
                            <ShieldCheck className='h-4 w-4 mr-2' />
                            Moderator
                            {member.role === 'MODERATOR' && (
                              <Check className='h-4 w-4 ml-auto' />
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onKick(member.id)}>
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className='h-4 w-4 animate-spin ml-auto text-zinc-400' />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
