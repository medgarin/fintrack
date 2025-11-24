'use client'

import { useState, useEffect } from 'react'
import { getBudgets, saveBudget, getSuggestedBudgets } from '@/app/(dashboard)/budget-actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { Loader2, Sparkles, Save, AlertTriangle } from 'lucide-react'
import { CustomCurrencyInput } from '@/components/ui/currency-input'

interface Category {
    id: string
    name: string
    color: string
}

interface Budget {
    id: string
    category_id: string
    amount: number
    month: number
    year: number
}

interface BudgetPlannerProps {
    categories: Category[]
    initialBudgets: Budget[]
    currentSpending: Record<string, number> // categoryId -> amount
}

export function BudgetPlanner({ categories, initialBudgets, currentSpending }: BudgetPlannerProps) {
    const [budgets, setBudgets] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState<string | null>(null)
    const [suggestions, setSuggestions] = useState<Record<string, number>>({})
    const [showSuggestions, setShowSuggestions] = useState(false)

    const date = new Date()
    const currentMonth = date.getMonth() + 1
    const currentYear = date.getFullYear()

    useEffect(() => {
        const initialMap: Record<string, number> = {}
        initialBudgets.forEach(b => {
            initialMap[b.category_id] = b.amount
        })
        setBudgets(initialMap)
    }, [initialBudgets])

    const handleSave = async (categoryId: string) => {
        const amount = budgets[categoryId] || 0
        setLoading(categoryId)
        try {
            const result = await saveBudget(categoryId, amount, currentMonth, currentYear)
            if (result.error) {
                toast.error('Error al guardar el presupuesto')
            } else {
                toast.success('Presupuesto guardado')
            }
        } catch (error) {
            toast.error('Error inesperado')
        } finally {
            setLoading(null)
        }
    }

    const loadSuggestions = async () => {
        setLoading('suggestions')
        try {
            const data = await getSuggestedBudgets()
            const map: Record<string, number> = {}
            data.forEach((item: any) => {
                map[item.categoryId] = item.amount
            })
            setSuggestions(map)
            setShowSuggestions(true)
            toast.success('Sugerencias cargadas basadas en tu historial')
        } catch (error) {
            toast.error('No se pudieron cargar las sugerencias')
        } finally {
            setLoading(null)
        }
    }

    const applySuggestion = (categoryId: string) => {
        if (suggestions[categoryId]) {
            setBudgets(prev => ({ ...prev, [categoryId]: suggestions[categoryId] }))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Planificador de Presupuesto</h2>
                    <p className="text-muted-foreground">Define tus límites de gasto para este mes.</p>
                </div>
                <Button
                    variant="outline"
                    onClick={loadSuggestions}
                    disabled={loading === 'suggestions'}
                    className="gap-2"
                >
                    {loading === 'suggestions' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-yellow-500" />}
                    Sugerir Presupuestos
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map(category => {
                    const budgetAmount = budgets[category.id] || 0
                    const spentAmount = currentSpending[category.id] || 0
                    const percentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0
                    const isOverBudget = percentage > 100
                    const suggestion = suggestions[category.id]

                    return (
                        <Card key={category.id} className={`card-hover ${isOverBudget ? 'border-destructive/50' : ''}`}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                                        {category.name}
                                    </span>
                                    {isOverBudget && <AlertTriangle className="h-4 w-4 text-destructive" />}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Gastado: ${spentAmount.toLocaleString('es-MX')}</span>
                                        <span className={`font-medium ${isOverBudget ? 'text-destructive' : 'text-primary'}`}>
                                            {percentage.toFixed(0)}%
                                        </span>
                                    </div>
                                    <Progress value={Math.min(percentage, 100)} className={`h-2 ${isOverBudget ? 'bg-destructive/20' : ''}`} indicatorClassName={isOverBudget ? 'bg-destructive' : ''} />
                                </div>

                                <div className="flex gap-2 items-end">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground">Presupuesto</label>
                                        <CustomCurrencyInput
                                            value={budgetAmount}
                                            onValueChange={(val) => setBudgets(prev => ({ ...prev, [category.id]: Number(val) || 0 }))}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <Button
                                        size="icon"
                                        onClick={() => handleSave(category.id)}
                                        disabled={loading === category.id}
                                        className="mb-[2px]"
                                    >
                                        {loading === category.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    </Button>
                                </div>

                                {showSuggestions && suggestion > 0 && suggestion !== budgetAmount && (
                                    <div
                                        className="text-xs flex items-center justify-between bg-muted/50 p-2 rounded cursor-pointer hover:bg-muted transition-colors"
                                        onClick={() => applySuggestion(category.id)}
                                    >
                                        <span className="text-muted-foreground">Sugerido: ${suggestion.toLocaleString('es-MX')}</span>
                                        <Sparkles className="h-3 w-3 text-yellow-500" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
