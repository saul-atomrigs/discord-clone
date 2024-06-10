import { ChannelType, MemberRole } from '@prisma/client';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

import { currentProfile } from '@/lib/current-profile';
import ServerHeader from './server-header';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch from './server-search';
import { Separator } from '../ui/separator';
import ServerSection from './server-section';
import ServerChannel from './server-channel';
import ServerMember from './server-member';

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className='h-5 w-5' />,
  [ChannelType.AUDIO]: <Mic className='h-5 w-5' />,
  [ChannelType.VIDEO]: <Video className='h-5 w-5' />,
};

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className='h-5 w-5' />,
  [MemberRole.MODERATOR]: <ShieldCheck className='h-5 w-5' />,
  [MemberRole.GUEST]: null,
};

export default async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }

  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });

  const textChannels = server?.channels.filter((channel) => {
    return channel.type === ChannelType.TEXT;
  });

  const audioChannels = server?.channels.filter((channel) => {
    return channel.type === ChannelType.AUDIO;
  });

  const videoChannels = server?.channels.filter((channel) => {
    return channel.type === ChannelType.VIDEO;
  });

  const members = server?.members.filter((member) => {
    member.profileId !== profile.id;
  });

  if (!server) {
    return redirect('/');
  }

  const role = server.members.find((member) => {
    member.profileId === profile.id;
  })?.role;

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]'>
      <ServerHeader server={server} role={role} />

      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className='bg-zinc-300 dark:bg-zinc-700 rounded-md my-2' />
        {!!textChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              label='Text Channels'
              sectionType='channels'
              channelType={ChannelType.TEXT}
              server={server}
              role={role}
            />
            {textChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}

        {!!audioChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              label='Audio Channels'
              sectionType='channels'
              channelType={ChannelType.AUDIO}
              server={server}
              role={role}
            />
            {audioChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}

        {!!videoChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              label='Video Channels'
              sectionType='channels'
              channelType={ChannelType.VIDEO}
              server={server}
              role={role}
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}

        {!!members?.length && (
          <div className='mb-2'>
            <ServerSection
              label='Members'
              sectionType='members'
              server={server}
              role={role}
            />
            {/* {members.map((member) => (
              <ServerMember
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))} */}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
