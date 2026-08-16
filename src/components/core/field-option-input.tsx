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
}

export default function FieldOptionInput({ label, placeholder, className }: Props) {
  const id = useId();
  const [skills, setSkills] = useState<string[]>(['React.js', 'TypeScript']);
  const [value, setValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && value.trim()) {
      e.preventDefault();
      const newSkill = value.trim();
      if(!skills.includes(newSkill)){
        setSkills([...skills, newSkill]);
      }
      setValue('');
    } else if ((e.key === 'Backspace' || e.key === 'Delete') && !value.trim()) {
      setSkills(skills.slice(0, -1));
    }
  }

  return (
    <Field className={`grid gap-2 ${className}`}>
      {label && <FieldLabel className='text-base font-normal' htmlFor={id}>{label}</FieldLabel>}
      <div className='flex gap-2'>
        {skills.map((skill, index) => (
          <Badge key={index}>
            <span>{skill}</span>
            <span
              className='rounded-full cursor-pointer'
              onClick={() => setSkills(skills.filter(s => s !== skill))}
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
