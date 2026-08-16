import { QuickFilteredButton } from "@/components/core/quick-filtered-button";
import Header from "@/components/core/header";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Bot, MapPin, Search, SlidersHorizontal } from "lucide-react";
import JobFeed from "@/components/job-feed";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import FieldCheckBox from "@/components/core/field-check-box";



export default function Home() {
  return (
    <div>
      <Header />
      {/* Search */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div className="pb-2">
            <h3 className="text-accent-foreground text-center text-5xl font-bold">Find Your Next Great Match</h3>
          </div>

          <ButtonGroup className="p-2">
            <InputGroup className="h-13 w-86">
              <InputGroupInput placeholder="Search..." />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
            <InputGroup className="h-13 w-86">
              <InputGroupInput placeholder="Search..." />
              <InputGroupAddon>
                <MapPin />
              </InputGroupAddon>
            </InputGroup>
            <InputGroupButton className="h-13 px-8 py-3 bg-primary hover:bg-primary/80 text-primary-foreground hover:text-primary-foreground border border-primary">Search</InputGroupButton>
            {/* <Button className="h-13 px-8 py-3 border border-primary">Search</Button> */}
          </ButtonGroup>

          <div className="flex flex-wrap gap-2 items-center justify-center">
            <QuickFilteredButton label={'Remote Only'} />
            <QuickFilteredButton label={'Engineering'} />
            <QuickFilteredButton label={'Add Filter'} type={'add'} />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-6 grid grid-cols-4 gap-6 bg-accent p-6 border-t">

        <aside className="col-span-1 space-y-6">
          {/* Filter Card */}
          <Card className='rounded-md'>
            <CardHeader className="flex gap-2 items-center">
              <SlidersHorizontal size={24} className="" />
              <CardTitle className="text-lg font-bold">Filter</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <h5 className="font-medium text-xs text-accent-foreground/70">Job Type</h5>
                <div className="space-y-2">
                  <FieldCheckBox label="Full-time" />
                  <FieldCheckBox label="Part-time" />
                  <FieldCheckBox label="Remote" />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h5 className="font-medium text-xs text-accent-foreground/70">Salary Range</h5>
                <div className="">
                  <ButtonGroup>
                    <Input type="number" placeholder="Min" />
                    <Input type="number" placeholder="Max" />
                  </ButtonGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promo Card */}
          <Card className="rounded-md bg-card-foreground">
            <CardHeader className="flex gap-2 items-center">
              <Bot size={24} className="text-accent" />
              <CardTitle className="text-lg font-bold text-accent ">Auto-Apply Active</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-accent">Let AI apply to jobs that are a 90%+ match for your profile automatically.</p>
            </CardContent>
            <CardFooter>
              <Button variant={'secondary'} className={'w-full px-4 py-2'}>Manage Settings</Button>
            </CardFooter>
          </Card>
        </aside>

        <div className="col-span-3">
          <JobFeed />
        </div>
      </section>
    </div>
  );
}
