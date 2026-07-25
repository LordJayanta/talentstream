import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useId } from "react";

type Props = {
    label: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void
}

function CheckBoxMark({label, checked, onCheckedChange}: Props) {
    const id = useId();
    return (
        <FieldGroup>
            <Field orientation="horizontal">
                <Checkbox
                    id={id}
                    name={id}
                    checked={checked}
                    onCheckedChange={onCheckedChange}
                />
                <FieldLabel htmlFor={id}  className="font-normal text-sm">{label}</FieldLabel>
            </Field>
        </FieldGroup>
    )
}

export default CheckBoxMark