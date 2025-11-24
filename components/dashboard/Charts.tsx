'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid } from 'recharts'

interface ChartData {
    incomeVsExpenses: { name: string; income: number; expenses: number }[]
    categoryDistribution: { name: string; value: number }[]
}

const COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    'var(--primary)',
    'var(--accent)'
]

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-lg">
                <p className="font-medium mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color || entry.fill }}
                        />
                        <span className="text-muted-foreground capitalize">
                            {entry.name}:
                        </span>
                        <span className="font-bold">
                            ${entry.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        )
    }
    return null
}

export function DashboardCharts({ data }: { data: ChartData }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 card-hover overflow-hidden">
                <CardHeader>
                    <CardTitle>Ingresos vs Gastos</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data.incomeVsExpenses} barGap={8}>
                            <defs>
                                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--success)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0.3} />
                                </linearGradient>
                                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--destructive)" stopOpacity={0.3} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis
                                dataKey="name"
                                stroke="var(--foreground)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                                tick={{ fill: 'var(--foreground)', opacity: 0.7 }}
                            />
                            <YAxis
                                stroke="var(--foreground)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                                dx={-10}
                                tick={{ fill: 'var(--foreground)', opacity: 0.7 }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.2 }} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar
                                name="Ingresos"
                                dataKey="income"
                                fill="url(#incomeGradient)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                            <Bar
                                name="Gastos"
                                dataKey="expenses"
                                fill="url(#expenseGradient)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-4 md:col-span-3 card-hover overflow-hidden">
                <CardHeader>
                    <CardTitle>Gastos por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={data.categoryDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.categoryDistribution.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        strokeWidth={0}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                wrapperStyle={{ paddingLeft: '20px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
