'use client'
import { useEffect, useState } from 'react'
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { encryptKey, decryptKey } from '@/lib/utils'

const PasskeyModal = ({ onClose }: { onClose?: () => void }) => {
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(true);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('accessKey');
      if (storedKey) {
        const decryptedKey = decryptKey(storedKey);
        if (decryptedKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
          setOpen(false);
          router.push('/admin');
        } else {
          localStorage.removeItem('accessKey');
        }
      }
    }
  }, []);

  const closeModal = () => {
    setOpen(false);
    onClose?.(); // Call optional onClose prop
    router.push('/');
  };

  const validatePassKey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (passkey === "754021") {
      const encryptedKey = encryptKey(passkey);
      localStorage.setItem('accessKey', encryptedKey);
      setOpen(false);
      onClose?.(); // Call optional onClose prop
      router.push('/admin');
    } else {
      setError('Invalid Passkey, please try again');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className='shad-alert-dialog'>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-start justify-between'>
            Admin Access Verification
            <Image
              src='/assets/icons/close.svg'
              alt='close'
              width={20}
              height={20}
              onClick={() => closeModal()}
              className='cursor-pointer'
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the hospital admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col items-center gap-4">
          <InputOTP 
            maxLength={6} 
            value={passkey} 
            onChange={(value) => setPasskey(value)}
            className="shad-otp"
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot key={index} index={index} className='shad-otp-slot ml-2' />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {error && <p className="text-red-500 shad-error">{error}</p>}
        </div>

        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={(e) => validatePassKey(e)}
            className='shad-primary-btn mt-4 flex justify-center w-full'
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;



