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

// Mock data - replace with actual data
const payments = [
  {
    id: 1,
    studentName: "Ali Valiyev",
    amount: 500000,
    date: "2024-12-31",
    status: "success" as const
  },
  {
    id: 2,
    studentName: "Dilshod Karimov",
    amount: 450000,
    date: "2024-12-30",
    status: "success" as const
  },
  {
    id: 3,
    studentName: "Sardor Toshmatov",
    amount: 600000,
    date: "2024-12-30",
    status: "pending" as const
  },
  {
    id: 4,
    studentName: "Olimjon Rahimov",
    amount: 550000,
    date: "2024-12-29",
    status: "success" as const
  },
  {
    id: 5,
    studentName: "Javohir Ismoilov",
    amount: 480000,
    date: "2024-12-29",
    status: "failed" as const
  },
  {
    id: 6,
    studentName: "Bobur Aliyev",
    amount: 520000,
    date: "2024-12-28",
    status: "success" as const
  },
  {
    id: 7,
    studentName: "Farhod Usmonov",
    amount: 470000,
    date: "2024-12-28",
    status: "success" as const
  },
  {
    id: 8,
    studentName: "Shohruh Toshmatov",
    amount: 510000,
    date: "2024-12-27",
    status: "pending" as const
  },
  {
    id: 9,
    studentName: "Azizbek Karimov",
    amount: 490000,
    date: "2024-12-27",
    status: "success" as const
  },
  {
    id: 10,
    studentName: "Jasur Valiyev",
    amount: 530000,
    date: "2024-12-26",
    status: "success" as const
  },
]

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
  return (
    <Card className="px-4 lg:px-6">
      <CardHeader>
        <CardTitle>So'nggi to'lovlar</CardTitle>
        <CardDescription>So'nggi 10 ta to'lov ro'yxati (pul oqimini kuzatish uchun)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
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
              {payments.map((payment) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}



