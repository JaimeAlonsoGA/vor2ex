import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

const baseClassName = "p-4 shadow-none border rounded flex flex-col bg-card text-card-foreground";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const Card = ({ children, ...props }: CardProps) => {
    const { className, ...rest } = props;
    return (
        <div className={cn(baseClassName, className)} {...rest}>
            {children}
        </div>
    );
};