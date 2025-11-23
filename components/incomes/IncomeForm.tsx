'use client'

import { useActionState, useEffect } from 'react'
import { createIncome } from '@/app/(dashboard)/incomes/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface Branch {
    id: string
    name: string
}

const initialState = {
    message: '',
    error: '',
}

export function IncomeForm({ branches }: { branches: Branch[] }) {
    const [state, formAction, isPending] = useActionState(createIncome, initialState)

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
                <CardTitle>Add Income</CardTitle>
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
                        <Label htmlFor="branchId">Branch</Label>
                        <Select name="branchId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select branch" />
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
                    <div className="flex items-center space-x-2">
                        <Checkbox id="isRecurring" name="isRecurring" />
                        <Label htmlFor="isRecurring">Recurring Income</Label>
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Adding...' : 'Add Income'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
