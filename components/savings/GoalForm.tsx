'use client'

import { useActionState, useEffect } from 'react'
import { createSavingGoal } from '@/app/(dashboard)/savings/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const initialState = {
    message: '',
    error: '',
}

export function GoalForm() {
    const [state, formAction, isPending] = useActionState(createSavingGoal, initialState)

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
                <CardTitle>Create Saving Goal</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Goal Name</Label>
                        <Input id="name" name="name" type="text" placeholder="e.g. Emergency Fund" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="goalAmount">Target Amount</Label>
                        <Input id="goalAmount" name="goalAmount" type="number" step="0.01" required />
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Creating...' : 'Create Goal'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
