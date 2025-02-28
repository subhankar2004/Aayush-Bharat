
import StatCard from '@/components/StatCard'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getRecentAppointmentList } from '../lib/actions/appointment.actions'
import { DataTable } from '@/components/table/DataTable'
import { columns } from '@/components/table/columns'
import { Payment } from '@/components/table/columns'

const Admin = async () => {
  const appointments = await getRecentAppointmentList();
  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-10 px-6 py-10">
      <header className="flex items-center justify-between border-b pb-4">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-auto"
          />
        </Link>
        <p className="text-xl font-semibold text-white-800">Admin Dashboard</p>
      </header>
      <main className='admin-main'>
        <section className='w-full space-y-4'>
          <h1 className='header'>Welcome !!</h1>
          <p className='text-dark-700'>Start the day with managing new appointments</p>
        </section>

        <section className='admin-stat'>
          <StatCard
            type='appointments'
            count={appointments.scheduledCount}
            label='Scheduled appointments'
            icon='/assets/icons/appointments.svg'

          />

          <StatCard
            type='pending'
            count={appointments.pendingCount}
            label='Pending appointments'
            icon='/assets/icons/pending.svg'
          />

          <StatCard
            type='cancelled'
            count={appointments.cancelledCount}
            label='Cancelled appointments'
            icon='/assets/icons/cancelled.svg'

          />


        </section>
        <DataTable columns={columns} data={appointments.documents} />
      </main>


    </div>
  )
}

export default Admin

