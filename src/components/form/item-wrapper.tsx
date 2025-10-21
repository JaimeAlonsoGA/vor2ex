import { useFormContext, ControllerRenderProps, FieldValues, RegisterOptions } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import React from 'react';

export const FormItemWrapper = ({
  name,
  children,
  description,
  label,
  rules,
  className
}: {
  name: string;
  children: React.ReactNode | ((field: ControllerRenderProps<FieldValues, string>) => React.ReactNode);
  description?: string;
  label?: string;
  onChange?: (value: unknown) => void;
  rules?: RegisterOptions
  className?: string;
}) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <FormItem className={className} >
          {label && <FormLabel className="text-background">{label}</FormLabel>}
          <FormControl>
            {typeof children === 'function'
              ? children(field)
              : React.cloneElement(children as React.ReactElement, {
                ...field,
              })}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
