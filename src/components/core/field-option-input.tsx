'use client'

import React, { KeyboardEvent, useId, useState } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';

interface Props {
  label?: string;
  placeholder?: string;
  className?: string;
  options: string[];
  setOptions: React.Dispatch<React.SetStateAction<string[]>>
}

export default function FieldOptionInput({ label, placeholder, className, options, setOptions }: Props) {
  const id = useId();
  // const [skills, setSkills] = useState<string[]>(['React.js', 'TypeScript']);
  const [value, setValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && value.trim()) {
      e.preventDefault();
      const newSkill = value.trim();
      if(!options.includes(newSkill)){
        setOptions([...options, newSkill]);
      }
      setValue('');
    } else if ((e.key === 'Backspace' || e.key === 'Delete') && !value.trim()) {
      setOptions(options.slice(0, -1));
    }
  }

  return (
    <Field className={`grid gap-2 ${className}`}>
      {label && <FieldLabel className='text-base font-normal' htmlFor={id}>{label}</FieldLabel>}
      <div className='flex gap-2'>
        {options.map((option, index) => (
          <Badge key={index}>
            <span>{option}</span>
            <span
              className='rounded-full cursor-pointer'
              onClick={() => setOptions(options.filter(s => s !== option))}
            >
              <X />
            </span>
          </Badge>
        ))}
      </div>
      <Input
        className='text-base font-normal px-4 py-3'
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </Field>
  )
}
