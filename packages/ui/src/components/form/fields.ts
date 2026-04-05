import { string } from 'yup';

import { TextInput } from '../inputs';
import type { FormField } from './form.types';

type GetTextFieldProps<T> = Omit<FormField<T, string>, 'input'> & {
  message?: string;
};

export function getTextField<T>({ label, message, props, show }: GetTextFieldProps<T>): FormField<T, string> {
  return {
    label,
    props,
    input: TextInput,
    validation: string().required(message),
    show,
  };
}
