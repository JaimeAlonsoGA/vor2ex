import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { SubmitButton } from "@/components/submit-button"
import { FormMessage, Message } from "@/components/form-message";
import { signInAction } from "@/lib/actions/auth-actions"

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative">
      {/* Login Card */}
      <div className="w-full max-w-sm bg-card rounded-xl shadow-xl p-8 flex flex-col justify-center items-center"
        style={{ maxHeight: "90vh" }}>
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold">V2</span>
          </div>
          <span className="text-2xl font-bold">Vor2ex</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {/* Google Sign In */}
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

        {/* Login Form */}
        <form action={signInAction}
          className="space-y-4 w-full mb-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              className="h-12"
              required autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="h-12 pr-12"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me
              </Label>
            </div>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>

          <FormMessage message={searchParams} />

          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in
          </SubmitButton>
        </form>

        <div className="text-center">
          <span className="text-muted-foreground">New to V2? </span>
          <Link href="/sign-up" className="text-primary hover:underline font-medium">
            Register
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
  )
}