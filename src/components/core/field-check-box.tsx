import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { useId } from "react";

type Props = {
    label?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void
}

function FieldCheckBox({ label, checked, onCheckedChange }: Props) {
    const id = useId();
    return (
        <Field orientation="horizontal">
            <Checkbox
                id={id}
                name={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
            />
            {label && <FieldLabel htmlFor={id} className="font-normal text-sm">{label}</FieldLabel>}
        </Field>
    )
}

export default FieldCheckBox