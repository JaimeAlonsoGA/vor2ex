import { defaultUserStrategy } from "@/lib/strategies";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  const supabase = await createClient();

  if (code) {
    // Intercambia el código por la sesión
    const { data: user, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('Error exchanging code for session:', sessionError);
      return NextResponse.redirect(`${origin}/error`);
    }

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        { auth_id: user.user.id, name: user.user.email }
      ])
      .select()
      .single();
    if (insertError) {
      console.error('Error inserting user data:', insertError);
      return NextResponse.redirect(`${origin}/error`);
    } else {
      console.log('User data inserted successfully:', user.user.id);
      const { error: strategiesError } = await supabase
        .from('strategies')
        .insert({ user_id: newUser.id, ...defaultUserStrategy });

      if (strategiesError) {
        console.error('Error inserting strategies:', strategiesError);
        return NextResponse.redirect(`${origin}/error`);
      } else {
        console.log('Strategies inserted successfully:', user.user.id);
      }
    }
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/dashboard`);
}