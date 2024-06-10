'use client';

import { cn } from '@/lib/utils';
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { ActionTooltip } from '../action-tooltip';

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className='h-5 w-5' />,
  [ChannelType.AUDIO]: <Mic className='h-5 w-5' />,
  [ChannelType.VIDEO]: <Video className='h-5 w-5' />,
};

export default function ServerChannel({
  channel,
  server,
  role,
}: ServerChannelProps) {
  const params = useParams();
  const router = useRouter();

  const Icon = iconMap[channel.type];

  return (
    <button
      onClick={() => router.push(`/channels/${channel.id}`)}
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-10'
      )}
    >
      <Icon className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400' />
      <p>{channel.name}</p>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div>
          <ActionTooltip label='edit'>
            <Edit className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-400 dark:text-zinc-400 dark:hover:text-zinc-300' />
          </ActionTooltip>
          <ActionTooltip label='trash'>
            <Trash className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-400 dark:text-zinc-400 dark:hover:text-zinc-300' />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-400 dark:text-zinc-400 dark:hover:text-zinc-300' />
      )}
    </button>
  );
}
