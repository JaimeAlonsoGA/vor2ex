import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useFormStatus } from 'react-dom';
import { useFormContext } from 'react-hook-form';

export const SubmitButton = ({
  children,
  className,
  pendingText,
  ...props
}: Parameters<typeof Button>[number] & {
  pendingText?: string;
  children: React.ReactNode;
}) => {
  // Try to get React Hook Form state first
  const formContext = useFormContext?.();
  const isSubmittingRHF = formContext?.formState?.isSubmitting || false;

  // Fallback to useFormStatus for server actions
  const { pending: pendingServerAction } = useFormStatus();

  // Use React Hook Form state if available, otherwise use server action state
  const pending = isSubmittingRHF || pendingServerAction;

  return (
    <Button type='submit' className={cn('disabled:brightness-75 mt-6 mx-auto w-fit', className)} disabled={pending || props.disabled} {...props}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? (pendingText ? pendingText : children) : children}
    </Button>
  );
};
