'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { ActionTooltip } from '@/components/action-tooltip';

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export default function NavigationItem({
  id,
  imageUrl,
  name,
}: NavigationItemProps) {
  const params = useParams();
  const router = useRouter();

  const handleClickServer = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip label={name} side='right' align='center'>
      <button
        onClick={handleClickServer}
        className='group relative flex items-center'
      >
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
            params.serverId === id
              ? 'top-0 bottom-0 group-hover:w-[16px] group-hover:rounded-r-none'
              : 'top-0 bottom-0 group-hover:w-[4px] group-hover:rounded-r-full'
          )}
        />
        <div
          className={cn(
            'relative z-10 flex h-[48px] w-[48px] items-center justify-center rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
            params.serverId === id
              ? 'bg-emerald-500'
              : 'bg-background dark:bg-neutral-700 group-hover:bg-emerald-500'
          )}
        />
        <Image fill src={imageUrl} alt='channel' />
      </button>
    </ActionTooltip>
  );
}
