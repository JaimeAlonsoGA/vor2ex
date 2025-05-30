'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full mx-auto gap-2">
      <div className="flex items-center gap-2 w-full md:w-80">
        <Input
          type="search"
          placeholder="Search keyword or category..."
          value={inputValue}
          disabled={isLoading}
          onChange={e => setInputValue(e.target.value)}
          className="w-full"
          aria-label="Search opportunities"
        />
        <Button
          type="submit"
          disabled={isLoading}
          variant="outline"
          className={`px-3 ${isLoading ? 'animate-pulse' : ''}`}
          tabIndex={-1}
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}