'use client'

import FieldCheckBox from '@/components/core/field-check-box'
import FieldInput from '@/components/core/field-input'
import FieldOptionInput from '@/components/core/field-option-input'
import HRHeader from '@/components/hr-sections/hr-header'
import JobInputCard from '@/components/hr-sections/job-input-card'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle, } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Banknote, BrainCircuit, CloudBackup, Info } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useRef, useState } from 'react'

const EditorClient = dynamic(
  () => import("@/components/core/editor-client"),
  {
    ssr: false,
    loading: () => <p className="h-50 flex items-center justify-center border rounded-md">Loading Editor...</p>
  }
)

export default function Page() {
  const [description, setDescription] = useState<string>('');
  const editorRef = useRef(null);

  const benefits = [
    'Health Insurance',
    '401(k) Matching',
    'Unlimited PTO',
    'Learning Budget',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Markdown: ");
    console.log(description);
    // Later, you will send this 'description' string to your database!
  };

  return (
    <div>
      <HRHeader title='Create New Job' />
      <main className='py-6 px-12'>
        {/* Basic Information */}
        <FieldSet className='space-y-6 mb-12'>
          <JobInputCard title='Basic Information' icon={<Info size={20} />}>
            <FieldSet className=''>
              <FieldGroup className='grid grid-cols-2 gap-x-6 gap-y-6 text-zinc-600'>
                <FieldInput label='Job Title' placeholder='e.g. Senior Full Stack Engineer' className='col-span-2' />
                <FieldInput label='Job Title' placeholder='e.g. Senior Full Stack Engineer' className='col-span-1' />
                <FieldInput label='Job Title' placeholder='e.g. Senior Full Stack Engineer' className='col-span-1' />

                <div className='flex items-center flex-wrap p-4 col-span-2 bg-primary-foreground border border-primary/10 rounded-[16px]'>
                  <FieldContent>
                    <FieldTitle className='text-base font-normal text-primary '>Location Strategy</FieldTitle>
                    <FieldDescription>Allow applicants from anywhere in the world</FieldDescription>
                  </FieldContent>

                  <div className='flex gap-4'>
                    <Field className=''>
                      <Input className='bg-card text-base font-normal px-4 py-2 ' placeholder='e.g City, Country' />
                    </Field>

                    <Field orientation="horizontal" className="w-fit">
                      <Switch id="remote" />
                      <FieldLabel className='text-base font-normal text-zinc-600' htmlFor="remote">Remote</FieldLabel>
                    </Field>
                  </div>
                </div>
              </FieldGroup>
            </FieldSet>
          </JobInputCard>

          {/* Salary & Benefits */}
          <JobInputCard
            title='Salary & Benefits'
            icon={<Banknote size={20} />}
          >
            <FieldSet className=''>
              <FieldGroup className='grid grid-cols-4 gap-x-6 gap-y-6 text-zinc-600'>
                <FieldInput
                  label='Minimum Salary (Annual USD)'
                  placeholder='e.g. 80,000'
                  className='col-span-2'
                />
                <FieldInput
                  label='Maximum Salary (Annual USD)'
                  placeholder='e.g. 120,000'
                  className='col-span-2'
                />
                <FieldSet className='col-span-4'>
                  <FieldLegend variant="label" className='text-zinc-600'>Company Benefits</FieldLegend>
                  <FieldGroup className='grid grid-cols-4 gap-x-2 gap-y-2'>
                    {
                      benefits.map((benefit) => (
                        <div key={benefit} className='col-span-1 p-3 border rounded-lg'>
                          <FieldCheckBox label={benefit} />
                        </div>
                      ))
                    }
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </FieldSet>
          </JobInputCard>

          {/* Job Description */}
          <JobInputCard
            title='Job Description'
            icon={<Banknote size={20} />}
            action={
              <Button type="button" variant="default" size={'sm'} className={'rounded-full'}>Action</Button>
            }
          >
            <EditorClient
              editorRef={editorRef}
              markdown={description as string}
              onChange={(val) => setDescription(val)}
              contentEditableClassName="prose max-w-none min-h-[200px] focus:outline-none p-2"
              className="w-full h-full p-2 min-h-58 flex-1 resize-y rounded-[12px] border bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent"
            />
          </JobInputCard>

          {/* Requirements & Skills */}
          <JobInputCard
            title='Requirements & Skills'
            icon={<BrainCircuit size={20} />}
          >
            <FieldGroup className='grid grid-cols-2 gap-x-6 gap-y-6 text-zinc-600'>
              <FieldOptionInput label='Must-have Skills' placeholder='e.g. Senior Full Stack Engineer' className='col-span-2' />
              <FieldOptionInput label='Nice-to-have Skills' placeholder='e.g. Senior Full Stack Engineer' className='col-span-2' />
            </FieldGroup>
          </JobInputCard>


          <FieldGroup className='px-6 py-4 bg-accent-foreground rounded-[16px]'>
            <Field orientation="horizontal" className='flex justify-between'>
              <div className='flex gap-2 justify-center text-zinc-500'>
                <div>
                  <CloudBackup size={20} />
                </div>
                <FieldDescription className='text-base font-normal text-zinc-600'>Draft auto-saved 2 mins ago</FieldDescription>
              </div>
              <div className='flex gap'>
                <Button type="button" variant="ghost" size={'lg'} className={'px-8 py-3 hover:bg-transparent text-zinc-500 hover:text-zinc-600 text-base'}>
                  Save for later
                </Button>
                <Button type="submit" size={'lg'} className={'px-8'} onClick={(e) => handleSubmit(e)}>Publish Job Vacancy</Button>
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>
      </main>
    </div>
  )
}
