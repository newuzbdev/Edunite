"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock, Eye } from "lucide-react"
import { usePaymentsStore } from "@/pages/payments/utils/payments-store"
import { useBranchFilter } from "@/hooks/use-branch-filter"
import { useMemo } from "react"

function getStatusBadge(status: "success" | "failed" | "pending") {
  switch (status) {
    case "success":
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle2 className="size-3 mr-1" />
          Muvaffaqiyatli
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="outline" className="text-red-600 border-red-600">
          <XCircle className="size-3 mr-1" />
          Xatolik
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          <Clock className="size-3 mr-1" />
          Kutilmoqda
        </Badge>
      )
  }
}

export function LatestPayments() {
  const allPayments = usePaymentsStore((state) => state.payments)
  const payments = useBranchFilter(allPayments as any[])
  
  // Get latest 10 payments
  const latestPayments = useMemo(() => {
    return payments
      .filter((p: any) => p.status === 'paid')
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map((p: any) => ({
        id: p.id,
        studentName: p.studentName,
        amount: p.amount,
        date: p.date,
        status: "success" as const
      }))
  }, [payments])

  return (
    <Card>
      <CardHeader>
        <CardTitle>So'nggi to'lovlar</CardTitle>
        <CardDescription>So'nggi 10 ta to'lov ro'yxati (pul oqimini kuzatish uchun)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Talaba ismi</TableHead>
                <TableHead>To'lov summasi</TableHead>
                <TableHead>Sana</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestPayments.length > 0 ? (
                latestPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.studentName}</TableCell>
                    <TableCell>{payment.amount.toLocaleString()} so'm</TableCell>
                    <TableCell>
                      {new Date(payment.date).toLocaleDateString("uz-UZ", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => {
                          // Handle view action - you can add navigation or modal here
                          console.log("View payment:", payment.id)
                        }}
                        title="To'lovni ko'rish"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    To'lovlar mavjud emas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}




