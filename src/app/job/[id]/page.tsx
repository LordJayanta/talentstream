import Header from '@/components/core/header';
import JobDetailsBody from '@/components/job-details-body';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BanknoteCheck, BriefcaseBusiness, Building2, CircleCheckBig, Clock, Dot, MapPin, Sparkles } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

interface PageProps {
  params: Promise<{
    id: string
  }>
}



export default async function Page({ params }: PageProps) {
  const router = await params;

  const badge = [
    {
      label: 'Full Time',
      icon: <BriefcaseBusiness size={16} />,
    },
    {
      label: '$140k - $170k',
      icon: <BanknoteCheck size={16} />,
    },
    {
      label: 'Posted 2 days ago',
      icon: <Clock size={16} />,
    },
    {
      label: 'Senior',
      icon: <Sparkles size={16} />,
    },
  ]

  const responsibilities = [
    "Lead end-to-end design processes for major feature areas.",
    "Evolve and maintain our Figma-based design system.",
    "Conduct user research and translate insights into actionable UX improvements.",
    "Partner with engineering to ensure high-quality implementation."
  ]

  const requirements = [
    {
      label: 'MUST-HAVES',
      items: [
        '5+ years of product design experience (B2B/SaaS preferred).',
        'Expert proficiency in Figma and prototyping tools.',
        'Strong portfolio demonstrating complex problem solving.'
      ],
    },
    {
      label: 'NICE-TO-HAVES',
      items: [
        'Experience designing for AI or data-heavy applications.',
        'Basic understanding of frontend frameworks (React/Tailwind).',
      ]
    }
  ]

  const benefits = [
    {
      icon: <Sparkles size={18} />,
      label: 'Collaborative Team',
      description: 'We believe in cross-functional pods where design has an equal seat at the table.',
    },
    {
      icon: <Sparkles size={18} />,
      label: 'Continuous Learning',
      description: 'Annual stipend for conferences, courses, and design literature.',
    },
    {
      icon: <Sparkles size={18} />,
      label: 'Wellbeing First',
      description: 'Flexible hours, mental health days, and comprehensive healthcare coverage.',
    },
  ]

  const userAvatar: string | null = 'https://avatars.githubusercontent.com/u/86449829?v=4'; // or fetch from an API
  return (
    <div className='bg-accent'>
      <Header />
      <div className='grid grid-cols-12 px-16 py-10 gap-6'>
        <main className='col-span-8 space-y-6'>
          {/* Job Details Header */}
          <section>
            <Card>
              <CardHeader>
                <div className='flex gap-4'>
                  {/* Company Logo */}
                  <div>
                    <Image
                      src={'/globe.svg'}
                      width={64}
                      height={64}
                      alt={'HR_name'}
                      loading="eager"
                      className='overflow-hidden rounded-[12px]'
                    />
                  </div>
                  {/* Job Header */}
                  <div className=''>
                    <CardTitle>
                      <h4 className='font-semibold text-[32px] tracking-[-0.32px]'>Senior Product Designer</h4>
                    </CardTitle>

                    <CardDescription className='flex gap-3'>
                      <div className='text-zinc-600 flex gap-1'>
                        <Building2 size={15} className='text-zinc-600' />
                        <p className='text-sm text-zinc-600'>Nexus Technologies</p>
                      </div>
                      <Dot className='text-zinc-400' />
                      <div className='text-zinc-600 flex gap-1'>
                        <MapPin size={15} className='text-zinc-600' />
                        <p className='text-sm text-zinc-600'>San Francisco, CA (Hybrid)</p>
                      </div>
                    </CardDescription>
                  </div>
                </div>
                <CardAction className='space-x-2'>
                  <Button variant="outline">Save</Button>
                  <Button variant="default">Apply Now</Button>
                </CardAction>
              </CardHeader>

              <CardFooter className='mt-2'>
                <div className='flex gap-4'>
                  {badge.map((item, index) => (
                    <Badge key={index} variant="secondary" className='border border-zinc-300 rounded-full px-3'>
                      {item.icon}
                      {item.label}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </section>

          {/* Job Details Body */}
          <JobDetailsBody />

          {/* Job Requirements & Responsibilities */}
          <section className='grid grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle className='text-base font-semibold'>Key Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {responsibilities.map((item, index) => (
                    <div key={index} className='flex gap-2'>
                      <span className='py-1.5'>
                        <CircleCheckBig size={16} />
                      </span>
                      <p className='text-zinc-500 text-sm'>{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-base font-semibold'>Job Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  {requirements.map((item, index) => (
                    <div key={index} className='space-y-1.5'>
                      <h1 className='font-semibold text-xs'>{item.label}</h1>
                      <div className='border-l-2 border-zinc-500 pl-2'>
                        {item.items.map((item, index) => (
                          <p key={index} className='text-zinc-600 text-sm'>{item}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Job Benefits */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>
                  <h4 className='font-semibold text-lg'>Benefits: Life at Nexus</h4>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-3 gap-4'>
                  {
                    benefits.map((item, index) => (
                      <div key={index} className='flex flex-col gap-4 bg-zinc-50 border border-zinc-200 rounded-md p-4'>
                        <div>{item.icon}</div>
                        <h4 className='font-semibold text-base'>{item.label}</h4>
                        <p className='text-sm text-zinc-600'>{item.description}</p>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
        <aside className={'col-span-4  space-y-6'}>
          <Card>
            <CardHeader>
              <Sparkles size={22} />
              <CardTitle>
                <h4 className='font-bold'>AI Match Breakdown</h4>
              </CardTitle>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter>
              <Button variant={'outline'} className={'w-full px-4 py-2'}>Message Hiring Manager</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <h4 className='font-semibold text-lg'>Hiring Team</h4>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-4 bg-zinc-50 border border-zinc-200 rounded-md p-4'>
                <div>
                  <Image
                    src={userAvatar ?? '/globe.svg'}
                    width={48}
                    height={48}
                    alt={'HR_name'}
                    loading="eager"
                    className='overflow-hidden rounded-[12px]'
                  />
                </div>
                <div>
                  <h4 className='font-semibold text-sm'>Sarah Jenkins</h4>
                  <p className='text-xs text-zinc-600'>VP of Design</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant={'outline'} className={'w-full px-4 py-2'}>Message Hiring Manager</Button>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </div>
  )
}
