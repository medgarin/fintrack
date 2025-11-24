import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { DashboardCharts } from '@/components/dashboard/Charts'
import { getDashboardData } from './actions'
import { GoalList } from '@/components/savings/GoalList'
import { Sparkles } from 'lucide-react'
import { TopExpenses } from '@/components/dashboard/TopExpenses'
import { Projections } from '@/components/dashboard/Projections'
import { InsightsPanel } from '@/components/dashboard/InsightsPanel'
import { FinancialHealth } from '@/components/dashboard/FinancialHealth'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const dashboardData = await getDashboardData()

    if (!dashboardData) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    // Get user's name or email for the welcome message
    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    Hola, {userName} <span className="animate-wave inline-block">👋</span>
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                    Aquí tienes un resumen de tus finanzas hoy.
                    <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                </p>
            </div>

            <SummaryCards data={dashboardData.summary} />

            <DashboardCharts data={dashboardData.charts} />
            <Projections data={dashboardData.projections} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <div className="">
                    <InsightsPanel />
                    <TopExpenses expenses={dashboardData.topExpenses as any} />
                </div>
                <FinancialHealth />
                {/* <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold tracking-tight">Metas de Ahorro</h2>
                    </div>
                    <GoalList goals={dashboardData.goals} />
                </div> */}
            </div>
        </div>
    )
}
