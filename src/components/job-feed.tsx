import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import JobCard from "./job-card"

function JobFeed() {
    
    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h4 className='text-lg font-semibold'>Recommended Jobs <span className='text-sm text-zinc-500 font-normal'>(24 results)</span></h4>
                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline" />}>
                        Sort by: Match Score
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Sort by: Match Score</DropdownMenuLabel>
                            <DropdownMenuItem>Sort by: Newest to Oldest</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <section className='space-y-4'>
                <JobCard />
                <JobCard />
                <JobCard />
                <JobCard />
                <JobCard />
                <JobCard />
                <JobCard />
            </section>
        </div>
    )
}

export default JobFeed