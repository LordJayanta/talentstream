import HRHeader from '@/components/hr-sections/hr-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CirclePlus, EllipsisVertical, Eye, Pen } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

// 1. Define clean status types
export type JobStatus = "active" | "draft" | "closed" | "stopped";

// 2. Define the pure Data type (matches what your database will look like)
export type Job = {
  id: string | number;
  title: string;
  status: JobStatus;
  date: Date | string;
  applicantsCount: number;
  manager: string;
};

// 3. Define all possible actions as a union
export type JobAction =
  | "Edit"
  | "Delete"
  | "View"
  | "Close"
  | "View Applicants"
  | "Publish"
  | "Reopen";

// 4. Create a helper function to automatically determine actions based on status
export function getAvailableActions(status: JobStatus): JobAction[] {
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

export default function Page() {
  const jobs: Job[] = [
    {
      id: "job-001",
      title: "Senior Full Stack Engineer",
      status: "active",
      date: "2026-08-10",
      applicantsCount: 42,
      manager: "Sarah Chen"
    },
    {
      id: "job-002",
      title: "Product Marketing Manager",
      status: "active",
      date: "2026-08-12",
      applicantsCount: 18,
      manager: "Alex Rivera"
    },
    {
      id: "job-003",
      title: "Lead UX Researcher",
      status: "draft",
      date: "2026-08-15",
      applicantsCount: 0,
      manager: "Elena Rostova"
    },
    {
      id: "job-004",
      title: "DevOps / Infrastructure Specialist",
      status: "stopped",
      date: "2026-07-28",
      applicantsCount: 65,
      manager: "Marcus Vance"
    },
    {
      id: "job-005",
      title: "Data Analyst",
      status: "closed",
      date: "2026-06-14",
      applicantsCount: 110,
      manager: "Sarah Chen"
    },
    {
      id: "job-006",
      title: "Customer Success Lead",
      status: "active",
      date: "2026-08-01",
      applicantsCount: 29,
      manager: "David Kim"
    }
  ]

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
                <TableHead className='text-center'>manager</TableHead>
                <TableHead className='text-center'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                jobs.map((job) => {
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
                      <TableCell className='text-center'>{job.date as string}</TableCell>
                      <TableCell className='text-center'>{job.applicantsCount}</TableCell>
                      <TableCell className='text-center'>{job.manager}</TableCell>
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
                          <Button variant={'ghost'} size={'icon-sm'}>
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <EllipsisVertical size={16} className='text-zinc-500' />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuGroup>
                                  {actions.includes('Close') && <DropdownMenuItem>Close</DropdownMenuItem>}
                                  {actions.includes('Delete') && <DropdownMenuItem>Delete</DropdownMenuItem>}
                                  {actions.includes('Reopen') && <DropdownMenuItem>Reopen</DropdownMenuItem>}
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </Button>
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
