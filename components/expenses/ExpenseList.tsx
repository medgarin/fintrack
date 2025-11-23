'use client'

import { deleteExpense } from '@/app/(dashboard)/expenses/actions'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2 } from 'lucide-react'
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
    console.log(expenses)
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell>
                                {expense.categories ? (
                                    <Badge style={{ backgroundColor: expense.categories.color }}>
                                        {expense.categories.name}
                                    </Badge>
                                ) : (
                                    'Uncategorized'
                                )}
                            </TableCell>
                            <TableCell className="capitalize">{expense.payment_method?.replace('_', ' ')}</TableCell>
                            <TableCell>${expense.amount}</TableCell>
                            <TableCell>
                                <form action={deleteExpense.bind(null, expense.id)}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </TableCell>
                        </TableRow>
                    ))}
                    {expenses.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                No expense records found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
