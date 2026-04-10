import { TextInput } from '../inputs';
import { DaycareStatusInput } from './DaycareStatusInput';
import { SelectInput, type SelectOption } from './SelectInput';
import type { FormField } from './form.types';

type GetTextFieldProps<T> = Omit<FormField<T, string>, 'input'> & {
  message?: string;
};

type GetSelectFieldProps<T> = Omit<FormField<T, string, { options?: SelectOption[]; title?: string }>, 'input'> & {
  message?: string;
};

export function getTextField<T>({ label, message, props, show }: GetTextFieldProps<T>): FormField<T, string> {
  return {
    label,
    props,
    input: ({ onChange, ...inputProps }) => TextInput({ ...inputProps, onChangeText: onChange }),
    show,
  };
}

export function getSelectField<T>({
  label,
  props,
  show,
}: GetSelectFieldProps<T>): FormField<T, string, { options?: SelectOption[]; title?: string }> {
  return {
    label,
    props,
    input: ({ onChange, ...inputProps }) => SelectInput({ ...inputProps, onChange }),
    show,
  };
}

export function getDaycareStatusField<T>({
  label,
  props,
  show,
}: Omit<FormField<T, string, { options?: SelectOption[]; title?: string }>, 'input'> & { message?: string }): FormField<
  T,
  string,
  { options?: SelectOption[]; title?: string }
> {
  return {
    label,
    props,
    input: ({ onChange, ...inputProps }) => DaycareStatusInput({ ...inputProps, onChange }),
    show,
  };
}
