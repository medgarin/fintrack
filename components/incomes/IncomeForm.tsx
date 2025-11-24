'use client'

import { useActionState, useEffect, useState } from 'react'
import { createIncome } from '@/app/(dashboard)/incomes/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { Wallet, Plus } from 'lucide-react'
import { CustomCurrencyInput } from '@/components/ui/currency-input'

interface Branch {
    id: string
    name: string
}

const initialState: { message: string; error?: string } | { error: string; message?: string } = {
    message: '',
}

export function IncomeForm({ branches }: { branches: Branch[] }) {
    const [state, formAction, isPending] = useActionState(createIncome as any, initialState)
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
            <CardHeader className="bg-gradient-to-r from-success/10 to-success/5 border-b">
                <CardTitle className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-success to-success/80">
                        <Wallet className="h-4 w-4 text-white" />
                    </div>
                    Registrar Ingreso
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form action={formAction} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount" className="text-sm font-medium">
                            Monto
                        </Label>
                        <CustomCurrencyInput
                            id="amount-display"
                            name="amount-display"
                            placeholder="0.00"
                            required
                            disabled={isPending}
                            onValueChange={(value) => setAmount(value || '')}
                            className="transition-all focus:ring-2 focus:ring-success/20"
                        />
                        <input type="hidden" name="amount" value={amount} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Descripción
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            type="text"
                            required
                            disabled={isPending}
                            className="h-11 transition-all focus:ring-2 focus:ring-success/20"
                            placeholder="Ej: Salario mensual"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date" className="text-sm font-medium">
                            Fecha
                        </Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            required
                            disabled={isPending}
                            className="h-11 transition-all focus:ring-2 focus:ring-success/20"
                            defaultValue={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="branchId" className="text-sm font-medium">
                            Rama
                        </Label>
                        <Select name="branchId" required disabled={isPending}>
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Seleccionar rama" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((branch) => (
                                    <SelectItem key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2 py-2">
                        <Checkbox
                            id="isRecurring"
                            name="isRecurring"
                            disabled={isPending}
                        />
                        <Label
                            htmlFor="isRecurring"
                            className="text-sm font-medium cursor-pointer select-none"
                        >
                            Ingreso Recurrente
                        </Label>
                    </div>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-11 mt-2 bg-gradient-to-r from-success to-success/80 hover:opacity-90 transition-opacity shadow-md"
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <Spinner className="h-4 w-4" />
                                Agregando...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Agregar Ingreso
                            </span>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
