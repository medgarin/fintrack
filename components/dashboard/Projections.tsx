'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, AlertCircle, Calendar } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface ProjectionsData {
    currentSpent: number
    projectedSpent: number
    avgDaily: number
    daysRemaining: number
    goalsProjections: any[]
}

export function Projections({ data }: { data: ProjectionsData | null }) {
    if (!data) return null

    const spentPercentage = Math.min((data.currentSpent / data.projectedSpent) * 100, 100)

    return (
        <Card className="card-hover col-span-4 lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <TrendingUp className="h-4 w-4" />
                    </div>
                    Proyecciones del Mes
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Gasto Actual</span>
                        <span className="font-medium">${data.currentSpent.toLocaleString('es-MX')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Proyección Cierre</span>
                        <span className="font-bold text-primary">${data.projectedSpent.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <Progress value={spentPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground pt-1">
                        Basado en tu promedio diario de <strong>${data.avgDaily.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</strong>.
                        Quedan {data.daysRemaining} días.
                    </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/50">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Estimaciones de Ahorro
                    </h4>
                    {data.goalsProjections.length > 0 ? (
                        <div className="space-y-3">
                            {data.goalsProjections.slice(0, 2).map((goal: any) => (
                                <div key={goal.id} className="flex items-center justify-between text-sm bg-muted/30 p-2 rounded-md">
                                    <span className="truncate max-w-[120px]">{goal.name}</span>
                                    <div className="text-right">
                                        <div className="text-xs text-muted-foreground">Faltan</div>
                                        <div className="font-medium text-primary">${goal.remaining.toLocaleString('es-MX')}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No hay metas activas para proyectar.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
