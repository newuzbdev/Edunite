"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Users, GraduationCap } from "lucide-react"

// Mock data - replace with actual data
const courseData = [
  { course: "Frontend", students: 45 },
  { course: "Backend", students: 38 },
  { course: "Fullstack", students: 32 },
  { course: "Mobile", students: 25 },
]

const topCourse = courseData.reduce((prev, current) => 
  (prev.students > current.students) ? prev : current
)

// Color mapping for each course
const courseColors: Record<string, string> = {
  "Frontend": "#3b82f6", // Blue
  "Backend": "#10b981", // Green
  "Fullstack": "#8b5cf6", // Purple
  "Mobile": "#f59e0b", // Orange
}

const chartConfig = {
  students: {
    label: "Talabalar",
    color: "#f59e0b", // Orange
  },
} satisfies ChartConfig

export function CourseStatistics() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Kurs statistikasi</CardTitle>
          <CardDescription className="text-sm">Kurslar bo'yicha talabalar taqsimoti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Eng ko'p talabasi bo'lgan kurs/guruh</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight">{topCourse.course}</p>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="text-base font-medium text-muted-foreground">{topCourse.students} ta talaba</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Kurs bo'yicha talabalar</CardTitle>
          <CardDescription className="text-sm">Har bir kursdagi talabalar soni</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
              <XAxis
                dataKey="course"
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
                domain={[0, 60]}
                ticks={[0, 15, 30, 45, 60]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="students"
                fill="#f59e0b"
                radius={[6, 6, 0, 0]}
              >
                {courseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={courseColors[entry.course] || "#f59e0b"} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

