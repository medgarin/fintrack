'use client'

import { useActionState, useEffect, useState } from 'react'
import { createSavingGoal } from '@/app/(dashboard)/savings/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { Target } from 'lucide-react'
import { CustomCurrencyInput } from '@/components/ui/currency-input'

const initialState: { message: string; error?: string } | { error: string; message?: string } = {
    message: '',
}

export function GoalForm() {
    const [state, formAction, isPending] = useActionState(createSavingGoal as any, initialState)
    const [amount, setAmount] = useState('')

    useEffect(() => {
        if (state?.message) {
            toast.success(state.message)
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <Card className="card-hover">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5 border-b">
                <CardTitle className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/80">
                        <Target className="h-4 w-4 text-white" />
                    </div>
                    Nueva Meta de Ahorro
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form action={formAction} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Nombre de la Meta
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Ej: Fondo de Emergencia"
                            required
                            disabled={isPending}
                            className="h-11 transition-all focus:ring-2 focus:ring-accent/20"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="target_amount" className="text-sm font-medium">
                            Monto Objetivo
                        </Label>
                        <CustomCurrencyInput
                            id="target_amount-display"
                            name="target_amount-display"
                            placeholder="0.00"
                            required
                            disabled={isPending}
                            onValueChange={(value) => setAmount(value || '')}
                            className="transition-all focus:ring-2 focus:ring-accent/20"
                        />
                        <input type="hidden" name="target_amount" value={amount} />
                    </div>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-11 mt-2 bg-gradient-to-r from-accent to-accent/80 hover:opacity-90 transition-opacity shadow-md"
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <Spinner className="h-4 w-4" />
                                Creando...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Crear Meta
                            </span>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
