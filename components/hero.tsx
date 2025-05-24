"use client";

import Link from "next/link";

const Hero = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold">Bienvenido a Vor2ex</h1>
            <p className="mt-4 text-lg">Tu plataforma de intercambio de información.</p>
            <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded">
                <Link href="/sign-in">
                    Comenzar
                </Link>
            </button>
        </div>
    );
}
export default Hero;