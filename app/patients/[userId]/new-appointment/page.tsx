import Image from "next/image";
import {Button} from '@/components/ui/button'
import PatientForm from "@/components/forms/PatientForm";
import Link from "next/link";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/app/lib/actions/patient.actions";


export default async function NewAppointment({params:{userId}}:SearchParamProps) {
 
  const patient= await getPatient(userId);
  //console.log(patient);
  return (

    <div className="flex h-screen max-h-screen ">


      <section className="remove-scrollbar container my-auto ">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            className="mb-12 h-10 w-fit rounded-md"
            src="/assets/icons/logo-full.svg"
            alt="logo"
            width={1000}
            height={1000}
          />
          {/* <PatientForm /> */}
          <AppointmentForm
          type="create"
          userId={userId}
          patientId={patient.$id}

          />

          <p className="justify-items-end text-dark-600 xl:text-left mt-10 py-12">
          © 2025 Aayush Bharat. All rights reserved
          </p>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
