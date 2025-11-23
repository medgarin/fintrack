'use client'

import { deleteIncome } from '@/app/(dashboard)/incomes/actions'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2 } from 'lucide-react'

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
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {incomes.map((income) => (
                        <TableRow key={income.id}>
                            <TableCell>{new Date(income.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                                {income.description}
                                {income.is_recurring && (
                                    <span className="ml-2 text-xs text-muted-foreground">(Recurring)</span>
                                )}
                            </TableCell>
                            <TableCell>{income.income_branches?.name || 'Uncategorized'}</TableCell>
                            <TableCell>${income.amount}</TableCell>
                            <TableCell>
                                <form action={deleteIncome.bind(null, income.id)}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </TableCell>
                        </TableRow>
                    ))}
                    {incomes.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                No income records found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
