'use client'

import { deleteExpense } from '@/app/(dashboard)/expenses/actions'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, FileX } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Expense {
    id: string
    amount: number
    description: string
    date: string
    categories: {
        name: string
        color: string
    } | null
    payment_method: string
}

export function ExpenseList({ expenses }: { expenses: Expense[] }) {
    if (expenses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/20">
                <FileX className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay gastos registrados</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                    Comienza agregando tu primer gasto usando el formulario de la izquierda.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-lg border shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Fecha</TableHead>
                        <TableHead className="font-semibold">Descripción</TableHead>
                        <TableHead className="font-semibold">Categoría</TableHead>
                        <TableHead className="font-semibold">Método</TableHead>
                        <TableHead className="font-semibold text-right">Monto</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow
                            key={expense.id}
                            className="transition-colors hover:bg-muted/50 group"
                        >
                            <TableCell className="font-medium">
                                {new Date(expense.date).toLocaleDateString('es-MX', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </TableCell>
                            <TableCell>
                                <span className="font-medium">{expense.description}</span>
                            </TableCell>
                            <TableCell>
                                {expense.categories ? (
                                    <Badge
                                        className="font-medium"
                                        style={{
                                            backgroundColor: expense.categories.color,
                                            color: 'white'
                                        }}
                                    >
                                        {expense.categories.name}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">Sin categoría</Badge>
                                )}
                            </TableCell>
                            <TableCell className="capitalize text-muted-foreground">
                                {expense.payment_method?.replace('_', ' ')}
                            </TableCell>
                            <TableCell className="text-right">
                                <span className="font-bold text-destructive">
                                    ${expense.amount.toLocaleString()}
                                </span>
                            </TableCell>
                            <TableCell>
                                <form action={deleteExpense.bind(null, expense.id) as any}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
