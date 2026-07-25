"use client"

import { Card, CardDescription, CardHeader } from './ui/card'
import { AspectRatio } from './ui/aspect-ratio'
import Image from 'next/image'
import JobProfile from '@/assets/JobUser.jpg'
import { Badge } from './ui/badge'
import { BanknoteCheck, Bookmark, BriefcaseBusiness, Zap } from 'lucide-react'
import { Separator } from './ui/separator'
import { Button } from './ui/button'

export default function JobCard() {
    return (
        <Card className='rounded-md gap-4'>
            <CardHeader className='gap-4'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <AspectRatio ratio={1 / 1} className="w-full max-w-12 rounded-lg">
                            <Image
                                src={JobProfile}
                                alt="Photo"
                                fill
                                className="rounded-lg object-cover grayscale dark:brightness-20"
                            />
                        </AspectRatio>
                        <div className='w-md'>
                            <p className='text-lg'>Senior Software Engineer</p>
                            <p className='text-sm'>CloudNova Systems • Remote (US)</p>
                        </div>
                    </div>
                    <div>
                        <div className='w-12 h-12 flex items-center justify-center bg-muted rounded-md border-2 border-primary'>
                            <span className='text-sm text-primary'>98%</span>
                        </div>
                        <span>MATCH</span>
                    </div>
                </div>
                <div className='flex gap-2'>
                    <Badge variant="secondary" >
                        <BanknoteCheck size={16} />
                        $140k - $170k
                    </Badge>
                    <Badge variant="secondary" >
                        <BriefcaseBusiness size={16} />
                        Full Time
                    </Badge>
                    <Badge variant={'standred'}>Full Time</Badge>
                </div>
                <CardDescription className='max-w-4xl'>We are looking for an experienced Frontend Engineer to lead the development of our next-generation cloud management dashboard. You will work closely with design and backend teams to deliver a…</CardDescription>

                <div className={'mx-auto w-[95%]'}><Separator /></div>

                <div className='flex items-center justify-between'>
                    <span className='text-zinc-600'>Posted 2 hours ago</span>

                    <div className='flex gap-2'>
                        <Button variant={'outline'} className={'px-4! py-4! min-h-11.5'}>
                            <Bookmark size={18}/>
                        </Button>
                        <Button className={'px-6! py-4! min-h-11.5'}>
                            <Zap />
                            <span className="">One-Click Apply</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>

        </Card>
    )
}
