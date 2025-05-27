import { Note } from "@/components/note";
import Image from "next/image";
import { Suspense } from "react";

export default async function ProtectedPage() {

    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <Note note="Discover profitable products, create custom strategies, and analyze opportunities at scale." to="/help" toMessage="Learn more" />
            <div className="relative flex flex-col items-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-white font-bold text-3xl">V2</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-center tracking-tight mb-24">
                    Discover <span className="text-blue-600 dark:text-blue-400">rentable niches</span> on
                </h1>
                <Image src="/assets/amazon-logo.png" alt="Amazon Logo" width={200} height={200} className="mx-auto absolute bottom-0 z-10" />
                <div className="absolute bottom-0 bg-gradient-to-tl from-blue-600/40 to-purple-600 h-20 w-64 rounded-2xl" />
            </div>
        </Suspense>
    );
}