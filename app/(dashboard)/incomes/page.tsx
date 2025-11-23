import { getIncomeBranches, getIncomes } from './actions'
import { IncomeForm } from '@/components/incomes/IncomeForm'
import { IncomeList } from '@/components/incomes/IncomeList'

export default async function IncomesPage() {
    const [branches, incomes] = await Promise.all([
        getIncomeBranches(),
        getIncomes(),
    ])

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Income Management</h1>
            <div className="grid gap-6 md:grid-cols-[350px_1fr]">
                <div>
                    <IncomeForm branches={branches || []} />
                </div>
                <div>
                    <IncomeList incomes={incomes || []} />
                </div>
            </div>
        </div>
    )
}
