import { Loader2 } from 'lucide-react';
import LoadingIcon from '../loading/loading';

export const FormLoadingState = () => {
  return (
    <div className="flex h-full min-h-[40vh] w-full items-center justify-center rounded-lg border bg-background p-4">
      <div className="relative flex items-center justify-center">
        <Loader2 className="h-20 w-20 animate-spin text-blue-500/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingIcon />
        </div>
      </div>
    </div>
  );
};
