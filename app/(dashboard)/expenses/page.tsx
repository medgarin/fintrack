import { getCategories, getExpenses } from './actions'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { ExpenseList } from '@/components/expenses/ExpenseList'

export default async function ExpensesPage() {
    const [categories, expenses] = await Promise.all([
        getCategories(),
        getExpenses(),
    ])

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Expense Management</h1>
            <div className="grid gap-6 md:grid-cols-[350px_1fr]">
                <div>
                    <ExpenseForm categories={categories || []} />
                </div>
                <div>
                    <ExpenseList expenses={expenses || []} />
                </div>
            </div>
        </div>
    )
}
