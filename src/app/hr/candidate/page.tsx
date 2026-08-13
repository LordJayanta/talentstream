import HRHeader from '@/components/hr-sections/hr-header'
import Link from 'next/link'
import React from 'react'

export default function Page() {
  return (
    <div>
      <HRHeader title='Candidate Pipeline' />
      <main className='p-6'>
        <Link href={'./job/new'}>New</Link>
      </main>
    </div>
  )
}
