'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-medium">Loading product comparison...</h2>
      <p className="text-muted-foreground mt-2">
        Fetching data from marketplaces
      </p>
    </div>
  );
}