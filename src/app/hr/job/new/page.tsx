'use client'

import { createJobAction } from '@/actions/job-actions'
import FieldCheckBox from '@/components/core/field-check-box'
import FieldInput from '@/components/core/field-input'
import FieldOptionInput from '@/components/core/field-option-input'
import FieldSelect, { SelectItems } from '@/components/core/field-select'
import HRHeader from '@/components/hr-sections/hr-header'
import JobInputCard from '@/components/hr-sections/job-input-card'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle, } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { Banknote, BrainCircuit, CloudBackup, Info } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobForm, jobFormSchema } from '@/lib/validations/job';


const EditorClient = dynamic(
  () => import("@/components/core/editor-client"),
  {
    ssr: false,
    loading: () => <p className="h-50 flex items-center justify-center border rounded-md">Loading Editor...</p>
  }
)

export default function Page() {

  const { handleSubmit, register, control, formState: { errors } } = useForm<JobForm>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      department: '',
      employmentType: 'FULL_TIME',
      experience: '0-1',
      isRemote: false,
      location: '',
      minSalary: '',
      maxSalary: '',
      description: '',
      mustHaveSkills: [],
      niceToHaveSkills: [],
      companyBenefits: [
        { id: 'healthInsurance', label: 'Health Insurance', checked: false },
        { id: 'matching401k', label: '401(k) Matching', checked: false },
        { id: 'unlimitedPTO', label: 'Unlimited PTO', checked: false },
        { id: 'learningBudget', label: 'Learning Budget', checked: false },
      ]

    }
  })

  const employmentTypeItem: SelectItems[] = [
    { label: "Full Time", value: "FULL_TIME" },
    { label: "Part Time", value: "PART_TIME" },
    { label: "Contract", value: "CONTRACT" },
    { label: "Internship", value: "INTERNSHIP" },
  ]

  const employmentExperience: SelectItems[] = [
    { label: "Freshers, Less than 1 year", value: "0-1" },
    { label: "1 to 3 years", value: "1-3" },
    { label: "3 to 5 years", value: "3-5" },
    { label: "5 to 10 years", value: "5-10" },
    { label: "10+ years", value: "10+" },
  ]

  const companyBenefits: { id: string; label: string; checked: boolean }[] = [
    { id: 'healthInsurance', label: 'Health Insurance', checked: false },
    { id: 'matching401k', label: '401(k) Matching', checked: false },
    { id: 'unlimitedPTO', label: 'Unlimited PTO', checked: false },
    { id: 'learningBudget', label: 'Learning Budget', checked: false },
  ];

  const onSubmit = async (data: JobForm) => {

    console.log(data);

    const result = await createJobAction(data);
      console.log("result: ", result);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
  }



  return (
    <div>
      <HRHeader title='Create New Job' />
      <main className='py-6 px-12'>
        <form onSubmit={handleSubmit(onSubmit, (errors) => console.log("Validation Errors:", errors))}>
          {/* Basic Information */}
          <FieldSet className='space-y-6 mb-12'>
            <JobInputCard title='Basic Information' icon={<Info size={20} />}>
              <FieldSet className=''>
                <FieldGroup className='grid grid-cols-6 gap-x-6 gap-y-6 text-zinc-600'>
                  <FieldInput
                    label='Job Title'
                    placeholder='e.g. Senior Full Stack Engineer'
                    className='col-span-6'
                    {...register('title')}
                    error={errors.title?.message}
                  />
                  <FieldInput
                    label='Department'
                    placeholder='e.g. Senior Full Stack Engineer'
                    className='col-span-2'
                    {...register('department')}
                    error={errors.department?.message}
                  />
                  <Controller
                    name='employmentType'
                    control={control}
                    render={({ field, fieldState }) => <FieldSelect
                      label='Employment Type'
                      placeholder='e.g. Full Time'
                      className='col-span-2'
                      items={employmentTypeItem}
                      ref={field.ref}
                      value={field.value}
                      onValueChange={field.onChange}
                      error={fieldState.error?.message}
                    />}
                  />

                  <Controller
                    name='experience'
                    control={control}
                    render={({ field, fieldState }) => <FieldSelect
                      label='Experience'
                      placeholder='e.g. Freshers'
                      className='col-span-2'
                      items={employmentExperience}
                      ref={field.ref}
                      value={field.value}
                      onValueChange={field.onChange}
                      error={fieldState.error?.message}
                    />}
                  />


                  <div className='flex items-center flex-wrap p-4 col-span-6 bg-primary-foreground border border-primary/10 rounded-[16px]'>
                    <FieldContent>
                      <FieldTitle className='text-base font-normal text-primary '>Location Strategy</FieldTitle>
                      <FieldDescription>Allow applicants from anywhere in the world</FieldDescription>
                    </FieldContent>

                    <div className='flex gap-4'>
                      <FieldInput
                        className='bg-card text-base font-normal'
                        placeholder='e.g City, Country'
                        {...register('location')}
                        error={errors.location?.message}
                      />

                      <Controller
                        control={control}
                        name='isRemote'
                        render={({ field }) => <Field orientation="horizontal" className="w-fit">
                          <Switch
                            id="remote"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <FieldLabel className='text-base font-normal text-zinc-600' htmlFor="remote">Remote</FieldLabel>
                        </Field>}
                      />
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
                    type='number'
                    className='col-span-2'
                    {...register('minSalary')}
                    error={errors.minSalary?.message}
                  />
                  <FieldInput
                    label='Maximum Salary (Annual USD)'
                    placeholder='e.g. 120,000'
                    className='col-span-2'
                    type='number'
                    {...register('maxSalary')}
                    error={errors.maxSalary?.message}
                  />
                  <FieldSet className='col-span-4'>
                    <FieldLegend variant="label" className='text-zinc-600'>Company Benefits</FieldLegend>
                    <FieldGroup className='grid grid-cols-4 gap-x-2 gap-y-2'>
                      {
                        companyBenefits.map((benefit, index) => (
                          <div key={benefit.id} className='col-span-1 p-3 border rounded-lg'>
                            <Controller
                              name={`companyBenefits.${index}.checked`}
                              control={control}
                              render={({ field }) => <FieldCheckBox
                                label={benefit.label}
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                              />}
                            />
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
              <Controller
                name='description'
                control={control}
                render={({ field }) => <EditorClient
                  editorRef={field.ref}
                  markdown={field.value ?? ''}
                  onChange={field.onChange}
                  contentEditableClassName="prose max-w-none min-h-[200px] focus:outline-none p-2"
                  className="w-full h-full p-2 min-h-58 flex-1 resize-y rounded-[12px] border bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent"
                />}
              />
            </JobInputCard>

            {/* Requirements & Skills */}
            <JobInputCard
              title='Requirements & Skills'
              icon={<BrainCircuit size={20} />}
            >
              <FieldGroup className='grid grid-cols-2 gap-x-6 gap-y-6 text-zinc-600'>
                <Controller
                  name='mustHaveSkills'
                  control={control}
                  render={({ field }) => <FieldOptionInput
                    label='Must-have Skills'
                    placeholder='e.g. Senior Full Stack Engineer'
                    className='col-span-2'
                    options={field.value}
                    setOptions={field.onChange}
                  />}
                />
                <Controller
                  name='niceToHaveSkills'
                  control={control}
                  render={({ field }) => <FieldOptionInput
                    label='Nice-to-have Skills'
                    placeholder='e.g. Senior Full Stack Engineer'
                    className='col-span-2'
                    options={field.value}
                    setOptions={field.onChange}
                  />}
                />
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
                  <Button type="submit" size={'lg'} className={'px-8'}
                  // onClick={(e) => handleSubmit(e)}
                  >Publish Job Vacancy</Button>
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </main>
    </div>
  )
}
