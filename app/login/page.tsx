'use client'

import { useActionState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

const initialState = {
    error: '',
}

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState)

    return (
        <AuthLayout
            title="Bienvenido"
            subtitle="Ingresa a tu cuenta para continuar"
        >
            <form action={formAction} className="space-y-6">
                {/* Email field */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                        Correo electrónico
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        disabled={isPending}
                        className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                        autoComplete="email"
                    />
                </div>

                {/* Password field */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Contraseña
                        </Label>
                        <Link
                            href="#"
                            className="text-xs text-primary hover:text-primary/80 transition-colors"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        disabled={isPending}
                        className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                        autoComplete="current-password"
                    />
                </div>

                {/* Remember me */}
                <div className="flex items-center space-x-2">
                    <Checkbox id="remember" name="remember" disabled={isPending} />
                    <Label
                        htmlFor="remember"
                        className="text-sm font-normal cursor-pointer select-none"
                    >
                        Recordarme
                    </Label>
                </div>

                {/* Error message */}
                {state?.error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-fade-in">
                        <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                        <p className="text-sm text-destructive">{state.error}</p>
                    </div>
                )}

                {/* Submit button */}
                <Button
                    type="submit"
                    className="w-full h-11 text-base font-medium bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg"
                    disabled={isPending}
                >
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <Spinner className="h-4 w-4" />
                            Iniciando sesión...
                        </span>
                    ) : (
                        'Iniciar sesión'
                    )}
                </Button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            ¿No tienes cuenta?
                        </span>
                    </div>
                </div>

                {/* Register link */}
                <Button
                    variant="outline"
                    className="w-full h-11 border-border/50 hover:bg-accent/10 transition-colors"
                    asChild
                    disabled={isPending}
                >
                    <Link href="/register">Crear una cuenta</Link>
                </Button>
            </form>
        </AuthLayout>
    )
}
