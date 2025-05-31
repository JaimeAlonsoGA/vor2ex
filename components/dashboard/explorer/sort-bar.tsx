'use client';

import { Button } from "@/components/ui/button";

interface SortBarProps {
    sortField: string;
    sortOrder: string;
    onChange: (field: string, order: string) => void;
}

const sortFields = [
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
    { value: 'reviews', label: 'Reviews' },
    { value: 'name', label: 'Name' },
];

export default function SortBar({ sortField, sortOrder, onChange }: SortBarProps) {
    return (
        <div className="flex items-center gap-2">
            {sortFields.map(f => (
                <Button
                    key={f.value}
                    variant={sortField === f.value ? 'default' : 'outline'}
                    onClick={() => onChange(f.value, sortOrder)}
                >
                    {f.label}
                </Button>
            ))}
            <Button variant="ghost" onClick={() => onChange(sortField, sortOrder === 'asc' ? 'desc' : 'asc')}>
                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </Button>
        </div>
    );
}