"use server"

import { cookies } from "next/headers";

export async function createCookieAction(name: string, data: any, options?: any) {
    (await cookies()).set(name, data, options);
}