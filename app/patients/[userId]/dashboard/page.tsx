import Link from "next/link";

interface DashboardProps {
  params: {
    userId: string;
  };
}

const Dashboard = ({ params }: DashboardProps) => {
  const userId = params.userId;

  return (
    <div className="min-h-screen bg-[#131619] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1a1d21] rounded-lg shadow-lg overflow-hidden border border-gray-800">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-white">
                Patient Dashboard
              </h1>
              <Link
                href={`/patients/${userId}/new-appointment`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Book New Appointment
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="bg-[#22262b] p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-4">
                  <Link
                    href={`/patients/${userId}/new-appointment`}
                    className="block w-full text-center px-4 py-2 border border-gray-600 rounded-md text-white hover:bg-[#2a2f35] transition-colors"
                  >
                    Schedule Appointment
                  </Link>
                  <button className="block w-full px-4 py-2 border border-gray-600 rounded-md text-white hover:bg-[#2a2f35] transition-colors">
                    View Medical Records
                  </button>
                  <button className="block w-full px-4 py-2 border border-gray-600 rounded-md text-white hover:bg-[#2a2f35] transition-colors">
                    Update Profile
                  </button>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-[#22262b] p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Upcoming Appointments
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#1a1d21] rounded-lg border border-gray-700">
                    <div>
                      <p className="text-white font-medium">
                        No upcoming appointments
                      </p>
                      <p className="text-gray-400 text-sm">
                        Book an appointment to get started
                      </p>
                    </div>
                    <Link
                      href={`/patients/${userId}/new-appointment`}
                      className="px-3 py-1 text-sm text-white bg-[#131619] rounded-md hover:bg-[#1a1d21]"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[#22262b] p-6 rounded-lg border border-gray-700 md:col-span-2">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-[#1a1d21] rounded-lg border border-gray-700">
                    <p className="text-white">Welcome to your dashboard!</p>
                    <p className="text-gray-400 text-sm mt-1">
                      This is where you'll see your recent appointments and
                      medical activity
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
