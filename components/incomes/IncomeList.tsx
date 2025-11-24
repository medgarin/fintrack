'use client'

import { deleteIncome } from '@/app/(dashboard)/incomes/actions'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, FileX, Repeat } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Income {
    id: string
    amount: number
    description: string
    date: string
    income_branches: {
        name: string
    } | null
    is_recurring: boolean
}

export function IncomeList({ incomes }: { incomes: Income[] }) {
    if (incomes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/20">
                <FileX className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay ingresos registrados</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                    Comienza agregando tu primer ingreso usando el formulario de la izquierda.
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
                        <TableHead className="font-semibold">Rama</TableHead>
                        <TableHead className="font-semibold text-right">Monto</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {incomes.map((income) => (
                        <TableRow
                            key={income.id}
                            className="transition-colors hover:bg-muted/50 group"
                        >
                            <TableCell className="font-medium">
                                {new Date(income.date).toLocaleDateString('es-MX', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{income.description}</span>
                                    {income.is_recurring && (
                                        <Badge variant="secondary" className="text-[10px] h-5 gap-1 px-1.5">
                                            <Repeat className="h-3 w-3" />
                                            Recurrente
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                {income.income_branches ? (
                                    <Badge
                                        variant="outline"
                                        className="font-medium bg-success/10 text-success border-success/20"
                                    >
                                        {income.income_branches.name}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline">Sin categoría</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <span className="font-bold text-success">
                                    ${income.amount.toLocaleString()}
                                </span>
                            </TableCell>
                            <TableCell>
                                <form action={deleteIncome.bind(null, income.id) as any}>
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
