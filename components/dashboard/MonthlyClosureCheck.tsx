'use client'

import { useEffect, useState } from 'react'
import { checkMonthlyClosure, closeMonth } from '@/app/(dashboard)/advanced-actions'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, CalendarClock } from 'lucide-react'

export function MonthlyClosureCheck() {
    const [isOpen, setIsOpen] = useState(false)
    const [closureData, setClosureData] = useState<{ month: number; year: number; monthName: string } | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const check = async () => {
            try {
                const result = await checkMonthlyClosure()
                if (result?.needsClosure && result.month && result.year && result.monthName) {
                    setClosureData({
                        month: result.month,
                        year: result.year,
                        monthName: result.monthName
                    })
                    setIsOpen(true)
                }
            } catch (error) {
                console.error('Failed to check monthly closure', error)
            }
        }

        check()
    }, [])

    const handleCloseMonth = async () => {
        if (!closureData) return

        setLoading(true)
        try {
            const result = await closeMonth(closureData.month, closureData.year)
            if (result.error) {
                toast.error('Error al cerrar el mes')
            } else {
                toast.success(`¡Mes de ${closureData.monthName} cerrado exitosamente!`)
                setIsOpen(false)
            }
        } catch (error) {
            toast.error('Ocurrió un error inesperado')
        } finally {
            setLoading(false)
        }
    }

    if (!closureData) return null

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CalendarClock className="h-5 w-5 text-primary" />
                        Cierre Mensual Pendiente
                    </DialogTitle>
                    <DialogDescription>
                        El mes de <strong>{closureData.monthName} {closureData.year}</strong> ha terminado.
                        ¿Deseas cerrar el mes para generar tu reporte y procesar transacciones recurrentes?
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Se guardará un resumen de tus finanzas.</li>
                        <li>Se calculará tu ahorro real.</li>
                        <li>Se generarán las transacciones recurrentes de este mes.</li>
                    </ul>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Recordarme luego
                    </Button>
                    <Button onClick={handleCloseMonth} disabled={loading} className="gradient-primary">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Cerrar Mes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
