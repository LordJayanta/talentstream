"use client"

import React, { useId } from 'react'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type SelectItemType = {
  label: string;
  value: string;
}

export type SelectItems = SelectItemType;

interface FieldSelectProps {
  label?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  items: SelectItemType[];
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  name?: string;
}

const FieldSelect = React.forwardRef<HTMLButtonElement, FieldSelectProps>(
  ({ label, className, placeholder, items, defaultValue, value, onValueChange, error, name }, ref) => {
    const generatedId = useId()
    const isControlled = React.useRef(value !== undefined).current

    return (
      <Field className={`grid gap-2 ${className}`}>
        {label && (
          <FieldLabel className='text-base font-normal' htmlFor={generatedId}>
            {label}
          </FieldLabel>
        )}
        <Select
          id={generatedId}
          name={name}
          items={items}
          {...(isControlled ? { value: value ?? null } : { defaultValue })}
          onValueChange={(val) => {
            if (val !== null && onValueChange) {
              onValueChange(val);
            }
          }}
        >
          <SelectTrigger 
            ref={ref}
            id={generatedId}
            aria-invalid={!!error}
            className='text-base font-normal px-4 py-3'
          >
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

        {error && <FieldError className="text-xs text-destructive mt-1">{error}</FieldError>}
      </Field>
    )
  }
)

FieldSelect.displayName = 'FieldSelect'

export default FieldSelect