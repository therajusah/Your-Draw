import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(16),
    password: z.string(),
    name: z.string().min(3).max(16),
})

export const SigninSchema = z.object({
    username: z.string().min(3).max(16),
    name: z.string().min(3).max(16),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20),
})