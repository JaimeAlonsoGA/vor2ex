import type React from 'react';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter
} from '@/components/ui/drawer';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/custom/tabs';
import { cn } from '@/lib/utils';
import { DialogTitle } from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { useResponsive } from '@/hooks/use-responsive';
import useMediaQuery from '@/lib/use-media-query';

const formHeaderDialogVariants = cva('mb-0 flex border-b bg-white rounded-t-md', {
  variants: {
    variant: {
      form: 'text-xl px-10 py-4 text-primary-foreground justify-between items-start',
      alert: 'px-6 py-3 border-amber-200 bg-amber-50',
      simple: 'px-4 py-2 border-gray-200',
      compact: 'px-3 py-1 text-sm border-gray-100',
    },
    size: {
      sm: 'text-sm',
      default: 'text-lg',
      xl: 'text-xl',
    },
  },
  defaultVariants: {
    variant: 'form',
    size: 'default',
  },
});

const contentVariants = cva('flex-1 overflow-y-auto', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-3',
      default: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    padding: 'default',
  },
});

interface FormDialogProps extends VariantProps<typeof formHeaderDialogVariants> {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  onClose?: () => void;
  open?: boolean;
  className?: string;
  contentPadding?: VariantProps<typeof contentVariants>['padding'];
  tabs?: Array<{ value: string; label: string }>;
  defaultTab?: string;
}

export const FormDialog: React.FC<FormDialogProps> = ({
  trigger,
  open,
  onClose,
  children,
  footer,
  header,
  className,
  variant,
  size,
  contentPadding,
  tabs,
  defaultTab,
}) => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [activeTab, setActiveTab] = useState(defaultTab || tabs?.[0]?.value || '');

  if (!open && trigger) {
    return <div>{trigger}</div>;
  }

  // Mobile: Use Drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="flex flex-col h-[90vh] border-border">
          {header && header}
          {tabs && tabs.length > 0 && (
            <div className="flex-shrink-0 sticky top-0 bg-background border-b border-border z-10 px-4 pt-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className='w-fit mx-auto mb-1'>
                <TabsList>
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
          <div className={cn(
            "flex-1 overflow-y-auto min-h-0",
            contentVariants({ padding: contentPadding }),
            className
          )}>
            {tabs && tabs.length > 0 ? (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {children}
              </Tabs>
            ) : (
              children
            )}
          </div>
          {footer && (
            <DrawerFooter className="flex-shrink-0 sticky bottom-0 bg-background border-t border-border z-10">
              {footer}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'flex flex-col gap-0 p-0 border-border',
          'max-h-[90vh] w-screen max-w-6xl'
        )}
      >
        {header && (
          <DialogTitle className={cn(formHeaderDialogVariants({ variant, size }), 'rounded-t-md')}>
            {header}
          </DialogTitle>
        )}
        {tabs && tabs.length > 0 && (
          <div className="flex-shrink-0 sticky top-0 bg-background border-b z-10 px-4 pt-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}
        <div className={cn(contentVariants({ padding: contentPadding }), className, { 'pb-28': !!footer })}>
          {tabs && tabs.length > 0 ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {children}
            </Tabs>
          ) : (
            children
          )}
        </div>
        {footer && (
          <div className="fixed bottom-0 mt-auto w-full rounded-b-md border-t border-border bg-background p-6">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
