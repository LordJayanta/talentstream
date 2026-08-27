import { z } from 'zod';

export const jobFormSchema = z.object({
  title: z.string().
    min(1, { message: 'Title must be at least 1 character long' }).
    max(100, { message: 'Title must be less than 100 characters long' }),

  minSalary: z.string().
    min(1, { message: 'Minimum Salary must be at least 1 character long' }).
    max(100, { message: 'Minimum Salary must be less than 100 characters long' }),

  maxSalary: z.string()
    .min(1, { message: 'Maximum Salary must be at least 1 character long' }).
    max(100, { message: 'Maximum Salary must be less than 100 characters long' }),

  department: z.string().
    min(1, { message: 'Department must be at least 1 character long' }).
    max(100, { message: 'Department must be less than 100 characters long' }),

  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']),
  experience: z.enum(['0-1', '1-3', '3-5', '5-10', '10+']),

  location: z.string().optional(),

  isRemote: z.boolean(),

  description: z.string().
    min(1, { message: 'Description must be at least 1 character long' }).
    max(5000, { message: 'Description must be less than 5000 characters long' }),

  mustHaveSkills: z.array(z.string()),
  niceToHaveSkills: z.array(z.string()),
  companyBenefits: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      checked: z.boolean()
    })
  ),
}).superRefine((data, ctx) => {
  // If Remote is NOT checked, Location must be filled in
  if (!data.isRemote && (!data.location || data.location?.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Location is required if job is not remote',
      path: ['location']
    })
  }
})

export type JobForm = z.infer<typeof jobFormSchema>