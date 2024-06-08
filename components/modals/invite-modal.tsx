'use client';

import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { useModal } from '../../hooks/useModalStore';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Copy } from 'lucide-react';
import { Button } from '../ui/button';
import useOrigin from '@/hooks/useOrigin';
import axios from 'axios';

export default function InviteModal() {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onClose, onOpen, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === 'invite';
  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);

      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      onOpen('invite', { server: response.data });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Invite friends
          </DialogTitle>
        </DialogHeader>
        <div>
          <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'></Label>
        </div>

        <div className='flex items-center mt-2 gap-x-2'>
          <Input
            disabled={isLoading}
            value={inviteUrl}
            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
          />
          <Button onClick={onCopy} variant='link' size='icon'>
            <Copy className='h-4 w-4' />
          </Button>
        </div>
        <Button
          onClick={onNew}
          disabled={isLoading}
          size='sm'
          variant='link'
          className='text-xs text-zinc-500 mt-4'
        >
          Generate invite link
        </Button>
      </DialogContent>
    </Dialog>
  );
}
