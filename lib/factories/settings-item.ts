import { Tables } from "@/types/supabase";
import { User } from "@/types/user";
import { User as Auth } from "@supabase/supabase-js";

// export function UserFactory(userProfile: Tables<'users'>, auth: Auth): User {
//     return {
//         id: userProfile.id,
//         email: auth.email!,
//         name: userProfile.name || auth.email || "",
//         marketplace: userProfile.marketplace,
//         pro: userProfile.pro,
//         language: userProfile.language,
//     };
// }