import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function StatsCards() {
  const ingresos = 25000
  const gastos = 20000
  const saldo = ingresos - gastos
  const nivelGasto = (gastos / ingresos) * 100

  const isHighSpending = nivelGasto > 90

  return (
    <div className="space-y-6">
      {/* Alert for high spending */}
      {isHighSpending && (
        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive-foreground">
            ⚠️ Alerta: El nivel de gasto ha superado el 90%. Considera reducir gastos.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Ingresos */}
        <Card className="border-border bg-card hover:bg-card/80 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">💵 Ingresos del mes</p>
                <p className="text-3xl font-bold text-foreground">${ingresos.toLocaleString()}</p>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% vs mes anterior
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gastos */}
        <Card className="border-border bg-card hover:bg-card/80 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">💸 Gastos del mes</p>
                <p className="text-3xl font-bold text-foreground">${gastos.toLocaleString()}</p>
                <p className="text-xs text-destructive flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  +8.2% vs mes anterior
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saldo */}
        <Card className="border-border bg-card hover:bg-card/80 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">📊 Saldo disponible</p>
                <p className="text-3xl font-bold text-foreground">${saldo.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{((saldo / ingresos) * 100).toFixed(1)}% de ingresos</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nivel de Gasto */}
        <Card
          className={`border-border bg-card hover:bg-card/80 transition-colors ${
            nivelGasto > 90 ? "ring-2 ring-destructive/50" : ""
          }`}
        >
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">⚠️ Nivel de gasto</p>
                <div
                  className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    nivelGasto > 90 ? "bg-destructive/10" : nivelGasto > 70 ? "bg-warning/10" : "bg-success/10"
                  }`}
                >
                  <AlertTriangle
                    className={`h-6 w-6 ${
                      nivelGasto > 90 ? "text-destructive" : nivelGasto > 70 ? "text-warning" : "text-success"
                    }`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-foreground">{nivelGasto.toFixed(0)}%</p>
                  <p
                    className={`text-xs font-medium ${
                      nivelGasto > 90 ? "text-destructive" : nivelGasto > 70 ? "text-warning" : "text-success"
                    }`}
                  >
                    {nivelGasto > 90 ? "Alto" : nivelGasto > 70 ? "Moderado" : "Óptimo"}
                  </p>
                </div>
                <Progress
                  value={nivelGasto}
                  className={`h-2 ${
                    nivelGasto > 90
                      ? "[&>div]:bg-destructive"
                      : nivelGasto > 70
                        ? "[&>div]:bg-warning"
                        : "[&>div]:bg-success"
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
