import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { BudgetPlanner } from '@/components/budget/BudgetPlanner'
import { getBudgets } from '@/app/(dashboard)/budget-actions'

export default async function BudgetPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const date = new Date()
    const currentMonth = date.getMonth() + 1
    const currentYear = date.getFullYear()
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1).toISOString()
    const endOfMonth = new Date(currentYear, currentMonth, 0).toISOString()

    // Fetch categories
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, color')
        .eq('user_id', user.id)
        .order('name')

    // Fetch current spending
    const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, category_id')
        .eq('user_id', user.id)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

    const currentSpending: Record<string, number> = {}
    expenses?.forEach((e: any) => {
        if (e.category_id) {
            currentSpending[e.category_id] = (currentSpending[e.category_id] || 0) + Number(e.amount)
        }
    })

    // Fetch existing budgets
    const budgets = await getBudgets(currentMonth, currentYear)

    return (
        <div className="container mx-auto max-w-6xl">
            <BudgetPlanner
                categories={categories || []}
                initialBudgets={budgets as any[]}
                currentSpending={currentSpending}
            />
        </div>
    )
}
