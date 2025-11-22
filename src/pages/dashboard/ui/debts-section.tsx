"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Calendar, DollarSign } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

// Mock data - replace with actual data
const debtsData = {
  upcomingDeadlines: 12,
  debtors: 8,
  totalDebt: 4200000
}

export function DebtsSection() {
  const navigate = useNavigate()

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            To'lov muddati yaqinlashmoqda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{debtsData.upcomingDeadlines}</p>
          <p className="text-sm text-muted-foreground mt-2">
            To'lov muddati yaqinlashayotgan talabalar soni
          </p>
        </CardContent>
      </Card>

      <Card 
        className={cn("cursor-pointer hover:shadow-md transition-shadow")}
        onClick={() => navigate("/payments/debtors")}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="size-5" />
            Qarzdorlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{debtsData.debtors}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Qarzi bor talabalar soni
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="size-5" />
            Jami qarz summasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{debtsData.totalDebt.toLocaleString()} so'm</p>
          <p className="text-sm text-muted-foreground mt-2">
            Barcha qarzdorlarning umumiy qarzi
          </p>
        </CardContent>
      </Card>
    </div>
  )
}


