'use server'

import { createClient } from '@/utils/supabase/server'

import { getProjections } from './advanced-actions'

export async function getDashboardData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch current month's data
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

    // Fetch incomes
    const { data: incomes } = await supabase
        .from('incomes')
        .select('amount, date, branch_id, income_branches(name)')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

    // Fetch expenses
    const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, date, category_id, categories(name, color)')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

    // Fetch saving goals
    const { data: goals } = await supabase
        .from('saving_goals')
        .select('*')
        .order('created_at', { ascending: false })

    // Calculate totals
    const totalIncome = incomes?.reduce((sum, item) => sum + item.amount, 0) || 0
    const totalExpenses = expenses?.reduce((sum, item) => sum + item.amount, 0) || 0
    const totalSavings = goals?.reduce((sum, item) => sum + (item.current_amount || 0), 0) || 0

    // Balance = Income - Expenses - Savings
    const balance = totalIncome - totalExpenses - totalSavings

    const savingsRate = totalIncome > 0 ? ((totalSavings) / totalIncome) * 100 : 0

    // Prepare chart data (Income vs Expenses by day/week - simplified to just totals for now or last 6 months if needed)
    // For MVP, let's just show current month distribution or last few months if we fetch more data.
    // Let's fetch last 6 months for the bar chart.

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()

    const { data: monthlyIncomes } = await supabase
        .from('incomes')
        .select('amount, date')
        .gte('date', sixMonthsAgo)

    const { data: monthlyExpenses } = await supabase
        .from('expenses')
        .select('amount, date')
        .gte('date', sixMonthsAgo)

    // Group by month
    const monthlyDataMap = new Map()

    monthlyIncomes?.forEach(item => {
        const month = new Date(item.date).toLocaleString('default', { month: 'short' })
        if (!monthlyDataMap.has(month)) monthlyDataMap.set(month, { name: month, income: 0, expenses: 0 })
        monthlyDataMap.get(month).income += item.amount
    })

    monthlyExpenses?.forEach(item => {
        const month = new Date(item.date).toLocaleString('default', { month: 'short' })
        if (!monthlyDataMap.has(month)) monthlyDataMap.set(month, { name: month, income: 0, expenses: 0 })
        monthlyDataMap.get(month).expenses += item.amount
    })

    const incomeVsExpensesData = Array.from(monthlyDataMap.values())

    // Category distribution
    const categoryMap = new Map()
    expenses?.forEach((item: any) => {
        const name = item.categories?.name || 'Uncategorized'
        if (!categoryMap.has(name)) categoryMap.set(name, { name, value: 0 })
        categoryMap.get(name).value += item.amount
    })

    const categoryData = Array.from(categoryMap.values())

    // Fetch top expenses
    const { data: topExpenses } = await supabase
        .from('expenses')
        .select('id, description, amount, date, category_id, categories(name, color)')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)
        .order('amount', { ascending: false })
        .limit(5)

    // ... inside getDashboardData
    const projections = await getProjections()

    return {
        summary: {
            totalIncome,
            totalExpenses,
            totalSavings,
            balance,
            savingsRate,
        },
        charts: {
            incomeVsExpenses: incomeVsExpensesData,
            categoryDistribution: categoryData,
        },
        goals: goals || [],
        topExpenses: topExpenses || [],
        projections
    }
}
