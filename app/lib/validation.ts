import { z } from "zod";

export const UserFormvalidation = z.object({
  name: z.string().min(2, { message: "Username must be at least 2 characters." }).max(50),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().refine((phone) => /^\+?[1-9]\d{1,14}$/.test(phone), {
    message: "Invalid phone number.",
  }),
});

