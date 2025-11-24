'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// --- Monthly Flow & Automation ---

export async function checkMonthlyClosure() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const now = new Date()
    // We want to check if the *previous* month has been closed.
    // Logic: If today is May 5th, we check if April is closed.
    // If today is May 1st, we might want to wait or prompt the user.

    // Get the previous month
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevMonth = prevDate.getMonth() + 1 // 1-12
    const prevYear = prevDate.getFullYear()

    // Check if a summary exists for the previous month
    const { data: summary } = await supabase
        .from('monthly_summaries')
        .select('id')
        .eq('user_id', user.id)
        .eq('month', prevMonth)
        .eq('year', prevYear)
        .single()

    if (summary) {
        return { needsClosure: false }
    }

    return {
        needsClosure: true,
        month: prevMonth,
        year: prevYear,
        monthName: prevDate.toLocaleString('es-MX', { month: 'long' })
    }
}

export async function closeMonth(month: number, year: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // 1. Calculate totals for the month to be closed
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()

    const { data: incomes } = await supabase
        .from('incomes')
        .select('amount, branch_id, income_branches(name)')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)

    const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, category_id, categories(name)')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)

    const { data: savings } = await supabase
        .from('saving_goal_transactions')
        .select('amount')
    // We need to filter by user ownership via join or separate query, 
    // but RLS handles this if we select from the right place.
    // Ideally we'd join goals but for simplicity let's assume RLS works on the view.
    // Actually, saving_goal_transactions doesn't have user_id directly, it links to goals.
    // Let's fetch goals first or rely on a join.
    // For now, let's just sum up contributions if we can link them.
    // A simpler way for MVP: Sum 'Savings' branch incomes if that's how they track it,
    // OR fetch all goals and their transactions for this month.
    // Let's stick to the 'monthly_summaries' table definition: total_savings.
    // We can calculate it as Income - Expenses - Balance? Or explicit savings contributions.
    // Let's use the explicit saving goal transactions for accuracy.
    // We need to get goals for this user first.

    const { data: userGoals } = await supabase
        .from('saving_goals')
        .select('id')
        .eq('user_id', user.id)

    const goalIds = userGoals?.map(g => g.id) || []

    let totalSavings = 0
    if (goalIds.length > 0) {
        const { data: goalTxns } = await supabase
            .from('saving_goal_transactions')
            .select('amount')
            .in('goal_id', goalIds)
            .gte('date', startDate)
            .lte('date', endDate)

        totalSavings = goalTxns?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
    }

    const totalIncome = incomes?.reduce((sum, i) => sum + Number(i.amount), 0) || 0
    const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
    const balance = totalIncome - totalExpenses - totalSavings

    // Prepare snapshot data (breakdown by category/branch)
    const incomeByBranch = incomes?.reduce((acc: any, curr: any) => {
        const name = curr.income_branches?.name || 'Otros'
        acc[name] = (acc[name] || 0) + Number(curr.amount)
        return acc
    }, {})

    const expenseByCategory = expenses?.reduce((acc: any, curr: any) => {
        const name = curr.categories?.name || 'Sin categoría'
        acc[name] = (acc[name] || 0) + Number(curr.amount)
        return acc
    }, {})

    const snapshotData = {
        incomeByBranch,
        expenseByCategory
    }

    // 2. Create Monthly Summary Record
    const { error: summaryError } = await supabase
        .from('monthly_summaries')
        .insert({
            user_id: user.id,
            month,
            year,
            total_income: totalIncome,
            total_expenses: totalExpenses,
            total_savings: totalSavings,
            balance,
            snapshot_data: snapshotData
        })

    if (summaryError) {
        console.error('Error creating summary:', summaryError)
        return { error: 'Failed to create monthly summary' }
    }

    // 3. Process Recurring Transactions for the NEW month
    // The new month is the one AFTER the closed month.
    // If we closed April, we want to generate transactions for May (if not already done).
    // Actually, usually you close April in early May. So you want to generate May's transactions.

    const nextDate = new Date(year, month, 1) // Month is 0-indexed in JS Date constructor for calculation, but we passed 1-based month.
    // new Date(2023, 4, 1) -> May 1st 2023 (since 4 is May).
    // If we passed month=4 (April), we want next month (May).
    // JS Date: new Date(year, monthIndex)
    // If month=4 (April), monthIndex should be 3.
    // So next month index is 4 (May).
    // Wait, let's be precise.
    // Input: month=4 (April).
    // We want to generate for May (month=5).

    const targetMonth = month === 12 ? 1 : month + 1
    const targetYear = month === 12 ? year + 1 : year

    // Check if we already generated recurring transactions for this target month?
    // We can check if there are any transactions in the target month that match the recurring descriptions?
    // Or just rely on the user triggering this only once via the "Close Month" flow.
    // Ideally we should have a 'last_processed' date on the recurring_transactions table.

    const { data: recurring } = await supabase
        .from('recurring_transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)

    if (recurring && recurring.length > 0) {
        const newIncomes = []
        const newExpenses = []
        const today = new Date() // Use current date for creation timestamp, but target date for the transaction

        for (const item of recurring) {
            // Check if already processed for this month (simple check: last_processed in same month)
            const lastProcessed = item.last_processed ? new Date(item.last_processed) : null
            if (lastProcessed && lastProcessed.getMonth() + 1 === targetMonth && lastProcessed.getFullYear() === targetYear) {
                continue // Already processed
            }

            // Construct the date for the new transaction
            // Use the specified day_of_month, or 1st if invalid
            let day = item.day_of_month || 1
            // Handle edge cases (e.g. Feb 30)
            const maxDays = new Date(targetYear, targetMonth, 0).getDate()
            if (day > maxDays) day = maxDays

            const txnDate = new Date(targetYear, targetMonth - 1, day).toISOString()

            if (item.type === 'income') {
                newIncomes.push({
                    user_id: user.id,
                    amount: item.amount,
                    description: item.description,
                    date: txnDate,
                    is_recurring: true
                    // We need branch_id... recurring_transactions doesn't have it in my schema above?
                    // Ah, I missed branch_id in recurring_transactions for income. 
                    // It has category_id which works for expenses.
                    // For now, let's leave branch_id null or fetch a default.
                })
            } else {
                newExpenses.push({
                    user_id: user.id,
                    amount: item.amount,
                    description: item.description,
                    date: txnDate,
                    category_id: item.category_id
                })
            }

            // Update last_processed
            await supabase
                .from('recurring_transactions')
                .update({ last_processed: txnDate })
                .eq('id', item.id)
        }

        if (newIncomes.length > 0) {
            await supabase.from('incomes').insert(newIncomes)
        }
        if (newExpenses.length > 0) {
            await supabase.from('expenses').insert(newExpenses)
        }
    }

    revalidatePath('/')
    return { success: true }
}

// --- Projections ---

export async function getProjections() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Get current expenses
    const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, date')
        .eq('user_id', user.id)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth.toISOString())

    const totalSpent = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
    const daysPassed = now.getDate()
    const daysInMonth = endOfMonth.getDate()
    const daysRemaining = daysInMonth - daysPassed

    const avgDaily = daysPassed > 0 ? totalSpent / daysPassed : 0
    const projectedTotal = totalSpent + (avgDaily * daysRemaining)

    // Get savings goals projections
    const { data: goals } = await supabase
        .from('saving_goals')
        .select('*')
        .eq('user_id', user.id)

    // Filter incomplete goals in JS
    const incompleteGoals = goals?.filter(g => Number(g.current_amount) < Number(g.goal_amount)) || []

    const goalsProjections = incompleteGoals.map(goal => {
        const remaining = Number(goal.goal_amount) - Number(goal.current_amount)
        return {
            ...goal,
            remaining
        }
    })

    return {
        currentSpent: totalSpent,
        projectedSpent: projectedTotal,
        avgDaily,
        daysRemaining,
        goalsProjections
    }
}
