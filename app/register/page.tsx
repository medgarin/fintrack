'use client'

import { useActionState, useState } from 'react'
import { signup } from '../login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AuthLayout } from '@/components/layout/auth-layout'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { AlertCircle, CheckCircle2, Circle } from 'lucide-react'

const initialState = {
    error: '',
}

function PasswordStrengthIndicator({ password }: { password: string }) {
    const getStrength = (pwd: string) => {
        let strength = 0
        if (pwd.length >= 8) strength++
        if (pwd.length >= 12) strength++
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
        if (/\d/.test(pwd)) strength++
        if (/[^a-zA-Z\d]/.test(pwd)) strength++
        return strength
    }

    const strength = getStrength(password)
    const percentage = (strength / 5) * 100

    const getColor = () => {
        if (strength <= 2) return 'bg-destructive'
        if (strength <= 3) return 'bg-warning'
        return 'bg-success'
    }

    const getLabel = () => {
        if (strength <= 2) return 'Débil'
        if (strength <= 3) return 'Media'
        return 'Fuerte'
    }

    if (!password) return null

    return (
        <div className="space-y-1">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${getColor()}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="text-xs text-muted-foreground">
                Seguridad: <span className="font-medium">{getLabel()}</span>
            </p>
        </div>
    )
}

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(signup, initialState)
    const [password, setPassword] = useState('')
    const [acceptedTerms, setAcceptedTerms] = useState(false)

    return (
        <AuthLayout
            title="Crear cuenta"
            subtitle="Comienza a gestionar tus finanzas hoy"
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
                    <Label htmlFor="password" className="text-sm font-medium">
                        Contraseña
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        disabled={isPending}
                        className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <PasswordStrengthIndicator password={password} />
                </div>

                {/* Password requirements */}
                <div className="space-y-2 text-xs text-muted-foreground">
                    <p className="font-medium">La contraseña debe contener:</p>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            {password.length >= 8 ? (
                                <CheckCircle2 className="h-3 w-3 text-success" />
                            ) : (
                                <Circle className="h-3 w-3" />
                            )}
                            <span>Al menos 8 caracteres</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/[a-z]/.test(password) && /[A-Z]/.test(password) ? (
                                <CheckCircle2 className="h-3 w-3 text-success" />
                            ) : (
                                <Circle className="h-3 w-3" />
                            )}
                            <span>Mayúsculas y minúsculas</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/\d/.test(password) ? (
                                <CheckCircle2 className="h-3 w-3 text-success" />
                            ) : (
                                <Circle className="h-3 w-3" />
                            )}
                            <span>Al menos un número</span>
                        </div>
                    </div>
                </div>

                {/* Terms and conditions */}
                <div className="flex items-start space-x-2">
                    <Checkbox
                        id="terms"
                        name="terms"
                        disabled={isPending}
                        checked={acceptedTerms}
                        onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                        required
                    />
                    <Label
                        htmlFor="terms"
                        className="text-sm font-normal cursor-pointer select-none leading-tight"
                    >
                        Acepto los{' '}
                        <Link href="#" className="text-primary hover:underline">
                            términos y condiciones
                        </Link>{' '}
                        y la{' '}
                        <Link href="#" className="text-primary hover:underline">
                            política de privacidad
                        </Link>
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
                    disabled={isPending || !acceptedTerms}
                >
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <Spinner className="h-4 w-4" />
                            Creando cuenta...
                        </span>
                    ) : (
                        'Crear cuenta'
                    )}
                </Button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            ¿Ya tienes cuenta?
                        </span>
                    </div>
                </div>

                {/* Login link */}
                <Button
                    variant="outline"
                    className="w-full h-11 border-border/50 hover:bg-accent/10 transition-colors"
                    asChild
                    disabled={isPending}
                >
                    <Link href="/login">Iniciar sesión</Link>
                </Button>
            </form>
        </AuthLayout>
    )
}
