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
const courseData = [
  { course: "Frontend Development", students: 45 },
  { course: "Backend Development", students: 38 },
  { course: "Fullstack Development", students: 32 },
  { course: "Mobile Development", students: 25 },
  { course: "UI/UX Design", students: 16 },
]

const topCourse = courseData.reduce((prev, current) => 
  (prev.students > current.students) ? prev : current
)

// Color mapping for each course
const courseColors: Record<string, string> = {
  "Frontend Development": "#3b82f6", // Blue
  "Backend Development": "#10b981", // Green
  "Fullstack Development": "#8b5cf6", // Purple
  "Mobile Development": "#f59e0b", // Orange
  "UI/UX Design": "#ec4899", // Pink
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
      <Card>
        <CardHeader>
          <CardTitle>Kurs statistikasi</CardTitle>
          <CardDescription>Kurslar bo'yicha talabalar taqsimoti</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Eng ko'p talabasi bo'lgan kurs/guruh</p>
            <p className="text-2xl font-bold">{topCourse.course}</p>
            <p className="text-lg text-muted-foreground">{topCourse.students} ta talaba</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kurs bo'yicha talabalar</CardTitle>
          <CardDescription>Har bir kursdagi talabalar soni</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={courseData} layout="vertical">
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
                width={120}
                tickFormatter={(value) => value.split(' ')[0]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="students"
                fill="#f59e0b"
                radius={[0, 4, 4, 0]}
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

