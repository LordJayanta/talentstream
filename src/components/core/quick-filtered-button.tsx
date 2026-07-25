import { Plus, X } from 'lucide-react';
import React from 'react'

type Props = {
    label: string;
    type?: 'add' | 'remove';
}

export const QuickFilteredButton = ({label, type='remove'}: Props) => {
  return (
    <div className={`flex gap-1 items-center justify-center px-4 py-1.5 rounded-[12px] ${type === 'add' ? 'border-dashed border-2' : 'border'}`}>
        {type === 'remove' && <X size={16}/>}
        {type === 'add' && <Plus size={16} />}
        <span className='text-sm'>{label}</span>
    </div>
  )
}
