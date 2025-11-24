'use client'

import { useEffect, useState } from 'react'
import { getFinancialHealth } from '@/app/(dashboard)/health-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PieChart, ShieldCheck, Loader2 } from 'lucide-react'

interface HealthData {
    fiftyThirtyTwenty: {
        needs: number
        wants: number
        savings: number
        totalIncome: number
    }
    emergencyFund: {
        current: number
        target: number
        monthsCovered: number
    }
}

export function FinancialHealth() {
    const [data, setData] = useState<HealthData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getFinancialHealth()
                setData(result)
            } catch (error) {
                console.error('Failed to fetch financial health', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
    if (!data) return null

    const { needs, wants, savings, totalIncome } = data.fiftyThirtyTwenty
    const totalTracked = needs + wants + savings
    // Use totalIncome as base if available, otherwise totalTracked
    const base = totalIncome > 0 ? totalIncome : totalTracked

    const needsPct = (needs / base) * 100
    const wantsPct = (wants / base) * 100
    const savingsPct = (savings / base) * 100

    return (
        <Card className="card-hover">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Salud Financiera
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* 50/30/20 Rule */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center justify-between">
                        <span>Regla 50/30/20</span>
                        <span className="text-xs text-muted-foreground">Objetivo</span>
                    </h4>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Necesidades ({needsPct.toFixed(0)}%)</span>
                            <span className="text-muted-foreground">50%</span>
                        </div>
                        <Progress value={needsPct} className="h-2" indicatorClassName={needsPct > 50 ? 'bg-yellow-500' : 'bg-primary'} />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Deseos ({wantsPct.toFixed(0)}%)</span>
                            <span className="text-muted-foreground">30%</span>
                        </div>
                        <Progress value={wantsPct} className="h-2" indicatorClassName={wantsPct > 30 ? 'bg-yellow-500' : 'bg-blue-500'} />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Ahorros ({savingsPct.toFixed(0)}%)</span>
                            <span className="text-muted-foreground">20%</span>
                        </div>
                        <Progress value={savingsPct} className="h-2" indicatorClassName={savingsPct < 20 ? 'bg-destructive' : 'bg-green-500'} />
                    </div>
                </div>

                {/* Emergency Fund */}
                <div className="pt-4 border-t border-border/50 space-y-3">
                    <h4 className="text-sm font-medium flex items-center justify-between">
                        <span>Fondo de Emergencia</span>
                        <span className="text-xs font-normal bg-muted px-2 py-0.5 rounded">
                            {data.emergencyFund.monthsCovered.toFixed(1)} meses
                        </span>
                    </h4>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>${data.emergencyFund.current.toLocaleString('es-MX')}</span>
                            <span>Meta: ${data.emergencyFund.target.toLocaleString('es-MX')}</span>
                        </div>
                        <Progress
                            value={(data.emergencyFund.current / data.emergencyFund.target) * 100}
                            className="h-2"
                            indicatorClassName="bg-green-500"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
