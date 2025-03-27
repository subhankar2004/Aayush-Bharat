import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getAppointment } from "@/app/lib/actions/appointment.actions";
import { Doctors } from "../../../../lib/constants";
import ChatBot from "@/components/ChatBot";

interface SearchParamProps {
  params: {
    userId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

const Success = async ({ params, searchParams }: SearchParamProps) => {
  const userId = params.userId;
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);
  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhysician
  );

  // Format the date
  const formattedDate = new Date(appointment.schedule).toLocaleDateString();
  // Format the time
  const formattedTime = new Date(appointment.schedule).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#131619] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#1a1d21] rounded-lg shadow-lg overflow-hidden border border-gray-800">
          <div className="px-6 py-8">
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-4 text-2xl font-bold text-white">
                Appointment Booked Successfully!
              </h2>
              <p className="mt-2 text-gray-300">
                Your appointment has been confirmed. Here are the details:
              </p>
            </div>

            <div className="mt-8 border-t border-gray-800 pt-8">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-400">Doctor</dt>
                  <dd className="mt-1 text-sm text-white">
                    {doctor?.name || "Not specified"}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-400">
                    Appointment Date
                  </dt>
                  <dd className="mt-1 text-sm text-white">{formattedDate}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-400">
                    Appointment Time
                  </dt>
                  <dd className="mt-1 text-sm text-white">{formattedTime}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-400">
                    Appointment ID
                  </dt>
                  <dd className="mt-1 text-sm text-white">{appointment.$id}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-400">
                    Reason for Visit
                  </dt>
                  <dd className="mt-1 text-sm text-white">
                    {appointment.reason}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <Link
                href={`/patients/${userId}/dashboard`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#131619] hover:bg-[#1a1d21] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#131619] border-gray-700"
              >
                Go to Dashboard
              </Link>
              <Link
                href={`/patients/${userId}/new-appointment`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Book Another Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ChatBot patientId={userId} appointmentId={appointmentId} />
    </div>
  );
};

export default Success;
