'use client'

import { deleteGoal, addFundsToGoal } from '@/app/(dashboard)/savings/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Trash2, Plus } from 'lucide-react'
import { useActionState, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface Goal {
    id: string
    name: string
    goal_amount: number
    current_amount: number
}

const initialState = {
    message: '',
    error: '',
}

function AddFundsDialog({ goal }: { goal: Goal }) {
    const [open, setOpen] = useState(false)
    const [state, formAction, isPending] = useActionState(addFundsToGoal, initialState)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Add Funds
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Funds to {goal.name}</DialogTitle>
                </DialogHeader>
                <form action={async (formData) => {
                    await formAction(formData)
                    setOpen(false)
                }} className="grid gap-4 py-4">
                    <input type="hidden" name="goalId" value={goal.id} />
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" name="amount" type="number" step="0.01" required />
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Adding...' : 'Add Funds'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function GoalList({ goals }: { goals: Goal[] }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
                const progress = Math.min((goal.current_amount / goal.goal_amount) * 100, 100)
                return (
                    <Card key={goal.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{goal.name}</CardTitle>
                            <form action={deleteGoal.bind(null, goal.id)}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${goal.current_amount.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                of ${goal.goal_amount.toLocaleString()} goal
                            </p>
                            <Progress value={progress} className="mt-4" />
                            <p className="mt-2 text-xs text-muted-foreground text-right">{progress.toFixed(1)}%</p>
                        </CardContent>
                        <CardFooter>
                            <AddFundsDialog goal={goal} />
                        </CardFooter>
                    </Card>
                )
            })}
            {goals.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground">
                    No saving goals created yet.
                </div>
            )}
        </div>
    )
}
