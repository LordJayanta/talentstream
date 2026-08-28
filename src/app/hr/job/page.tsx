'use server'

import HRHeader from '@/components/hr-sections/hr-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getJobsByRecruiterId, JobListDataItem } from '@/db/queries/job'
import { auth } from '@/lib/auth'
import { formatDataTime } from '@/lib/date-time'
import { CirclePlus, EllipsisVertical, Eye, Pen } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import React from 'react'



// Define all possible actions as a union
export type JobAction =
  | "Edit"
  | "Delete"
  | "View"
  | "Close"
  | "View Applicants"
  | "Publish"
  | "Reopen";

// 4. Create a helper function to automatically determine actions based on status
function getAvailableActions(status: JobListDataItem["status"]): JobAction[] {
  switch (status) {
    case "active":
      return ["View", "Edit", "View Applicants", "Close", "Delete"];
    case "draft":
      return ["View", "Edit", "Publish", "Delete"];
    case "closed":
      return ["View", "View Applicants", "Reopen", "Delete"];
    case "stopped":
      return ["View", "Reopen", "Delete"];
    default:
      return ["View"];
  }
}


export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  const allJobs = await getJobsByRecruiterId(session?.user.id as string);

  console.log(allJobs);

  return (
    <div>
      <HRHeader title='Jobs' />
      <main className='p-6 grid gap-6'>

        <section className='flex flex-wrap items-center justify-between'>
          <div>
            <h2 className='text-[32px]'>Manage Jobs</h2>
            <h2 className='text-zinc-500 text-sm'>View, edit, and track performance of all active requisitions.</h2>
          </div>
          <div>
            <Link href={'./job/new'}>
              <Button>
                <span>
                  <CirclePlus size={20} />
                </span>
                <span>Post New Job</span>
              </Button>
            </Link>
          </div>
        </section>

        <section>
          <Table className='bg-card rounded-[14px] text-zinc-600'>
            <TableHeader>
              <TableRow className='capitalize'>
                <TableHead className='text-center'>title</TableHead>
                <TableHead className='text-center'>status</TableHead>
                <TableHead className='text-center'>date as string</TableHead>
                <TableHead className='text-center'>applicantsCount</TableHead>
                <TableHead className='text-center'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                allJobs.map((job) => {
                  const actions: JobAction[] = getAvailableActions(job.status);
                  return (
                    <TableRow key={job.id} className=''>
                      <TableCell className='flex flex-col'>
                        <span className='font-semibold text-base text-black'>{job.title}</span>
                        <span className='pt-0.5'>{job.id}</span>
                      </TableCell>
                      <TableCell className='text-center'>
                        {
                          job.status === 'active'
                            ? <Badge variant={'standred'} className='rounded-full'>{job.status}</Badge>
                            : <Badge variant={'secondary'} className='rounded-full'>{job.status}</Badge>
                        }
                      </TableCell>
                      <TableCell className='text-center'>{formatDataTime(job.createdAt)}</TableCell>
                      <TableCell className='text-center'>{0}</TableCell>
                      <TableCell>
                        <div className='h-full flex items-center gap-1.5 justify-end'>
                          {actions.includes('Publish') && <Button variant={'ghost'} size={'sm'}>Publish</Button>}
                          {actions.includes('View Applicants') && <Button variant={'link'} size={'sm'}>View Applicants</Button>}
                          {actions.includes('View') && <Button variant={'ghost'} size={'icon-sm'}>
                            <Eye size={16} className='text-zinc-500' />
                          </Button>}
                          {actions.includes('Edit') && <Button variant={'ghost'} size={'icon-sm'}>
                            <Pen size={16} className='text-zinc-500' />
                          </Button>}
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={<Button variant="ghost" size="icon-sm" />}
                            >
                              <EllipsisVertical size={16} className="text-zinc-500" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuGroup>
                                {actions.includes('Close') && <DropdownMenuItem>Close</DropdownMenuItem>}
                                {actions.includes('Delete') && <DropdownMenuItem>Delete</DropdownMenuItem>}
                                {actions.includes('Reopen') && <DropdownMenuItem>Reopen</DropdownMenuItem>}
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </section>
      </main>
    </div>
  )
}
