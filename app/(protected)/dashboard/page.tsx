import { Suspense } from "react";

export default async function ProtectedPage() {

    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            Dashboard
        </Suspense>
    );
}