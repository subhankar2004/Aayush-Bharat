'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PatientForm from "@/components/forms/PatientForm";
import Link from "next/link";
import PasskeyModal from "@/components/PasskeyModal";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    const adminParam = searchParams.get('admin');
    if (adminParam === 'true') {
      setShowAdminModal(true);
    }
  }, [searchParams]);

  const handleAdminAccess = () => {
    setShowAdminModal(true);
  };

  return (
    <div className="flex h-screen max-h-screen">
      {showAdminModal && <PasskeyModal onClose={() => setShowAdminModal(false)} />}
      
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            className="mb-12 h-10 w-fit rounded-md"
            src="/assets/icons/logo-full.svg"
            alt="logo"
            width={1000}
            height={1000}
          />
          <PatientForm />
          
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2025 Aayush Bharat. All rights reserved
            </p>
            <button 
              onClick={handleAdminAccess} 
              className="text-blue-500 hover:underline"
            >
              Admin
            </button>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="image"
        className="side-img max-w-[50%] object-cover rounded-lg"
      />
    </div>
  );
}

