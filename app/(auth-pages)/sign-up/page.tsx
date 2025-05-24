import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage, Message } from "@/components/form-message";
import { signUpAction } from "@/services/auth.service";

export default async function Signup(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative">
      <div className="w-full max-w-sm bg-card rounded-xl shadow-xl p-8 flex flex-col justify-center items-center"
        style={{ maxHeight: "90vh" }}>
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold">V2</span>
          </div>
          <span className="text-2xl font-bold">Vor2ex</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground">Start finding your next Amazon FBA niche</p>
        </div>

        {/* Google Sign Up */}
        <Button variant="outline" className="w-full h-12 text-base mb-4" type="button" disabled>
          <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </Button>

        <div className="relative w-full mb-4">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {/* Signup Form */}
        <form action={signUpAction} className="space-y-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              className="h-12"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              className="h-12"
              minLength={6}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="accept" name="accept" required />
            <Label htmlFor="accept" className="text-sm">
              I accept the{" "}
              <Link href="/privacy" className="underline text-primary" tabIndex={-1}>
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="underline text-primary" tabIndex={-1}>
                Terms of Service
              </Link>
            </Label>
          </div>
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </form>

        <div className="text-center mt-4">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/sign-in" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>

        {/* Privacy Notice */}
        <p className="text-xs text-center text-muted-foreground mt-4">
          This site is protected by reCAPTCHA and the Google{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          apply.
        </p>
      </div>
    </div>
  );
}