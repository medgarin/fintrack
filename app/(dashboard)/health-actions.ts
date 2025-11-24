'use server'

import { createClient } from '@/utils/supabase/server'

export async function getFinancialHealth() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    // 1. 50/30/20 Rule Calculation
    // We need to categorize expenses into Needs, Wants, Savings.
    // Since we don't have explicit tags, we'll use Income Branches as a proxy if possible,
    // or just categorize based on Category Names (heuristic).
    // Better yet, let's just return the raw category data and let the frontend map it 
    // or provide a default mapping.
    // For MVP, let's assume:
    // Needs: 'Fixed' branch expenses (if we had expense branches), or categories like 'Vivienda', 'Comida', 'Transporte'
    // Wants: 'Fun' branch, 'Variable', or categories like 'Entretenimiento', 'Restaurantes'
    // Savings: 'Savings' branch or 'Ahorro' category.

    // Let's fetch expenses with categories
    const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, categories(name)')
        .eq('user_id', user.id)
        .gte('date', startOfMonth)

    const { data: income } = await supabase
        .from('incomes')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', startOfMonth)

    const totalIncome = income?.reduce((sum, i) => sum + Number(i.amount), 0) || 0

    let needs = 0
    let wants = 0
    let savings = 0 // We can also use saving_goal_transactions

    expenses?.forEach((e: any) => {
        const catName = e.categories?.name?.toLowerCase() || ''
        const amount = Number(e.amount)

        // Heuristic mapping
        if (['vivienda', 'casa', 'servicios', 'luz', 'agua', 'internet', 'supermercado', 'transporte', 'salud', 'educación'].some(k => catName.includes(k))) {
            needs += amount
        } else if (['ahorro', 'inversión'].some(k => catName.includes(k))) {
            savings += amount
        } else {
            wants += amount
        }
    })

    // Add explicit savings from goals
    const { data: goalTxns } = await supabase
        .from('saving_goal_transactions') // This table might not be directly linked to user, need join.
        // Actually we used a join in closeMonth. Let's simplify and assume we can get it via goals.
        // Or just use the 'savings' variable calculated above if users categorize transfers as expenses.
        // Let's stick to the heuristic above for simplicity in this MVP phase.
        .select('amount') // This is risky without user filter. 
    // Let's skip explicit goal txns for now and rely on expense categorization "Ahorro".

    // 2. Emergency Fund
    // Target: 3-6 months of "Needs" (or total expenses). Let's use 6 months of average expenses.
    // We need average monthly expenses.
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString()
    const { data: pastExpenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', threeMonthsAgo)

    const totalPastExpenses = pastExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
    const avgMonthlyExpenses = totalPastExpenses / 3 || (needs + wants) // Fallback to current month if no history

    const emergencyFundTarget = avgMonthlyExpenses * 6

    // Current Emergency Fund
    // Look for a goal named "Emergency" or "Emergencia"
    const { data: emergencyGoal } = await supabase
        .from('saving_goals')
        .select('current_amount')
        .eq('user_id', user.id)
        .ilike('name', '%emergencia%')
        .single()

    const currentEmergencyFund = emergencyGoal?.current_amount || 0

    return {
        fiftyThirtyTwenty: {
            needs,
            wants,
            savings,
            totalIncome
        },
        emergencyFund: {
            current: currentEmergencyFund,
            target: emergencyFundTarget,
            monthsCovered: avgMonthlyExpenses > 0 ? currentEmergencyFund / avgMonthlyExpenses : 0
        }
    }
}
