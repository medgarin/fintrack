'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSavingGoals() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('saving_goals')
        .select('*')
        .order('created_at', { ascending: false })
    if (error) throw error
    return data
}

export async function createSavingGoal(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name')
    const goalAmount = formData.get('goalAmount')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'User not authenticated' }
    }

    const { error } = await supabase.from('saving_goals').insert({
        user_id: user.id,
        name,
        goal_amount: goalAmount,
        current_amount: 0,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/savings')
    return { message: 'Goal created successfully' }
}

export async function addFundsToGoal(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const goalId = formData.get('goalId')
    const amount = parseFloat(formData.get('amount') as string)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'User not authenticated' }
    }

    // 1. Create transaction
    const { error: txError } = await supabase.from('saving_goal_transactions').insert({
        goal_id: goalId,
        amount,
        date: new Date().toISOString(),
        description: 'Manual contribution',
    })

    if (txError) {
        return { error: txError.message }
    }

    // 2. Update goal current amount (RPC or manual update)
    // For simplicity, we'll fetch current amount and update it, but strictly this should be a stored procedure or atomic update.
    // Let's use a simple update for now.
    const { data: goal } = await supabase.from('saving_goals').select('current_amount').eq('id', goalId).single()

    if (goal) {
        const newAmount = (goal.current_amount || 0) + amount
        await supabase.from('saving_goals').update({ current_amount: newAmount }).eq('id', goalId)
    }

    revalidatePath('/savings')
    return { message: 'Funds added successfully' }
}

export async function deleteGoal(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('saving_goals').delete().eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/savings')
}
