"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { mes: "Ene", ingresos: 22000, gastos: 18000 },
  { mes: "Feb", ingresos: 24000, gastos: 19000 },
  { mes: "Mar", ingresos: 23000, gastos: 17500 },
  { mes: "Abr", ingresos: 26000, gastos: 20500 },
  { mes: "May", ingresos: 25000, gastos: 19500 },
  { mes: "Jun", ingresos: 25000, gastos: 20000 },
]

export function IncomeExpenseChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Ingresos vs Gastos</CardTitle>
        <CardDescription className="text-muted-foreground">Comparación mensual de ingresos y gastos</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            ingresos: {
              label: "Ingresos",
              color: "hsl(var(--chart-2))",
            },
            gastos: {
              label: "Gastos",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }} />
              <Legend
                wrapperStyle={{
                  fontSize: "12px",
                  paddingTop: "10px",
                }}
              />
              <Bar dataKey="ingresos" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} name="Ingresos" />
              <Bar dataKey="gastos" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
