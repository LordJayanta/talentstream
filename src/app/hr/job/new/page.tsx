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
  const [title, setTitle] = useState<string>('');
  const [minSalary, setMinSalary] = useState<string>('');
  const [maxSalary, setMaxSalary] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [employmentType, setEmploymentType] = useState<string | null>(null);
  const [experience, setExperience] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');
  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [mustHaveSkills, setMustHaveSkills] = useState<string[]>([]);
  const [niceToHaveSkills, setNiceToHaveSkills] = useState<string[]>([]);

  const [companyBenefits, setCompanyBenefits] = useState<{ id: string; label: string; checked: boolean }[]>([
    {id: 'healthInsurance', label: 'Health Insurance', checked: false},
    {id: 'matching401k', label: '401(k) Matching', checked: false},
    {id: 'unlimitedPTO', label: 'Unlimited PTO', checked: false},
    {id: 'learningBudget', label: 'Learning Budget', checked: false},
  ]);


  const editorRef = useRef(null);

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

  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted client: ");

    const finalLocation = isRemote ? "REMOTE" : location;

    console.log({
      title,
      minSalary,
      maxSalary,
      department,
      employmentType,
      experience,
      location: finalLocation,
      isRemote,
      description,
      mustHaveSkills,
      niceToHaveSkills,
      companyBenefits
    })



    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("minSalary", minSalary);
    formData.append("maxSalary", maxSalary);
    formData.append("department", department);
    formData.append("employmentType", employmentType as string);
    formData.append("experience", experience as string);
    formData.append("location", finalLocation);
    formData.append("mustHaveSkills", JSON.stringify(mustHaveSkills));
    formData.append("niceToHaveSkills", JSON.stringify(niceToHaveSkills));
    formData.append("companyBenefits", JSON.stringify(companyBenefits));


    const result = await createJobAction(formData);
    console.log("result: ", result);
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  return (
    <div>
      <HRHeader title='Create New Job' />
      <main className='py-6 px-12'>
        {/* Basic Information */}
        <FieldSet className='space-y-6 mb-12'>
          <JobInputCard title='Basic Information' icon={<Info size={20} />}>
            <FieldSet className=''>
              <FieldGroup className='grid grid-cols-6 gap-x-6 gap-y-6 text-zinc-600'>
                <FieldInput
                  label='Job Title'
                  placeholder='e.g. Senior Full Stack Engineer'
                  className='col-span-6'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <FieldInput
                  label='Department'
                  placeholder='e.g. Senior Full Stack Engineer'
                  className='col-span-2'
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
                <FieldSelect
                  label='Employment Type'
                  placeholder='e.g. Full Time'
                  className='col-span-2'
                  items={employmentTypeItem}
                  value={employmentType as string}
                  onValueChange={setEmploymentType}
                />
                <FieldSelect
                  label='Experience'
                  placeholder='e.g. Freshers'
                  className='col-span-2'
                  items={employmentExperience}
                  value={experience as string}
                  onValueChange={setExperience}
                />


                <div className='flex items-center flex-wrap p-4 col-span-6 bg-primary-foreground border border-primary/10 rounded-[16px]'>
                  <FieldContent>
                    <FieldTitle className='text-base font-normal text-primary '>Location Strategy</FieldTitle>
                    <FieldDescription>Allow applicants from anywhere in the world</FieldDescription>
                  </FieldContent>

                  <div className='flex gap-4'>
                    <Field className=''>
                      <Input
                        className='bg-card text-base font-normal px-4 py-2 '
                        placeholder='e.g City, Country'
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={isRemote}
                      />
                    </Field>

                    <Field orientation="horizontal" className="w-fit">
                      <Switch
                        id="remote"
                        checked={isRemote}
                        onCheckedChange={(checked) => {
                          setIsRemote(checked);
                          if (checked) {
                            setLocation('Remote location');
                          } else {
                            setLocation('');
                          }
                        }}
                      />
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
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                />
                <FieldInput
                  label='Maximum Salary (Annual USD)'
                  placeholder='e.g. 120,000'
                  className='col-span-2'
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                />
                <FieldSet className='col-span-4'>
                  <FieldLegend variant="label" className='text-zinc-600'>Company Benefits</FieldLegend>
                  <FieldGroup className='grid grid-cols-4 gap-x-2 gap-y-2'>
                    {
                      companyBenefits.map((benefit) => (
                        <div key={benefit.id} className='col-span-1 p-3 border rounded-lg'>
                          <FieldCheckBox 
                          label={benefit.label} 
                          checked={benefit.checked}
                          onCheckedChange={(checked) => setCompanyBenefits(
                              companyBenefits.map(b => b.id ===benefit.id ? {...b, checked } : b)
                            )}
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
              <FieldOptionInput
                label='Must-have Skills'
                placeholder='e.g. Senior Full Stack Engineer'
                className='col-span-2'
                options={mustHaveSkills}
                setOptions={setMustHaveSkills}
              />
              <FieldOptionInput
                label='Nice-to-have Skills'
                placeholder='e.g. Senior Full Stack Engineer'
                className='col-span-2'
                options={niceToHaveSkills}
                setOptions={setNiceToHaveSkills}
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
                <Button type="submit" size={'lg'} className={'px-8'} onClick={(e) => handleSubmit(e)}>Publish Job Vacancy</Button>
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>
      </main>
    </div>
  )
}
