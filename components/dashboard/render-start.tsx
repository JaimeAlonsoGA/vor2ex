import { Star, StarHalf } from "lucide-react";

export function renderStars(rating?: number) {
    if (!rating) rating = 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
                if (i < fullStars) {
                    return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
                }
                if (i === fullStars && hasHalfStar) {
                    return <StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
                }
                return <Star key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />;
            })}
            <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
        </div>
    );
}
