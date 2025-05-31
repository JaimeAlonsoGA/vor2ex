'use client';

import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuShortcut, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "../../ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
    sortField: string;
    sortOrder: string;
    setSortField: (field: string) => void;
    setSortOrder: Dispatch<SetStateAction<"asc" | "desc">>
}

export default function SortDropdown({ sortField, sortOrder, setSortField, setSortOrder }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Sort
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => { setSortField("price"); setSortOrder("asc"); }}
                        aria-checked={sortField === "price" && sortOrder === "asc"}
                        role="menuitemradio"
                    >
                        Price: Low to High
                        {sortField === "price" && sortOrder === "asc" && (
                            <DropdownMenuShortcut>
                                <span className="text-xs text-muted-foreground">✓</span>
                            </DropdownMenuShortcut>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => { setSortField("price"); setSortOrder("desc"); }}
                        aria-checked={sortField === "price" && sortOrder === "desc"}
                        role="menuitemradio"
                    >
                        Price: High to Low
                        {sortField === "price" && sortOrder === "desc" && (
                            <DropdownMenuShortcut>
                                <span className="text-xs text-muted-foreground">✓</span>
                            </DropdownMenuShortcut>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => { setSortField("rating"); setSortOrder("desc"); }}
                        aria-checked={sortField === "rating" && sortOrder === "desc"}
                        role="menuitemradio"
                    >
                        Top Rated
                        {sortField === "rating" && sortOrder === "desc" && (
                            <DropdownMenuShortcut>
                                <span className="text-xs text-muted-foreground">✓</span>
                            </DropdownMenuShortcut>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => { setSortField("reviews"); setSortOrder("desc"); }}
                        aria-checked={sortField === "reviews" && sortOrder === "desc"}
                        role="menuitemradio"
                    >
                        Most Reviews
                        {sortField === "reviews" && sortOrder === "desc" && (
                            <DropdownMenuShortcut>
                                <span className="text-xs text-muted-foreground">✓</span>
                            </DropdownMenuShortcut>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => { setSortField("name"); setSortOrder("asc"); }}
                        aria-checked={sortField === "name" && sortOrder === "asc"}
                        role="menuitemradio"
                    >
                        Name: A-Z
                        {sortField === "name" && sortOrder === "asc" && (
                            <DropdownMenuShortcut>
                                <span className="text-xs text-muted-foreground">✓</span>
                            </DropdownMenuShortcut>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}