'use server'

import { ID, Query } from "node-appwrite";

import {
  NEXT_PUBLIC_BUCKET_ID as BUCKET_ID,
  NEXT_PUBLIC_DATABASE_ID as DATABASE_ID,
  NEXT_PUBLIC_ENDPOINT as ENDPOINT,
  NEXT_PUBLIC_PATIENT_COLLECTION_ID as PATIENT_COLLECTION_ID,
  NEXT_PUBLIC_PROJECT_ID as PROJECT_ID,
  NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID as APPOINTMENT_COLLECTION_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/app/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { sendAppointmentSMS } from "@/lib/twilio";
import { sendAppointmentEmail } from "@/lib/email";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
  try {
    // Ensure all required fields are present
    if (!appointment.userId || !appointment.patient || !appointment.primaryPhysician || !appointment.schedule || !appointment.status) {
      throw new Error("Missing required appointment fields");
    }

    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      {
        userId: appointment.userId,
        patient: appointment.patient,
        primaryPhysician: appointment.primaryPhysician,
        schedule: new Date(appointment.schedule), // Ensure this is a valid date
        reason: appointment.reason || "", // Provide defaults if empty
        note: appointment.note || "",
        status: appointment.status,
        cancellationReason: appointment.reason || "", // Ensure field is provided
      }
    );

    console.log("Appointment created successfully:", newAppointment.$id);

    // Fetch patient details for notifications
    const patient = await databases.getDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      appointment.patient
    );

    // Format date and time for notifications
    const appointmentDate = new Date(appointment.schedule).toLocaleDateString();
    const appointmentTime = new Date(appointment.schedule).toLocaleTimeString();

    // Send SMS notification
    try {
      const smsResult = await sendAppointmentSMS({
        patientName: patient.name,
        patientPhone: patient.phone,
        doctorName: appointment.primaryPhysician,
        doctorSpecialization: "General Medicine", // You might want to fetch this from doctor details
        appointmentDate,
        appointmentTime,
        appointmentId: newAppointment.$id,
      });

      if (smsResult.success) {
        console.log("SMS notification sent successfully:", smsResult.messageId);
      } else {
        console.error("Failed to send SMS notification:", smsResult.error);
      }
    } catch (smsError) {
      console.error("Error sending SMS notification:", smsError);
    }

    // Send Email notification
    try {
      const emailResult = await sendAppointmentEmail({
        patientName: patient.name,
        patientEmail: patient.email,
        patientPhone: patient.phone,
        patientAddress: patient.address,
        doctorName: appointment.primaryPhysician,
        doctorSpecialization: "General Medicine", // You might want to fetch this from doctor details
        appointmentDate,
        appointmentTime,
        appointmentId: newAppointment.$id,
        reason: appointment.reason || "",
      });

      if (emailResult.success) {
        console.log("Email notification sent successfully:", emailResult.messageId);
      } else {
        console.error("Failed to send email notification:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
    }

    return newAppointment;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const getAppointment=async (appointmentId: string) => {
  try{
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    )
    // console.log(appointment);
    return parseStringify(appointment);
  }catch (error) {
    console.error("Error getting appointment:", error);
    throw error;
  }
}

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    // ✅ Fixed reduce function
    const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
      if (appointment.status === "scheduled") {
        acc.scheduledCount += 1;
      } else if (appointment.status === "pending") {
        acc.pendingCount += 1;
      } else if (appointment.status === "cancelled") {
        acc.cancelledCount += 1;
      }
      return acc;
    }, initialCounts);

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error("Error getting recent appointments:", error);
    return null; // Added explicit return to handle failure case
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) throw Error;

    // const smsMessage = `Greetings from CarePulse. ${type === "schedule" ? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!, timeZone).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!, timeZone).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}`}.`;
    // await sendSMSNotification(userId, smsMessage);

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("An error occurred while scheduling an appointment:", error);
  }
};