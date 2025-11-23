'use client'

import { useActionState } from 'react'
import { signup } from '../login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const initialState = {
    error: '',
}

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(signup, initialState)

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <form action={formAction}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        {state?.error && (
                            <p className="text-sm text-red-500">{state.error}</p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Signing up...' : 'Sign up'}
                        </Button>
                        <div className="text-sm text-center text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login" className="underline">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
