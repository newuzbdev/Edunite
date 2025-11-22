"use client"

import { useMemo } from "react"
import { usePaymentsStore } from "../utils/payments-store"
import { useCoursesStore } from "@/pages/kurslar/utils/courses-store"
import { useTeachersStore } from "@/pages/teachers.tsx/utils/teachers-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RevenueChart } from "../../dashboard/ui/revenue-chart"
import { GraduationCap, UserCircle } from "lucide-react"

export default function Statistics() {
  const payments = usePaymentsStore((state) => state.payments)
  const courses = useCoursesStore((state) => state.courses)
  const teachers = useTeachersStore((state) => state.teachers)

  // Calculate revenue by course with additional data
  const revenueByCourse = useMemo(() => {
    const courseMap = new Map<
      string,
      { name: string; revenue: number; paymentCount: number; studentCount: number }
    >()

    payments
      .filter((p) => p.status === "paid")
      .forEach((payment) => {
        const existing = courseMap.get(payment.course)
        if (existing) {
          existing.revenue += payment.amount
          existing.paymentCount += 1
        } else {
          // Find course to get student count
          const course = courses.find((c) => c.name === payment.course)
          courseMap.set(payment.course, {
            name: payment.course,
            revenue: payment.amount,
            paymentCount: 1,
            studentCount: course?.students?.length || 0,
          })
        }
      })

    return Array.from(courseMap.values())
      .map((item) => ({
        ...item,
        revenue: Math.round(item.revenue),
      }))
      .sort((a, b) => b.revenue - a.revenue)
  }, [payments, courses])

  // Calculate revenue by teacher with additional data
  const revenueByTeacher = useMemo(() => {
    const teacherMap = new Map<
      string,
      { teacherId: string; name: string; revenue: number; paymentCount: number; courseCount: number; status: string }
    >()

    payments
      .filter((p) => p.status === "paid")
      .forEach((payment) => {
        const course = courses.find((c) => c.name === payment.course)
        if (course && course.mainTeacher) {
          const teacherId = course.mainTeacher.id
          const teacherName = course.mainTeacher.fullName
          const existing = teacherMap.get(teacherId)

          if (existing) {
            existing.revenue += payment.amount
            existing.paymentCount += 1
          } else {
            // Count unique courses for this teacher
            const teacherCourses = courses.filter((c) => c.mainTeacher?.id === teacherId)
            const teacherDetails = teachers.find((t) => t.id === teacherId)
            teacherMap.set(teacherId, {
              teacherId,
              name: teacherName,
              revenue: payment.amount,
              paymentCount: 1,
              courseCount: teacherCourses.length,
              status: teacherDetails?.status === "active" ? "Aktiv" : "Nofaol",
            })
          }
        }
      })

    return Array.from(teacherMap.values())
      .map((item) => ({
        ...item,
        revenue: Math.round(item.revenue),
      }))
      .sort((a, b) => b.revenue - a.revenue)
  }, [payments, courses, teachers])

  const totalCourseRevenue = useMemo(() => {
    return revenueByCourse.reduce((sum, course) => sum + course.revenue, 0)
  }, [revenueByCourse])

  const totalTeacherRevenue = useMemo(() => {
    return revenueByTeacher.reduce((sum, teacher) => sum + teacher.revenue, 0)
  }, [revenueByTeacher])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
            <div className="space-y-1">
              <CardDescription>Kunlik daromad</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                720 000 so'm
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
            <div className="space-y-1">
              <CardDescription>Haftalik daromad</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                4 200 000 so'm
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
            <div className="space-y-1">
              <CardDescription>Oylik daromad</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                18 500 000 so'm
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
            <div className="space-y-1">
              <CardDescription>Eng ko'p to'lov qilingan kun</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                31 Dekabr
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Payment Types */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
            <div className="space-y-1">
              <CardDescription>Naqd to'lovlar</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                45%
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
            <div className="space-y-1">
              <CardDescription>Karta to'lovlar</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                35%
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
            <div className="space-y-1">
              <CardDescription>Onlayn to'lovlar</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                20%
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Revenue Chart */}
      <div className="mt-6">
        <RevenueChart />
      </div>

      {/* Course and Teacher Statistics with Tabs */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>To'lovlar bo'yicha tafsilotlar</CardTitle>
          <CardDescription>Kurslar va o'qituvchilar bo'yicha batafsil statistika</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Kurslar bo'yicha to'lovlar
              </TabsTrigger>
              <TabsTrigger value="teachers" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                O'qituvchilar bo'yicha tushum
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Jami daromad</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalCourseRevenue)} so'm
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {revenueByCourse.length} ta kurs
                </div>
              </div>

              {revenueByCourse.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Hech qanday to'lov topilmadi
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">#</TableHead>
                        <TableHead className="font-semibold">Kurs nomi</TableHead>
                        <TableHead className="font-semibold text-right">Talabalar soni</TableHead>
                        <TableHead className="font-semibold text-right">To'lovlar soni</TableHead>
                        <TableHead className="font-semibold text-right">Jami daromad</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revenueByCourse.map((course, index) => (
                        <TableRow key={course.name} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{course.name}</TableCell>
                          <TableCell className="text-right">{course.studentCount}</TableCell>
                          <TableCell className="text-right">{course.paymentCount}</TableCell>
                          <TableCell className="text-right font-semibold text-green-600 tabular-nums">
                            {formatCurrency(course.revenue)} so'm
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="teachers" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Jami daromad</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(totalTeacherRevenue)} so'm
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {revenueByTeacher.length} ta o'qituvchi
                </div>
              </div>

              {revenueByTeacher.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Hech qanday to'lov topilmadi
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">#</TableHead>
                        <TableHead className="font-semibold">O'qituvchi</TableHead>
                        <TableHead className="font-semibold text-right">Kurslar soni</TableHead>
                        <TableHead className="font-semibold text-right">To'lovlar soni</TableHead>
                        <TableHead className="font-semibold">Holati</TableHead>
                        <TableHead className="font-semibold text-right">Jami daromad</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revenueByTeacher.map((teacher, index) => (
                        <TableRow key={teacher.teacherId} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell className="text-right">{teacher.courseCount}</TableCell>
                          <TableCell className="text-right">{teacher.paymentCount}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                teacher.status === "Aktiv"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {teacher.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-purple-600 tabular-nums">
                            {formatCurrency(teacher.revenue)} so'm
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
