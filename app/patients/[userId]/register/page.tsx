import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/app/lib/actions/patient.actions'


const Register= async ({params:{userId}}:SearchParamProps) => {

  const user = await getUser(userId);
  return (
    <div className="flex h-screen max-h-screen ">
     {/*TODO: OTP Verification | PasskeyModal*/}

      
      <section className="remove-scrollbar container  ">
        <div className="sub-container max-w-[860px] flex-1 flex-col y-10">
          <Image
            className="mb-12 h-10 w-fit rounded-md"
            src="/assets/icons/logo-full.svg"
            alt="logo"
            width={1000}
            height={1000}
          />
          {/* <PatientForm /> */}
          <RegisterForm user={user}/>

          <div className="text-14-regular mt-20 flex justify-between">
          <p className="justify-items-end text-dark-600 xl:text-left">
          © 2025 Aayush Bharat. All rights reserved
          </p>
          <Link href="/?admin=true">Admin</Link>
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="image"
        className="side-img max-w-[390px] object-cover rounded-lg"
      />
    </div>
  )
}

export default Register
