'use client';

import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "../../ui/button";
import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from "@/components/ui/label";
import { StarRating } from './star-rating';
import { Dispatch, SetStateAction, useState } from "react";
import { DEFAULT_FILTERS } from "@/lib/functions/explorer/filters-and-sort";
import { cn } from "@/lib/utils";

interface Props {
    categories: string[];
    setFilters: Dispatch<SetStateAction<{
        verifiedOnly: boolean;
        guaranteedOnly: boolean;
        minRating: number;
        maxRating: number;
        maxMOQ: string;
        category: string;
    }>>
    filters: {
        verifiedOnly: boolean;
        guaranteedOnly: boolean;
        minRating: number;
        maxRating: number;
        maxMOQ: string;
        category: string;
    }
}

export default function FilterDropdown({ categories, setFilters, filters }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Minimum rating
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <div className="px-2 py-2">
                                    <StarRating
                                        value={filters.minRating}
                                        onChange={(val) => setFilters({ ...filters, minRating: val })}
                                        aria-label="Select minimum rating"
                                    />
                                </div>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Maximum rating
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <div className="px-2 py-2">
                                    <StarRating
                                        maximum
                                        value={filters.maxRating}
                                        onChange={(val) => setFilters({ ...filters, maxRating: val })}
                                        aria-label="Select maximum rating"
                                    />
                                </div>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Category
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <div className="px-2 py-2">
                                    <Select
                                        value={filters.category || "all"}
                                        onValueChange={value => setFilters({ ...filters, category: value === "all" ? "" : value })}
                                    >
                                        <SelectTrigger className="w-full rounded border-gray-300 px-2 py-1 text-sm" id="amazon-category">
                                            <SelectValue placeholder="All" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {categories?.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Max MOQ
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <div className="px-2 py-2">
                                    <input
                                        id="max-moq"
                                        type="number"
                                        min={1}
                                        placeholder="E.g. 1000"
                                        className="w-full rounded border-gray-300 px-2 py-1 text-sm"
                                        value={filters.maxMOQ}
                                        onChange={e => setFilters({ ...filters, maxMOQ: e.target.value })}
                                    />
                                </div>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem asChild>
                        <div className="flex items-center space-x-2 w-full">
                            <input
                                type="checkbox"
                                id="verified-only"
                                checked={filters.verifiedOnly}
                                onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="verified-only" className="w-full cursor-pointer">Verified only</Label>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <div className="flex items-center space-x-2 w-full">
                            <input
                                type="checkbox"
                                id="guaranteed-only"
                                checked={filters.guaranteedOnly}
                                onChange={(e) => setFilters({ ...filters, guaranteedOnly: e.target.checked })}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="guaranteed-only" className="w-full cursor-pointer">Guaranteed only</Label>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Button
                            onClick={() => setFilters(DEFAULT_FILTERS)}
                            variant="outline">
                            Reset filters
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}