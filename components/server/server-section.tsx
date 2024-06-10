'use client';

import { ServerWithMembersWithProfiles } from '@/types';
import { ChannelType, MemberRole } from '@prisma/client';
import React from 'react';
import { ActionTooltip } from '../action-tooltip';
import { Plus } from 'lucide-react';
import { useModal } from '@/hooks/useModalStore';

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: 'channels' | 'members';
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

export default function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) {
  const { onOpen } = useModal();

  return (
    <div className='flex items-center justify-between py-2'>
      <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 '>
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionTooltip label='Create Channel' side='top'>
          <button
            onClick={() =>
              onOpen('createChannel', {
                server: server,
                channelType: channelType,
              })
            }
            className='text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 hover:text-zinc-700 transition'
          >
            <Plus className='h-5 w-5' />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
}
