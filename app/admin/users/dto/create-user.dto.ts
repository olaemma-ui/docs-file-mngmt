import { z } from "zod";

export const CreateUserSchema = z.object({
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email format"),
    userRole: z.string().nonempty('This fields is requered'),
});

export type CreateUserPayload = z.infer<typeof CreateUserSchema>;
