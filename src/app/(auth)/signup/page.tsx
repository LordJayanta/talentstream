"use client"

import { z } from 'zod'
import FieldInput from '@/components/core/field-input'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import Link from 'next/link'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import FieldCheckBox from '@/components/core/field-check-box'
import { authClient } from '@/lib/auth-client'
import FieldSelect from '@/components/core/field-select'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from 'next/navigation'

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
  role: z.enum(["candidate", "employer"]),
  acceptTerms: z.literal(true, "You must accept the terms and conditions"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // Attaches the error to confirmPassword field
})
// Automatically extract the TypeScript type from the schema!
type SignupFormData = z.infer<typeof signupSchema>;



export default function Page() {
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const { register, handleSubmit, control, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'candidate',
    }
  })
  const userType: { label: string; value: string }[] = [
    { label: "Looking for Job", value: "candidate" },
    { label: "I am an Employer", value: "employer" }
  ]

  const onSubmit = async (data: SignupFormData) => {
    console.log("Valid data:", data);
    const apiData = data;

    delete (apiData as Partial<SignupFormData>).confirmPassword;  // delete confirm passoword

    // NOTE: Since the user cannot create an account without checking the box, the account's createdAt timestamp already proves when they accepted the terms.
    delete (apiData as Partial<SignupFormData>).acceptTerms;  // delete acceptTerms 

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email(apiData);

      if (error) throw error;

      console.log(data);

      if (data?.user) {
        if (data.user?.role === 'employer') router.push("/hr/dashboard")
        else router.push("/");
        router.refresh();
      }

    } catch (error) {
      console.error(error)
      alert((error as Error)?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="grid min-h-svh lg:grid-cols-2">

        <div className="flex flex-col items-center justify-center gap-4 p-6 md:p-10">
          <form
            className='w-md'
            onSubmit={handleSubmit(onSubmit, (errors) => console.log("Validation Errors:", errors))}>
            <FieldSet>
              <FieldContent className='gap-0 mb-4'>
                <FieldLegend className='mb-1'>
                  <h1 className='text-[32px]'>Create Account</h1>
                </FieldLegend>
                <FieldDescription>
                  <span className='text-sm'>Join the intelligent recruitment network today.</span>
                </FieldDescription>
              </FieldContent>

              <FieldGroup className='grid grid-cols-6 gap-y-4'>
                <FieldInput
                  className='col-span-6'
                  label='Full Name'
                  placeholder='Jone Deo'
                  type='text'
                  {...register('name')}
                  error={errors.name?.message}
                />
                <FieldInput
                  className='col-span-6'
                  label='Work Email'
                  placeholder='name@company.com'
                  type='email'
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Controller
                  name='role'
                  control={control}
                  render={({ field, fieldState }) => <FieldSelect
                    label='Employment Type'
                    placeholder="e.g. I'm Job Seeker"
                    className='col-span-6'
                    items={userType}
                    ref={field.ref}
                    onValueChange={field.onChange}
                    value={field.value}
                    error={fieldState.error?.message}
                  />}
                />
                <FieldInput
                  className='col-span-3'
                  label='Password'
                  placeholder='********'
                  type='password'
                  {...register('password')}
                  error={errors.password?.message}
                />
                <FieldInput
                  className='col-span-3'
                  label='Confirm Password'
                  placeholder='********'
                  type='password'
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
                <Controller
                  control={control}
                  name='acceptTerms'
                  render={({ field, fieldState }) => (
                    <FieldCheckBox
                      className='col-span-6'
                      label='I agree to the Terms of Service and Privacy Policy'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Field className='col-span-6'>
                  <Button type='submit' variant={'default'} size={'lg'} className={'w-full flex gap-1'}>
                    {isLoading && <Spinner />}
                    <span>Create Account</span>
                  </Button>
                </Field>
                <Field className='col-span-6'>
                  <Button variant={'link'} type='submit'>
                    <Link href={'/login'}>
                      I have an account. Sign In
                    </Link>
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </div>
        <div className="relative  hidden bg-muted lg:block">
        </div>
      </div>
    </div>
  )
}
