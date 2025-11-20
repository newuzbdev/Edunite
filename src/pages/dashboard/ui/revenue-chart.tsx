"use client"

import * as React from "react"
import { CartesianGrid, XAxis, YAxis, Bar, BarChart } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const chartData7Days = [
  { date: "2024-12-25", revenue: 450000 },
  { date: "2024-12-26", revenue: 520000 },
  { date: "2024-12-27", revenue: 480000 },
  { date: "2024-12-28", revenue: 610000 },
  { date: "2024-12-29", revenue: 550000 },
  { date: "2024-12-30", revenue: 680000 },
  { date: "2024-12-31", revenue: 720000 },
]

const chartData30Days = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toISOString().split('T')[0],
    revenue: Math.floor(Math.random() * 500000) + 300000
  }
})

const chartConfig = {
  revenue: {
    label: "Daromad",
    color: "#10b981", // Green
  },
} satisfies ChartConfig

export function RevenueChart() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d">("7d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const data = timeRange === "7d" ? chartData7Days : chartData30Days

  return (
    <div className="bg-white shadow-sm rounded-xl p-4">
      <CardHeader>
        <CardTitle>Daromad grafigi</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            So'nggi {timeRange === "7d" ? "7 kun" : "30 kun"} uchun daromad dinamikasi
          </span>
          <span className="@[540px]/card:hidden">
            So'nggi {timeRange === "7d" ? "7 kun" : "30 kun"}
          </span>
        </CardDescription>
        <CardAction className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as "7d" | "30d")}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Vaqt oralig'ini tanlang"
            >
              <SelectValue placeholder="Vaqt oralig'i" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                So'nggi 7 kun
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                So'nggi 30 kun
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("uz-UZ", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                  return value.toString()
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("uz-UZ", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                    formatter={(value) => [`${Number(value).toLocaleString()} so'm`, "Daromad"]}
                    indicator="dot"
                  />
                }
              />
              <Bar
                dataKey="revenue"
                fill="var(--color-revenue)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </div>
  )
}

