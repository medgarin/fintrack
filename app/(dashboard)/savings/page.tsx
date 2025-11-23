import { getSavingGoals } from './actions'
import { GoalForm } from '@/components/savings/GoalForm'
import { GoalList } from '@/components/savings/GoalList'

export default async function SavingsPage() {
    const goals = await getSavingGoals()

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Savings & Goals</h1>
            <div className="grid gap-6">
                <GoalForm />
                <GoalList goals={goals || []} />
            </div>
        </div>
    )
}
