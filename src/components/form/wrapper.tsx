import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { type DefaultValues, FormProvider, useForm, type UseFormReturn, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { toast } from 'sonner';

interface BaseFormWrapperProps {
  title?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function FormWrapper<T extends FieldValues = FieldValues>({
  title,
  children,
  className,
  contentClassName,
  defaultValues,
  onSubmit,
  formSchema,
  form,
}: BaseFormWrapperProps & {
  defaultValues?: DefaultValues<T>;
  formSchema?: z.ZodType<T>;
  onSubmit?: (values: T) => void;
  form?: UseFormReturn<T>;
}) {
  const internalForm = useForm<T>({
    defaultValues,
    resolver: formSchema ? (zodResolver(formSchema as any) as any) : undefined,
  });

  const f = form || internalForm;

  useEffect(() => {
    if (f.formState.isSubmitted && f.formState.errors && Object.keys(f.formState.errors).length > 0) {
      const firstError = Object.values(f.formState.errors)[0];
      toast.warning(
        typeof firstError?.message === 'string' ? firstError.message : 'An error occurred. Please check your input.',
        { duration: 2000 }
      );
    }
  }, [f.formState.errors, f.formState.isSubmitted]);

  return (
    <div className={className}>
      {title && (
        <FormHeader
          title={title}
        />
      )}

      <div className={contentClassName}>
        <FormProvider {...f}>
          <form
            onSubmit={f.handleSubmit((values) => {
              if (onSubmit) {
                onSubmit(values);
              }
            })}
            className={cn('mt-2 flex flex-col gap-4', className)}
          >
            {children}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

interface FormHeaderProps {
  title: string;
  onClose?: () => void;
  onBack?: () => void;
  actions?: ReactNode;
}

export function FormHeader({ title, actions }: FormHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center gap-2">
        <h2 className="truncate text-lg font-semibold md:text-xl">{title}</h2>
      </div>

      <div className="flex items-center gap-2">
        {actions}
      </div>
    </div>
  );
}

interface FormActionsProps {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
}

export function FormActions({ children, className, sticky = true }: FormActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-end gap-3 border-t bg-card px-4 py-3 md:px-6 md:py-4',
        sticky && 'sticky bottom-0 z-10',
        className
      )}
    >
      {children}
    </div>
  );
}

interface FormItemProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  className?: string;
  children: ReactNode;
  description?: string;
  required?: boolean;
}

export function FormItem({ label, htmlFor, error, className, children, description, required = false }: FormItemProps) {
  return (
    <div className={cn('mb-4 md:mb-6', className)}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      {children}
      {description && <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('mb-6 md:mb-8', className)}>
      {title && <h3 className="mb-2 text-base font-medium md:text-lg">{title}</h3>}
      {description && <p className="mb-4 text-sm text-muted-foreground">{description}</p>}
      <div className="space-y-4">{children}</div>
    </div>
  );
}