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
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search products (e.g., 'wireless headphones', 'yoga mat')"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10 bg-background"
        />
      </div>
      <Button type="submit" disabled={isLoading || !inputValue.trim()}>
        {isLoading ? 'Searching...' : 'Compare'}
      </Button>
    </form>
  );
}