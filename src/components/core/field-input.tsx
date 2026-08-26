'use client'

import React, { useId, forwardRef } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface FieldInputProps extends React.ComponentProps<'input'> {
  label?: string;
  error?: string;
}

const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(
  ({ label, error, className, id: externalId, ...props }, ref) => {
    const generatedId = useId()
    const id = externalId || generatedId

    return (
      <Field className={`grid gap-2 ${className ?? ''}`}>
        {label && (
          <FieldLabel className="text-base font-normal" htmlFor={id}>
            {label}
          </FieldLabel>
        )}
        <Input
          ref={ref}
          id={id}
          className="text-base font-normal px-4 py-3"
          {...props}
        />
        {error && (
          <span className="text-sm text-red-500 font-medium">
            {error}
          </span>
        )}
      </Field>
    )
  }
)

FieldInput.displayName = 'FieldInput'

export default FieldInput