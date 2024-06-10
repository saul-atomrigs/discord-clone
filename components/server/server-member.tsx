'use client';

import { cn } from '@/lib/utils';
import { Member, MemberRole, Profile, Server } from '@prisma/client';
import { ShieldAlert } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import UserAvatar from '../user-avatar';

interface ServerMemberProps {
  server: Server;
  member: Member & { profile: Profile };
}

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className='h-5 w-5 ml-2 text-indigo-500' />,
  [MemberRole.MODERATOR]: (
    <ShieldAlert className='h-5 w-5 ml-2 text-rose-500' />
  ),
  [MemberRole.GUEST]: null,
};

export default function ServerMember({ server, member }: ServerMemberProps) {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  return (
    <button
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        params?.memberId === member.id && 'bg-zinc-700/10 dark:bg-zinc-700/50'
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className='h-8 w-8 md:h-10 md:w-10'
      />
      <p>{member.profile.name}</p>
      {icon}
    </button>
  );
}
