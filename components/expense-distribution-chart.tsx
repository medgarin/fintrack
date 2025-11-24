"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

const data = [
  { categoria: "Nómina", valor: 8000, porcentaje: 40 },
  { categoria: "Oficina", valor: 4000, porcentaje: 20 },
  { categoria: "Marketing", valor: 3000, porcentaje: 15 },
  { categoria: "Tecnología", valor: 2500, porcentaje: 12.5 },
  { categoria: "Operaciones", valor: 1500, porcentaje: 7.5 },
  { categoria: "Otros", valor: 1000, porcentaje: 5 },
]

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--muted-foreground))",
]

export function ExpenseDistributionChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Distribución de Gastos</CardTitle>
        <CardDescription className="text-muted-foreground">Gastos por categoría del mes actual</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            valor: {
              label: "Valor",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ porcentaje }: any) => `${porcentaje}%`}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="valor"
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                        <p className="text-sm font-medium text-foreground">{payload[0].payload.categoria}</p>
                        <p className="text-xs text-muted-foreground">
                          ${payload[0].value?.toLocaleString()} ({payload[0].payload.porcentaje}%)
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-xs text-muted-foreground">{entry.payload.categoria}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Category Breakdown */}
        <div className="mt-6 space-y-2">
          {data.map((item, index) => (
            <div key={item.categoria} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-muted-foreground">{item.categoria}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-foreground font-medium">${item.valor.toLocaleString()}</span>
                <span className="text-muted-foreground text-xs w-12 text-right">{item.porcentaje}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
