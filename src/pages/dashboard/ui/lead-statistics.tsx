"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

// Mock data - replace with actual data
const leadData = {
  last7Days: 28,
  thisMonth: 145,
  conversionRate: 32.5,
  mostEffectiveSource: "Instagram",
  topCourse: "Frontend Development"
}

const sourceData = [
  { source: "Instagram", leads: 85 },
  { source: "Telegram", leads: 60 },
]

const courseLeadsData = [
  { course: "Frontend", leads: 45 },
  { course: "Backend", leads: 38 },
  { course: "Fullstack", leads: 32 },
  { course: "Mobile", leads: 20 },
  { course: "Design", leads: 10 },
]

// Color mapping for sources
const sourceColors: Record<string, string> = {
  "Instagram": "#e1306c", // Instagram pink
  "Telegram": "#0088cc", // Telegram blue
}

// Color mapping for courses
const courseLeadsColors: Record<string, string> = {
  "Frontend": "#3b82f6", // Blue
  "Backend": "#10b981", // Green
  "Fullstack": "#8b5cf6", // Purple
  "Mobile": "#f59e0b", // Orange
  "Design": "#ec4899", // Pink
}

const chartConfig = {
  leads: {
    label: "Lidlar",
    color: "#06b6d4", // Cyan/Teal
  },
} satisfies ChartConfig

export function LeadStatistics() {
  return (
    <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Lid statistikasi</CardTitle>
          <CardDescription>Lidlar bo'yicha umumiy ma'lumotlar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">So'nggi 7 kun</p>
              <p className="text-2xl font-bold">{leadData.last7Days}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ushbu oy</p>
              <p className="text-2xl font-bold">{leadData.thisMonth}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Konversiya</p>
              <p className="text-2xl font-bold">{leadData.conversionRate}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Eng samarali manba</p>
              <p className="text-lg font-semibold">{leadData.mostEffectiveSource}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Eng ko'p lid olgan kurs</p>
            <p className="text-lg font-semibold">{leadData.topCourse}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manba bo'yicha lidlar</CardTitle>
          <CardDescription>Instagram va Telegram manbalari</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={sourceData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="source"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="leads"
                fill="#06b6d4"
                radius={[4, 4, 0, 0]}
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={sourceColors[entry.source] || "#06b6d4"} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Kurs bo'yicha lidlar</CardTitle>
          <CardDescription>Har bir kurs uchun lidlar soni</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={courseLeadsData} layout="vertical">
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                dataKey="course"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={100}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="leads"
                fill="#06b6d4"
                radius={[0, 4, 4, 0]}
              >
                {courseLeadsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={courseLeadsColors[entry.course] || "#06b6d4"} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

