'use client'

import { useActionState, useEffect } from 'react'
import { createExpense } from '@/app/(dashboard)/expenses/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface Category {
    id: string
    name: string
    color: string
}

const initialState = {
    message: '',
    error: '',
}

export function ExpenseForm({ categories }: { categories: Category[] }) {
    const [state, formAction, isPending] = useActionState(createExpense, initialState)

    useEffect(() => {
        if (state?.message) {
            toast.success(state.message)
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Expense</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" name="amount" type="number" step="0.01" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" type="text" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="categoryId">Category</Label>
                        <Select name="categoryId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select name="paymentMethod">
                            <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="credit_card">Credit Card</SelectItem>
                                <SelectItem value="debit_card">Debit Card</SelectItem>
                                <SelectItem value="transfer">Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Adding...' : 'Add Expense'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
