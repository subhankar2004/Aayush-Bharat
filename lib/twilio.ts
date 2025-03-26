import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

interface AppointmentDetails {
  patientName: string;
  patientPhone: string;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentId: string;
}

export async function sendAppointmentSMS(details: AppointmentDetails) {
  try {
    const message = `
Dear ${details.patientName},

Your appointment has been successfully booked with the following details:

Doctor: Dr. ${details.doctorName}
Specialization: ${details.doctorSpecialization}
Date: ${details.appointmentDate}
Time: ${details.appointmentTime}
Appointment ID: ${details.appointmentId}

Please arrive 15 minutes before your scheduled appointment time.
If you need to reschedule, please contact us at least 24 hours in advance.

Best regards,
Aayush Bharat Healthcare
`;

    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: details.patientPhone,
    });

    return { success: true, messageId: response.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: 'Failed to send SMS' };
  }
} 