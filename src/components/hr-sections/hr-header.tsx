import Link from 'next/link'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Field } from '../ui/field'
import { ButtonGroup } from '../ui/button-group'
import { Bell, Settings } from 'lucide-react'
import Avatar from '../avatar'

type Props = {
  title: string;
}

function HRHeader({ title }: Props) {
  return (
    <div className='h-16 w-full'>
      <header className='absolute top-0 h-16 w-full flex justify-between items-center px-6 border-b '>
        <div className="flex justify-between items-center gap-8">
          <div className="">
            <Link href="/" className='text-secondary-foreground font-bold text-2xl'>{title}</Link>
          </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          <Bell />
          <Settings />
          <Avatar />
        </div>
      </header>
    </div>
  )
}

export default HRHeader