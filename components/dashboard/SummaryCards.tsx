import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingDown, TrendingUp, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface SummaryData {
    totalIncome: number
    totalExpenses: number
    balance: number
    savingsRate: number
    totalSavings: number
}

export function SummaryCards({ data }: { data: SummaryData }) {
    const expenseRate = data.totalIncome > 0 ? (data.totalExpenses / data.totalIncome) * 100 : 0

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Income Card */}
            <Card className="card-hover border-l-4 border-l-success overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success/20 to-transparent rounded-full blur-2xl" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Ingresos
                    </CardTitle>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-success to-success/80 shadow-md">
                        <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                        ${data.totalIncome.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                        <ArrowUpRight className="h-4 w-4 text-success" />
                        <p className="text-xs text-success font-medium">
                            +20.1% del mes pasado
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Total Expenses Card */}
            <Card className="card-hover border-l-4 border-l-destructive overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-destructive/20 to-transparent rounded-full blur-2xl" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Gastos
                    </CardTitle>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-destructive to-destructive/80 shadow-md">
                        <TrendingDown className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                        ${data.totalExpenses.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                        <ArrowUpRight className="h-4 w-4 text-destructive" />
                        <p className="text-xs text-destructive font-medium">
                            {expenseRate.toFixed(1)}% de ingresos
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Available Balance Card */}
            <Card className="card-hover border-l-4 border-l-primary overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Saldo Disponible
                    </CardTitle>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent shadow-md">
                        <Wallet className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                        ${data.balance.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                        <p className="text-xs text-primary font-medium">
                            +19% del mes pasado
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Total Savings Card */}
            <Card className="card-hover border-l-4 border-l-accent overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Ahorros
                    </CardTitle>
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/80 shadow-md">
                        <PiggyBank className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                        ${data.totalSavings.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <p className="text-xs text-accent font-medium">
                                {data.savingsRate.toFixed(1)}% de ingresos
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
