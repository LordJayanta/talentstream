import React, { useId } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface Props {
  label?: string;
  placeholder?: string;
  className?: string;
  value?: string | number | readonly string[] | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement> | undefined;
}

export default function FieldInput({ label, placeholder, className, value, onChange }: Props) {
  const id = useId()
  return (
    <Field className={`grid gap-2 ${className}`}>
      {label && <FieldLabel className='text-base font-normal' htmlFor={id}>{label}</FieldLabel>}
      <Input
        className='text-base font-normal px-4 py-3'
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </Field>
  )
}
