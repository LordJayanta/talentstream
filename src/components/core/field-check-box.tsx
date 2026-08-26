"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"

export interface FieldCheckBoxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, "checked" | "onCheckedChange"> {
  label?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  error?: string
}

const FieldCheckBox = React.forwardRef<HTMLButtonElement, FieldCheckBoxProps>(
  ({ label, checked = false, onCheckedChange, error, className, id, ...props }, ref) => {
    const generatedId = React.useId()
    const checkboxId = id || generatedId

    return (
      <Field orientation="horizontal" className={className as string}>
        <Checkbox
          ref={ref}
          id={checkboxId}
          checked={checked}
          onCheckedChange={(val) => {
            // Converts "indeterminate" string state to boolean if applicable
            onCheckedChange?.(val === true)
          }}
          aria-invalid={!!error}
          {...props}
        />
        
        {label && (
          <FieldLabel htmlFor={checkboxId} className="font-normal text-sm cursor-pointer select-none">
            {label}
          </FieldLabel>
        )}

        {error && <FieldError className="text-xs text-destructive mt-1 col-span-full">{error}</FieldError>}
      </Field>
    )
  }
)

FieldCheckBox.displayName = "FieldCheckBox"

export default FieldCheckBox