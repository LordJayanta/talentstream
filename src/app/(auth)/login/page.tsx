"use client"

import { z } from 'zod'
import FieldCheckBox from '@/components/core/field-check-box'
import FieldInput from '@/components/core/field-input'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Spinner } from '@/components/ui/spinner'
import React from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
})

type LoginInput = z.infer<typeof loginSchema>



export default function Page() {
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const { register, handleSubmit, control, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false
    }
  })

  const onSubmit = async (data: LoginInput) => {
    console.log("Valid data:", data);
    const apiData = data;
    delete (apiData as Partial<LoginInput>).rememberMe;

    setIsLoading(true);
    try {
      const { data, error } = await authClient.signIn.email(apiData);
      console.log(data);
      if (error) throw error;


      if (data?.user) {
        if (data.user?.role === 'employer') router.push("/hr/dashboard")
        else router.push("/");
        router.refresh();
      }

    } catch (error) {
      console.error(error);
      alert((error as Error)?.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="relative hidden bg-muted lg:block">
        </div>
        <div className="flex flex-col items-center justify-center gap-4 p-6 md:p-10">
          <form
            className='w-md'
            onSubmit={handleSubmit(onSubmit, (errors) => console.log("Validation Errors:", errors))}>
            <FieldSet>
              <FieldContent className='gap-0 mb-4'>
                <FieldLegend className='mb-1'>
                  <h1 className='text-[32px]'>Welcome back</h1>
                </FieldLegend>
                <FieldDescription>
                  <span className='text-sm'>Sign in to access your recruitment dashboard.</span>
                </FieldDescription>
              </FieldContent>

              <FieldGroup className='grid grid-cols-6 gap-y-4'>
                <FieldInput
                  className='col-span-6'
                  label='Work Email'
                  placeholder='name@company.com'
                  type='email'
                  {...register('email')}
                  error={errors.email?.message}
                />
                <FieldInput
                  className='col-span-6'
                  label='Password'
                  placeholder='********'
                  type='password'
                  {...register('password')}
                  error={errors.password?.message}
                />
                <div className='col-span-6 flex items-center justify-between'>
                  <Controller
                    control={control}
                    name='rememberMe'
                    render={({ field, fieldState }) => <FieldCheckBox
                      label='Remember Me'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      error={fieldState.error?.message}
                    />}
                  />
                  <Button variant={'link'}>
                    <Link href={'/'}>
                      Forgot password?
                    </Link>
                  </Button>
                </div>
                <Field className='col-span-6'>
                  <Button type='submit' variant={'default'} size={'lg'} className={'w-full flex gap-1'}>
                    {isLoading && <Spinner />}
                    <span>Login</span>
                  </Button>
                </Field>
                <Field className='col-span-6'>
                  <Button variant={'link'}>
                    <Link href={'/singup'}>
                      I don&apos;t have an account. Create Account
                    </Link>
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </div>
      </div>
    </div>
  )
}
