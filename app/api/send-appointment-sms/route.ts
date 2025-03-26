import { NextResponse } from 'next/server';
import { sendAppointmentSMS } from '@/lib/twilio';
import { Client, Databases } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

const databases = new Databases(client);

export async function POST(request: Request) {
  try {
    const { appointmentId } = await request.json();

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    // Fetch appointment details
    const appointment = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    // Fetch patient details
    const patient = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
      appointment.patientId
    );

    // Fetch doctor details
    const doctor = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_DOCTOR_COLLECTION_ID!,
      appointment.doctorId
    );

    // Format date and time
    const appointmentDate = new Date(appointment.date).toLocaleDateString();
    const appointmentTime = new Date(appointment.date).toLocaleTimeString();

    // Send SMS
    const result = await sendAppointmentSMS({
      patientName: patient.name,
      patientPhone: patient.phone,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      appointmentDate,
      appointmentTime,
      appointmentId: appointment.$id,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send SMS' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error('Error in send-appointment-sms route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 