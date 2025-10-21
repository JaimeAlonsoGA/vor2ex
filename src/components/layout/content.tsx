import { cn } from '@/lib/utils';

export function PageContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'w-full min-h-screen',
        className
      )}
    >
      {children}
    </div>
  );
}
