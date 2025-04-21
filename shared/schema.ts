import { z } from "zod";

// Report schema definitions
export const reportSchema = z.object({
  id: z.number(),
  shareId: z.string(),
  data: z.any(),
  createdAt: z.date(),
  description: z.string().nullable(),
  userId: z.number().nullable()
});

export const insertReportSchema = reportSchema.omit({ 
  id: true, 
  createdAt: true 
}).partial({
  description: true,
  userId: true
});

export type Report = z.infer<typeof reportSchema>;
export type InsertReport = z.infer<typeof insertReportSchema>;

// User schema definitions
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string()
});

export const insertUserSchema = userSchema.omit({ 
  id: true
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
