import React, { useId } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectRootChangeEventDetails } from '@base-ui/react';

interface Props {
  label?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: SelectItems['value'];
  items: SelectItems[];
  value?: string;
  onValueChange?: ((value: string | null, eventDetails: SelectRootChangeEventDetails) => void) | undefined
}

export type SelectItems = {
  label: string;
  value: string;
}

export default function FieldSelect({ label, className, placeholder, items, defaultValue, value, onValueChange }: Props) {
  const id = useId()

  return (
    <Field className={`grid gap-2 ${className}`}>
      {label && <FieldLabel className='text-base font-normal' htmlFor={id}>{label}</FieldLabel>}
      <Select
        id={id}
        items={items}
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger className='text-base font-normal px-4 py-3'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={true} className='text-base font-normal px-4 py-3'>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
