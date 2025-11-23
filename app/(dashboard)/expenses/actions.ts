'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCategories() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('categories').select('*')
    if (error) throw error
    return data
}

export async function getExpenses() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('expenses')
        .select('*, categories(name, color)')
        .order('date', { ascending: false })
    if (error) throw error
    return data
}

export async function createExpense(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const amount = formData.get('amount')
    const description = formData.get('description')
    const date = formData.get('date')
    const categoryId = formData.get('categoryId')
    const paymentMethod = formData.get('paymentMethod')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'User not authenticated' }
    }

    const { error } = await supabase.from('expenses').insert({
        user_id: user.id,
        amount,
        description,
        date,
        category_id: categoryId,
        payment_method: paymentMethod,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/expenses')
    return { message: 'Expense added successfully' }
}

export async function deleteExpense(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('expenses').delete().eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/expenses')
}
