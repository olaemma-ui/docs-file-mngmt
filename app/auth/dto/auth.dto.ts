import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string()
        .nonempty('This field is required')
        .min(6, "Password must be at least 6 characters"),
});

export type LoginDTO = z.infer<typeof LoginSchema>;



export const VerifyInviteSchema = z.object({
    email: z.string()
        .nonempty('This field is required')
        .email("Invalid email format"),

    password: z.string()
        .nonempty('This field is required')
        .min(8, "Password must be at least 6 characters"),

    temporaryPassword: z.string()
        .nonempty('This field is required')
        .min(8, "Password must be at least 6 characters"),
});

export type VerifyInviteDTO = z.infer<typeof VerifyInviteSchema>;
