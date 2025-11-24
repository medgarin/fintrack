'use server'

import { createClient } from '@/utils/supabase/server'

export interface Insight {
    id: string
    type: 'warning' | 'success' | 'info'
    title: string
    description: string
    action?: string
    actionUrl?: string
}

export async function getInsights(): Promise<Insight[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const insights: Insight[] = []
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1).toISOString()

    // 1. Check for high spending categories compared to last month
    // Get current month expenses
    const { data: currentExpenses } = await supabase
        .from('expenses')
        .select('amount, category_id, categories(name)')
        .eq('user_id', user.id)
        .gte('date', startOfMonth)

    // Get previous month expenses
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevStart = prevDate.toISOString()
    const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()

    const { data: prevExpenses } = await supabase
        .from('expenses')
        .select('amount, category_id, categories(name)')
        .eq('user_id', user.id)
        .gte('date', prevStart)
        .lte('date', prevEnd)

    // Group by category
    const currentByCat: Record<string, { amount: number, name: string }> = {}
    currentExpenses?.forEach((e: any) => {
        if (e.category_id) {
            const name = e.categories?.name || 'Desconocido'
            if (!currentByCat[e.category_id]) currentByCat[e.category_id] = { amount: 0, name }
            currentByCat[e.category_id].amount += Number(e.amount)
        }
    })

    const prevByCat: Record<string, number> = {}
    prevExpenses?.forEach((e: any) => {
        if (e.category_id) {
            prevByCat[e.category_id] = (prevByCat[e.category_id] || 0) + Number(e.amount)
        }
    })

    // Compare
    Object.entries(currentByCat).forEach(([catId, data]) => {
        const prevAmount = prevByCat[catId] || 0
        if (prevAmount > 0 && data.amount > prevAmount * 1.2) { // 20% increase
            insights.push({
                id: `high-spend-${catId}`,
                type: 'warning',
                title: `Gasto elevado en ${data.name}`,
                description: `Has gastado un 20% más en ${data.name} comparado con el mes anterior.`,
                action: 'Revisar Presupuesto',
                actionUrl: '/budget'
            })
        }
    })

    // 2. Check Savings Rate
    // We need income for this
    const { data: income } = await supabase
        .from('incomes')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', startOfMonth)

    const totalIncome = income?.reduce((sum, i) => sum + Number(i.amount), 0) || 0
    const totalExpenses = currentExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0

    if (totalIncome > 0) {
        const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100
        if (savingsRate < 10 && totalExpenses > 0) {
            insights.push({
                id: 'low-savings',
                type: 'info',
                title: 'Oportunidad de Ahorro',
                description: 'Tu tasa de ahorro es menor al 10%. Intenta reducir gastos hormiga.',
                action: 'Ver Gastos',
                actionUrl: '/expenses' // Assuming this page exists or will exist
            })
        } else if (savingsRate > 30) {
            insights.push({
                id: 'high-savings',
                type: 'success',
                title: '¡Excelente Ahorro!',
                description: 'Estás ahorrando más del 30% de tus ingresos. ¡Sigue así!',
            })
        }
    }

    // 3. Emergency Fund Check (Simple approximation: Balance vs 3 months expenses)
    // For now, let's just check if they have a "Savings" goal
    const { data: goals } = await supabase
        .from('saving_goals')
        .select('id')
        .eq('user_id', user.id)
        .ilike('name', '%emergencia%') // Check for "Fondo de Emergencia" etc.

    if (!goals || goals.length === 0) {
        insights.push({
            id: 'no-emergency-fund',
            type: 'info',
            title: 'Fondo de Emergencia',
            description: 'No tienes una meta para fondo de emergencia. Es recomendable tener 3-6 meses de gastos.',
            action: 'Crear Meta',
            actionUrl: '/' // Opens dialog? Or just scroll to goals
        })
    }

    return insights
}
