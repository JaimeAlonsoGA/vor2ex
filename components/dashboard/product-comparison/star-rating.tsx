import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
    value: number;
    max?: number;
    onChange?: (value: number) => void;
    "aria-label"?: string;
}

export function StarRating({
    value,
    max = 5,
    onChange,
    "aria-label": ariaLabel = "Seleccionar rating mínimo",
}: StarRatingProps) {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div
            className="flex items-center gap-1"
            aria-label={ariaLabel}
            role="radiogroup"
        >
            {Array.from({ length: max }).map((_, i) => {
                const starValue = i + 1;
                const isActive = hovered !== null ? starValue <= hovered : starValue <= value;
                return (
                    <button
                        key={starValue}
                        type="button"
                        aria-label={`${starValue} estrellas o más`}
                        className="focus:outline-none"
                        onClick={() => onChange?.(starValue)}
                        tabIndex={0}
                        role="radio"
                        aria-checked={value === starValue}
                        onMouseEnter={() => setHovered(starValue)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <Star
                            className={`h-5 w-5 transition-colors ${isActive
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                        />
                    </button>
                );
            })}
            <span className="sr-only">{value} estrellas</span>
        </div>
    );
}