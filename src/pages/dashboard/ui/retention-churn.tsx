"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, TrendingDown, RefreshCw } from "lucide-react"

// Placeholder component for Phase 2
export function RetentionChurn() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saqlanish va tushish statistikasi</CardTitle>
        <CardDescription>Faza 2 - Tez orada qo'shiladi</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2 p-4 border rounded-lg border-dashed">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">O'rtacha saqlanish</p>
            </div>
            <p className="text-2xl font-bold text-muted-foreground">-</p>
            <p className="text-xs text-muted-foreground">
              Talaba o'rtacha necha oy davomida o'qiydi
            </p>
          </div>

          <div className="space-y-2 p-4 border rounded-lg border-dashed">
            <div className="flex items-center gap-2">
              <TrendingDown className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Tushish darajasi</p>
            </div>
            <p className="text-2xl font-bold text-muted-foreground">-</p>
            <p className="text-xs text-muted-foreground">
              Ketgan talabalar foizi
            </p>
          </div>

          <div className="space-y-2 p-4 border rounded-lg border-dashed">
            <div className="flex items-center gap-2">
              <RefreshCw className="size-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Qaytgan talabalar</p>
            </div>
            <p className="text-2xl font-bold text-muted-foreground">-</p>
            <p className="text-xs text-muted-foreground">
              Qayta ro'yxatdan o'tgan talabalar foizi
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}




