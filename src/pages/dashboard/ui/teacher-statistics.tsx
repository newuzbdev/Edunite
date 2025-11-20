"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Award, Users, TrendingUp } from "lucide-react"

// Mock data - replace with actual data
const teacherData = [
  { teacher: "Akmal Toshmatov", students: 45, attendance: 95 },
  { teacher: "Dilshod Karimov", students: 38, attendance: 92 },
  { teacher: "Sardor Valiyev", students: 32, attendance: 88 },
  { teacher: "Olimjon Rahimov", students: 28, attendance: 90 },
]

const mostPopularTeacher = teacherData.reduce((prev, current) => 
  (prev.students > current.students) ? prev : current
)

const averageAttendance = Math.round(
  teacherData.reduce((sum, t) => sum + t.attendance, 0) / teacherData.length
)

// Color mapping for teachers
const teacherColors: Record<string, string> = {
  "Akmal Toshmatov": "#3b82f6", // Blue
  "Dilshod Karimov": "#10b981", // Green
  "Sardor Valiyev": "#8b5cf6", // Purple
  "Olimjon Rahimov": "#f59e0b", // Orange
}

const chartConfig = {
  students: {
    label: "Talabalar",
    color: "#10b981", // Green
  },
} satisfies ChartConfig

export function TeacherStatistics() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>O'qituvchi statistikasi</CardTitle>
          <CardDescription>O'qituvchilar bo'yicha ma'lumotlar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-yellow-500" />
              <p className="text-sm text-muted-foreground">Eng mashhur o'qituvchi</p>
            </div>
            <p className="text-2xl font-bold">{mostPopularTeacher.teacher}</p>
            <p className="text-lg text-muted-foreground">
              {mostPopularTeacher.students} ta talaba
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-green-500" />
              <p className="text-sm text-muted-foreground">O'rtacha davomat</p>
            </div>
            <p className="text-3xl font-bold">{averageAttendance}%</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>O'qituvchi bo'yicha talabalar</CardTitle>
          <CardDescription>Har bir o'qituvchidagi talabalar soni</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={teacherData} layout="vertical">
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                dataKey="teacher"
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
                fill="#10b981"
                radius={[0, 4, 4, 0]}
              >
                {teacherData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={teacherColors[entry.teacher] || "#10b981"} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>O'qituvchilar ro'yxati</CardTitle>
          <CardDescription>Barcha o'qituvchilar va ularning statistikasi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {teacherData.map((teacher, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  <p className="font-semibold">{teacher.teacher}</p>
                </div>
                <p className="text-2xl font-bold">{teacher.students} ta</p>
                <p className="text-sm text-muted-foreground">
                  Davomat: {teacher.attendance}%
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

