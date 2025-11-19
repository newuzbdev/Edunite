"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RevenueChart } from "../../dashboard/ui/revenue-chart"

export default function Statistics() {
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

          {/* Course Statistics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle>Kurslar bo'yicha to'lovlar</CardTitle>
                <CardDescription>Har bir kursdan olingan daromad</CardDescription>
              </CardHeader>
              <div className="space-y-2 p-4">
                <div className="flex justify-between">
                  <span>Frontend kursi</span>
                  <span>8 500 000 so'm</span>
                </div>
                <div className="flex justify-between">
                  <span>Backend kursi</span>
                  <span>6 200 000 so'm</span>
                </div>
                <div className="flex justify-between">
                  <span>Fullstack kursi</span>
                  <span>3 800 000 so'm</span>
                </div>
              </div>
            </Card>

            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle>O'qituvchilar bo'yicha tushum</CardTitle>
                <CardDescription>O'qituvchilardan olingan daromad</CardDescription>
              </CardHeader>
              <div className="space-y-2 p-4">
                <div className="flex justify-between">
                  <span>Akmal O'qituvchi</span>
                  <span>5 200 000 so'm</span>
                </div>
                <div className="flex justify-between">
                  <span>Bobur O'qituvchi</span>
                  <span>4 100 000 so'm</span>
                </div>
                <div className="flex justify-between">
                  <span>Gulnora O'qituvchi</span>
                  <span>3 700 000 so'm</span>
                </div>
              </div>
            </Card>
          </div>
    </div>
  )
}