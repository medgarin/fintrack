'use client'

import { useEffect, useState } from 'react'
import { getInsights, Insight } from '@/app/(dashboard)/insights-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lightbulb, AlertTriangle, CheckCircle, Info, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function InsightsPanel() {
    const [insights, setInsights] = useState<Insight[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const data = await getInsights()
                setInsights(data)
            } catch (error) {
                console.error('Failed to fetch insights', error)
            } finally {
                setLoading(false)
            }
        }
        fetchInsights()
    }, [])

    if (loading) return null // Or skeleton
    if (insights.length === 0) return null

    return (
        <Card className="card-hover border-l-4 border-l-primary/50">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Insights Financieros
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {insights.slice(0, 3).map((insight) => (
                    <div key={insight.id} className="flex gap-3 items-start p-3 rounded-lg bg-muted/30">
                        <div className="mt-0.5">
                            {insight.type === 'warning' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                            {insight.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {insight.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="flex-1 space-y-1">
                            <h4 className="text-sm font-medium leading-none">{insight.title}</h4>
                            <p className="text-xs text-muted-foreground">{insight.description}</p>
                            {insight.action && insight.actionUrl && (
                                <Link href={insight.actionUrl} className="inline-flex items-center text-xs font-medium text-primary hover:underline mt-1">
                                    {insight.action} <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
