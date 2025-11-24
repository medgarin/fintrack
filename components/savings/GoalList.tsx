'use client'

import { deleteGoal, addFundsToGoal } from '@/app/(dashboard)/savings/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Trash2, Plus, Trophy, Target } from 'lucide-react'
import { useActionState, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { CustomCurrencyInput } from '@/components/ui/currency-input'

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
    const [state, formAction, isPending] = useActionState(addFundsToGoal as any, initialState)
    const [amount, setAmount] = useState('')

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="w-full border-accent/20 hover:bg-accent/10 hover:text-accent">
                    <Plus className="mr-2 h-4 w-4" /> Agregar Fondos
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/80">
                            <Plus className="h-4 w-4 text-white" />
                        </div>
                        Agregar Fondos a {goal.name}
                    </DialogTitle>
                </DialogHeader>
                <form action={async (formData) => {
                    await (formAction as any)(formData)
                    setOpen(false)
                    setAmount('')
                }} className="grid gap-4 py-4">
                    <input type="hidden" name="goalId" value={goal.id} />
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Monto</Label>
                        <CustomCurrencyInput
                            id="amount-display"
                            name="amount-display"
                            placeholder="0.00"
                            required
                            disabled={isPending}
                            onValueChange={(value) => setAmount(value || '')}
                            className="transition-all focus:ring-2 focus:ring-accent/20"
                        />
                        <input type="hidden" name="amount" value={amount} />
                    </div>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-gradient-to-r from-accent to-accent/80 hover:opacity-90"
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <Spinner className="h-4 w-4" />
                                Agregando...
                            </span>
                        ) : (
                            'Agregar Fondos'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function GoalList({ goals }: { goals: Goal[] }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
                const progress = Math.min((goal.current_amount / goal.goal_amount) * 100, 100)
                const isCompleted = progress >= 100

                return (
                    <Card key={goal.id} className="card-hover overflow-hidden relative group">
                        {isCompleted && (
                            <div className="absolute top-0 right-0 p-2 z-10">
                                <Trophy className="h-6 w-6 text-yellow-500 animate-bounce" />
                            </div>
                        )}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-2xl transition-all group-hover:from-accent/20" />

                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <div className="p-1.5 rounded-md bg-accent/10 text-accent">
                                    <Target className="h-4 w-4" />
                                </div>
                                {goal.name}
                            </CardTitle>
                            <form action={deleteGoal.bind(null, goal.id) as any}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="flex items-baseline justify-between mb-2">
                                <div className="text-2xl font-bold">
                                    ${goal.current_amount.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    de ${goal.goal_amount.toLocaleString()}
                                </div>
                            </div>

                            <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
                                <div
                                    className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium">
                                <span>0%</span>
                                <span className="text-accent">{progress.toFixed(1)}%</span>
                                <span>100%</span>
                            </div>
                        </CardContent>
                        <CardFooter className="relative pt-0">
                            <AddFundsDialog goal={goal} />
                        </CardFooter>
                    </Card>
                )
            })}
            {goals.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/20">
                    <Target className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay metas de ahorro</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                        Crea tu primera meta de ahorro usando el formulario de arriba para comenzar a rastrear tu progreso.
                    </p>
                </div>
            )}
        </div>
    )
}
