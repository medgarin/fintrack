'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// --- Smart Budgeting ---

export async function getBudgets(month: number, year: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: budgets } = await supabase
        .from('budgets')
        .select('*, categories(name, color)')
        .eq('user_id', user.id)
        .eq('month', month)
        .eq('year', year)

    return budgets || []
}

export async function saveBudget(categoryId: string, amount: number, month: number, year: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Check if budget exists
    const { data: existing } = await supabase
        .from('budgets')
        .select('id')
        .eq('user_id', user.id)
        .eq('category_id', categoryId)
        .eq('month', month)
        .eq('year', year)
        .single()

    let error
    if (existing) {
        const { error: updateError } = await supabase
            .from('budgets')
            .update({ amount })
            .eq('id', existing.id)
        error = updateError
    } else {
        const { error: insertError } = await supabase
            .from('budgets')
            .insert({
                user_id: user.id,
                category_id: categoryId,
                amount,
                month,
                year
            })
        error = insertError
    }

    if (error) {
        console.error('Error saving budget:', error)
        return { error: 'Failed to save budget' }
    }

    revalidatePath('/budget')
    return { success: true }
}

export async function getSuggestedBudgets() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Calculate average spending per category for the last 3 months
    const now = new Date()
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString()

    const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, category_id')
        .eq('user_id', user.id)
        .gte('date', threeMonthsAgo)

    if (!expenses || expenses.length === 0) return []

    const categoryTotals: Record<string, number> = {}
    expenses.forEach((e: any) => {
        if (e.category_id) {
            categoryTotals[e.category_id] = (categoryTotals[e.category_id] || 0) + Number(e.amount)
        }
    })

    // Divide by 3 to get monthly average
    const suggestions = Object.entries(categoryTotals).map(([categoryId, total]) => ({
        categoryId,
        amount: Math.round(total / 3)
    }))

    return suggestions
}
