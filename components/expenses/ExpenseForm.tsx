'use client'

import { useActionState, useEffect, useState } from 'react'
import { createExpense } from '@/app/(dashboard)/expenses/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { CreditCard, Plus } from 'lucide-react'
import { CustomCurrencyInput } from '@/components/ui/currency-input'

interface Category {
    id: string
    name: string
    color: string
}

const initialState: { message: string; error?: string } | { error: string; message?: string } = {
    message: '',
}

export function ExpenseForm({ categories }: { categories: Category[] }) {
    const [state, formAction, isPending] = useActionState(createExpense as any, initialState)
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
            <CardHeader className="bg-gradient-to-r from-destructive/10 to-destructive/5 border-b">
                <CardTitle className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-destructive to-destructive/80">
                        <CreditCard className="h-4 w-4 text-white" />
                    </div>
                    Registrar Gasto
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
                            className="transition-all focus:ring-2 focus:ring-destructive/20"
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
                            className="h-11 transition-all focus:ring-2 focus:ring-destructive/20"
                            placeholder="Ej: Compra de supermercado"
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
                            className="h-11 transition-all focus:ring-2 focus:ring-destructive/20"
                            defaultValue={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="categoryId" className="text-sm font-medium">
                            Categoría
                        </Label>
                        <Select name="categoryId" required disabled={isPending}>
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: category.color }}
                                            />
                                            {category.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="paymentMethod" className="text-sm font-medium">
                            Método de Pago
                        </Label>
                        <Select name="paymentMethod" disabled={isPending}>
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Seleccionar método" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Efectivo</SelectItem>
                                <SelectItem value="credit_card">Tarjeta de Crédito</SelectItem>
                                <SelectItem value="debit_card">Tarjeta de Débito</SelectItem>
                                <SelectItem value="transfer">Transferencia</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-11 mt-2 bg-gradient-to-r from-destructive to-destructive/80 hover:opacity-90 transition-opacity shadow-md"
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <Spinner className="h-4 w-4" />
                                Agregando...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Agregar Gasto
                            </span>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
