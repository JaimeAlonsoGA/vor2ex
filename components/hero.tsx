"use client";

import Link from "next/link";
import { Button } from "./ui/button";

const Hero = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold">Bienvenido a Vor2ex</h1>
            <p className="mt-4 text-lg">Tu plataforma de intercambio de información.</p>
            <Button>
                <Link href="/sign-in">
                    Comenzar
                </Link>
            </Button>
        </div>
    );
}
export default Hero;