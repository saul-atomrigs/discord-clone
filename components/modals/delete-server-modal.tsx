'use client';

import { useState } from 'react';

import { useModal } from '../../hooks/useModalStore';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function DeleteServerModal() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === 'deleteServer';
  const { server } = data;

  const handleClickConfirm = async () => {
    setIsLoading(true);

    try {
      await axios.delete(`/api/servers/${server?.id}`);

      onClose();

      router.refresh();
      router.push(`/`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Delete Server
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to do this?{' '}
            <span className='font-semibold text-indigo-500'>
              {server?.name}?
            </span>
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-5 py-4'>
          <div className='flex items-center justify-between w-full'>
            <Button variant='ghost' onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={handleClickConfirm}
              disabled={isLoading}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
