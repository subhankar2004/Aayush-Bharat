import nodemailer from 'nodemailer';

interface AppointmentDetails {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentId: string;
  patientPhone: string;
  patientAddress: string;
  reason: string;
}

export async function sendAppointmentEmail(details: AppointmentDetails) {
  try {
    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports like 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c3e50;">Appointment Confirmation</h2>
        <p>Dear ${details.patientName},</p>
        
        <p>Your appointment has been successfully booked with the following details:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Appointment Details</h3>
          <p><strong>Doctor:</strong> Dr. ${details.doctorName}</p>
          <p><strong>Specialization:</strong> ${details.doctorSpecialization}</p>
          <p><strong>Date:</strong> ${details.appointmentDate}</p>
          <p><strong>Time:</strong> ${details.appointmentTime}</p>
          <p><strong>Appointment ID:</strong> ${details.appointmentId}</p>
          <p><strong>Reason:</strong> ${details.reason}</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Patient Information</h3>
          <p><strong>Name:</strong> ${details.patientName}</p>
          <p><strong>Phone:</strong> ${details.patientPhone}</p>
          <p><strong>Address:</strong> ${details.patientAddress}</p>
        </div>

        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Important Instructions</h3>
          <ul>
            <li>Please arrive 15 minutes before your scheduled appointment time.</li>
            <li>Bring your ID proof and any relevant medical records.</li>
            <li>If you need to reschedule, please contact us at least 24 hours in advance.</li>
          </ul>
        </div>

        <p>Best regards,<br>${process.env.SENDER_NAME}</p>
      </div>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
      to: details.patientEmail,
      subject: 'Appointment Confirmation - Aayush Bharat Healthcare',
      html: emailContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Failed to send email' };
  }
} 