import Link from 'next/link'
import React from 'react'
import Avatar from '../avatar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Field } from '../ui/field'
import { ButtonGroup } from '../ui/button-group'
import { Bell, Settings } from 'lucide-react'

function Header() {
  return (
    <div className='h-16 w-full'>
    <header className='absolute top-0 h-16 w-full flex justify-between items-center px-6 border-b '>
      <div className="flex justify-between items-center gap-8">
        <div className="">
          <Link href="/" className='text-primary font-bold text-2xl'>TalentStream</Link>
        </div>
        <nav className="md:visible invisible flex justify-between items-center gap-6">
          <Link href="/">Home</Link>
          <Link href="/">About</Link>
          <Link href="/">Privacy Policy</Link>
          <Link href="/">Terms & Conditions</Link>
        </nav>
      </div>

      <div className="flex justify-between items-center gap-4">
        <Field className='md:visible invisible '>
          <ButtonGroup>
            <Input id="input-button-group" placeholder="Type to search..." />
            <Button variant="outline">Search</Button>
          </ButtonGroup>
        </Field>

        <ButtonGroup className="gap-2">
          <Bell />
          <Settings />
        </ButtonGroup>

        <Avatar />
      </div>
    </header>
    </div>
  )
}

export default Header