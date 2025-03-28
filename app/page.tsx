'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PatientForm from "@/components/forms/PatientForm";
import Link from "next/link";
import PasskeyModal from "@/components/PasskeyModal";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeComponent />
    </Suspense>
  );
}

function HomeComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminParam = searchParams.get('admin');
    if (adminParam === 'true') {
      setShowAdminModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // Adjust time as needed
  }, []);

  const handleAdminAccess = () => {
    setShowAdminModal(true);
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="flex h-screen max-h-screen">
      {showAdminModal && <PasskeyModal onClose={() => setShowAdminModal(false)} />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px] text-center">
          
          {/* Overlapping Logo Container */}
          <div className="relative w-32 h-32 mx-auto mb-12">
            {/* Outer Logo */}
            <Image
              className="absolute top-0 left-0 w-full h-full"
              src="/assets/icons/logo-outer.png"
              alt="logo outer"
              width={1000}
              height={1000}
            />
            {/* Inner Logo */}
            <Image
              className="absolute top-0 left-0 w-full h-full"
              src="/assets/icons/logo-center.png"
              alt="logo center"
              width={1000}
              height={1000}
            />
          </div>

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



