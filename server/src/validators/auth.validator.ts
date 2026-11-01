import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid administrator email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const createAdminSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid Gmail or work email address'),
  phone: z.string().trim().optional().nullable(),
  role: z.string().default('admin'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().nullable(),
});

export const updateAdminSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters').optional(),
  phone: z.string().trim().optional().nullable(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().nullable(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
