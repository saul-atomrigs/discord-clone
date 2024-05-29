'use client';
import { UploadDropzone } from '@/lib/uploadthing';
import '@uploadthing/react/styles.css';
import Image from 'next/image';
import { X } from 'lucide-react';

interface FileUploadProps {
  endpoint: 'messageFile' | 'serverImage';
  value: string;
  onChange: (value: string) => void;
}

export default function FileUpload({
  endpoint,
  value,
  onChange,
}: FileUploadProps) {
  const fileType = value?.split('.').pop();

  // if filetype is an image:
  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-20 w-20'>
        <Image fill src={value} alt='uploaded image' className='rounded-full' />

        <button
          onClick={() => onChange('')}
          className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm '
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log('Files: ', res);
        onChange(res[0].url);
        alert('Upload Completed');
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
}
