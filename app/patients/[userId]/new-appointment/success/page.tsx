import { getAppointment } from '@/app/lib/actions/appointment.actions'
import { formatDateTime } from '@/app/lib/utils'
import { Button } from '@/components/ui/button'
import { Doctors } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

//http://localhost:3001/patients/67a040f50033ad146e3c/new-appointment/success?appointmentId=67a21c7300325ff38483

const Success = async ({ params: { userId }, searchParams }: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || '';
  const appointment = await getAppointment(appointmentId);
  const doctor = Doctors.find(doctor => doctor.name === appointment.primaryPhysician);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#131619] px-6">
      <div className="w-full max-w-lg rounded-lg bg-[#1E2226] p-8 shadow-lg">
        {/* Logo */}
        <Link href="/" className="flex justify-center">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        {/* Success Message */}
        <section className="mt-6 flex flex-col items-center text-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={300}
            alt="success"
            className="mb-4"
          />
          <h2 className="text-2xl font-semibold text-white">
            Your <span className="text-green-500">appointment request</span> has been successfully submitted!
          </h2>
          <p className="mt-2 text-gray-300">We'll be in touch with you soon.</p>
        </section>

        {/* Appointment Details */}
        <section className="mt-6 rounded-lg bg-[#25292D] p-4 shadow">
          <p className="mb-3 text-lg font-medium text-gray-200">Appointment Details</p>

          <div className="flex items-center gap-3">
            {doctor && (
              <div className="flex items-center gap-3">
                <Image
                  src={doctor.image}
                  height={50}
                  width={50}
                  alt="doctor"
                  className="rounded-full border border-gray-500"
                />
                <p className="text-gray-300">Dr. {doctor.name}</p>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p className="text-gray-300">{formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        {/* New Appointment Button */}
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="px-6 py-2 bg-green-600 text-white hover:bg-green-500"
            asChild
          >
            <Link href={`/patients/${userId}/new-appointment`}>
              New Appointment
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          © 2025 Aayush Bharat. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Success;



