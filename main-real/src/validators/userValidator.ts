import { z } from "zod";
import { Role } from "../models/userModel";

export const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string(),
  mobile: z.string().length(10, "Mobile number must be 10 digits"),
  companyName: z.string().min(3, "Company name is required"),
  teamName: z.string().min(3, "Team name is required"),
  address: z.string().min(5, "Address is required"),
  companyPhone: z.string().length(10, "Company phone must be 10 digits"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pinCode: z.string().length(6, "Pin Code must be 6 digits"),
  timeZone: z.string().min(3, "TimeZone is required"),
  role: z.nativeEnum(Role, { message: "Invalid role" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
