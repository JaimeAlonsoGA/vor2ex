import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
    value: number;
    maximum?: boolean;
    max?: number;
    onChange?: (value: number) => void;
    "aria-label"?: string;
}

export function StarRating({
    value,
    maximum,
    max = 5,
    onChange,
    "aria-label": ariaLabel = "Seleccionar rating",
}: StarRatingProps) {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div
            className="flex items-center"
            aria-label={ariaLabel}
            role="radiogroup"
        >
            {Array.from({ length: max }).map((_, i) => {
                const starValue = i + 1;
                // Lógica para mínimo/máximo rating
                const isActive = (() => {
                    if (hovered !== null) {
                        return maximum ? starValue >= hovered : starValue <= hovered;
                    }
                    return maximum ? starValue >= value : starValue <= value;
                })();

                // Evita rerender visual en hover si la estrella ya está activa por el valor actual
                const shouldHighlight =
                    hovered !== null
                        ? maximum
                            ? starValue >= hovered && starValue < value
                            : starValue <= hovered && starValue > value
                        : false;

                return (
                    <button
                        key={starValue}
                        type="button"
                        aria-label={
                            maximum
                                ? `${starValue} estrellas o menos`
                                : `${starValue} estrellas o más`
                        }
                        className="focus:outline-none px-1 cursor-pointer"
                        onClick={() => onChange?.(starValue)}
                        tabIndex={0}
                        role="radio"
                        aria-checked={value === starValue}
                        onMouseEnter={() => setHovered(starValue)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <Star
                            className={`h-5 w-5 transition-colors
                                ${isActive
                                    ? "fill-yellow-400 text-yellow-400"
                                    : shouldHighlight
                                        ? "fill-yellow-300 text-yellow-300"
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