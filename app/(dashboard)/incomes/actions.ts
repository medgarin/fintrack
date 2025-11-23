'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getIncomeBranches() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('income_branches').select('*')
    if (error) throw error
    return data
}

export async function getIncomes() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('incomes')
        .select('*, income_branches(name)')
        .order('date', { ascending: false })
    if (error) throw error
    return data
}

export async function createIncome(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const amount = formData.get('amount')
    const description = formData.get('description')
    const date = formData.get('date')
    const branchId = formData.get('branchId')
    const isRecurring = formData.get('isRecurring') === 'on'

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'User not authenticated' }
    }

    const { error } = await supabase.from('incomes').insert({
        user_id: user.id,
        amount,
        description,
        date,
        branch_id: branchId,
        is_recurring: isRecurring,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/incomes')
    return { message: 'Income added successfully' }
}

export async function deleteIncome(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('incomes').delete().eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/incomes')
}
