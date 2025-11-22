"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Calendar, TrendingUp, Target, Instagram, BookOpen } from "lucide-react"

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
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Lid statistikasi</CardTitle>
          <CardDescription className="text-sm">Lidlar bo'yicha umumiy ma'lumotlar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>So'nggi 7 kun</span>
              </div>
              <p className="text-2xl font-bold tracking-tight">{leadData.last7Days}</p>
            </div>
            <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Ushbu oy</span>
              </div>
              <p className="text-2xl font-bold tracking-tight">{leadData.thisMonth}</p>
            </div>
            <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Target className="h-3.5 w-3.5" />
                <span>Konversiya</span>
              </div>
              <p className="text-2xl font-bold tracking-tight text-primary">{leadData.conversionRate}%</p>
            </div>
            <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Eng samarali manba</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-[#e1306c]" />
                <p className="text-base font-semibold">{leadData.mostEffectiveSource}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Eng ko'p lid olgan kurs</span>
            </div>
            <p className="text-lg font-semibold">{leadData.topCourse}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Manba bo'yicha lidlar</CardTitle>
          <CardDescription className="text-sm">Instagram va Telegram manbalari</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
              <XAxis
                dataKey="source"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="leads"
                fill="#06b6d4"
                radius={[6, 6, 0, 0]}
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={sourceColors[entry.source] || "#06b6d4"} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Kurs bo'yicha lidlar</CardTitle>
          <CardDescription className="text-sm">Har bir kurs uchun lidlar soni</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <ChartContainer config={chartConfig} className="h-[250px] w-full min-w-[400px]">
            <BarChart data={courseLeadsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis
                dataKey="course"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={100}
                className="text-xs"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="leads"
                fill="#06b6d4"
                radius={[0, 6, 6, 0]}
              >
                {courseLeadsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={courseLeadsColors[entry.course] || "#06b6d4"} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

