import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { DashboardCharts } from '@/components/dashboard/Charts'
import { getDashboardData } from './actions'
import { GoalList } from '@/components/savings/GoalList'

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
        return <div>Loading...</div>
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <SummaryCards data={dashboardData.summary} />
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Savings Goals</h2>
                <GoalList goals={dashboardData.goals} />
            </div>
            <DashboardCharts data={dashboardData.charts} />

        </div>
    )
}
