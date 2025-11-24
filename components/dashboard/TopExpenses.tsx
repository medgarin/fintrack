'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDownRight, TrendingUp } from 'lucide-react'

interface Expense {
    id: string
    description: string
    amount: number
    date: string
    categories: {
        name: string
        color: string
    } | null
}

export function TopExpenses({ expenses }: { expenses: Expense[] }) {
    return (
        <Card className="card-hover col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                        <TrendingUp className="h-4 w-4" />
                    </div>
                    Mayores Gastos del Mes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {expenses.map((expense) => (
                        <div
                            key={expense.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-background border shadow-sm group-hover:scale-110 transition-transform"
                                    style={{ borderColor: expense.categories?.color || 'hsl(var(--muted))' }}
                                >
                                    <ArrowDownRight className="h-5 w-5 text-destructive" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {expense.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(expense.date).toLocaleDateString('es-MX', {
                                            day: 'numeric',
                                            month: 'short'
                                        })}
                                        {' • '}
                                        <span style={{ color: expense.categories?.color }}>
                                            {expense.categories?.name || 'Sin categoría'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="font-bold text-destructive">
                                -${expense.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    ))}
                    {expenses.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No hay gastos registrados este mes.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
