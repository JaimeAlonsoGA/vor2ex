"use client";

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentKeyword = searchParams.get("keyword") || "";
  const [input, setInput] = useState(currentKeyword);
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const search = input.trim();
    if (!search) return;
    startTransition(() => {
      router.push(`${pathname}?${createQueryString("keyword", search)}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex items-center gap-2 w-full md:w-80">
        <Input
          type="search"
          name="search"
          placeholder="Search keyword or category..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="w-full"
          aria-label="Search opportunities"
          disabled={isPending}
        />
        <Button
          type="submit"
          variant="outline"
          className={`px-3`}
          disabled={isPending}
        >
          {isPending ? <Spinner className="w-4 h-4" /> : <Search className="w-4 h-4" />}
        </Button>
      </div>
    </form>
  );
}