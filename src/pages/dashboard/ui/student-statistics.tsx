"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, UserPlus, UserMinus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data - replace with actual data
const studentStats = {
  total: 156,
  monthlyGrowth: 12.5,
  newLast7Days: 18,
  left: 5
}

export function StudentStatistics() {
  return (
    <Card className="px-4 lg:px-6">
      <CardHeader>
        <CardTitle>Talabalar statistikasi</CardTitle>
        <CardDescription>Talabalar bo'yicha umumiy ma'lumotlar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Jami talabalar</p>
            </div>
            <p className="text-3xl font-bold">{studentStats.total}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Oylik o'sish</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold">{studentStats.monthlyGrowth}%</p>
              <Badge variant="outline" className="text-green-600">
                <TrendingUp className="size-3" />
                O'smoqda
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserPlus className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Yangi talabalar (7 kun)</p>
            </div>
            <p className="text-3xl font-bold">{studentStats.newLast7Days}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserMinus className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Ketgan talabalar</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold">{studentStats.left}</p>
              <Badge variant="outline" className="text-red-600">
                <TrendingDown className="size-3" />
                Kamaymoqda
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


