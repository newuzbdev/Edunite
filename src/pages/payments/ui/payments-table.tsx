"use client"

import { useCallback, useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from "@tanstack/react-table"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  MoreVertical,
  Plus,
  Download,
  Upload,
  Search,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { usePaymentsStore, PAYMENT_STATUS_LABELS_UZ, PAYMENT_TYPE_LABELS_UZ, type PaymentRecord, type PaymentStatus, type PaymentType } from "../utils/payments-store"
import PaymentsDrawer from "./payments-drawer"
import { toast } from "sonner"

export default function PaymentsTable() {
  const payments = usePaymentsStore((state) => state.payments)
  const onOpen = usePaymentsStore((state) => state.onOpen)
  const deletePayment = usePaymentsStore((state) => state.deletePayment)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState<PaymentRecord | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>("all")
  const [courseFilter, setCourseFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")

  const handleEdit = useCallback(
    (payment: PaymentRecord) => {
      onOpen(payment)
    },
    [onOpen]
  )

  const handleViewReceipt = useCallback((receipt?: string) => {
    if (receipt) {
      toast.info(`Chek: ${receipt}`)
    } else {
      toast.error("Chek mavjud emas")
    }
  }, [])

  const handleDeleteClick = useCallback((payment: PaymentRecord) => {
    setPaymentToDelete(payment)
    setDeleteDialogOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (!paymentToDelete) return

    deletePayment(paymentToDelete.id)
    toast.success("To'lov muvaffaqiyatli o'chirildi")
    setDeleteDialogOpen(false)
    setPaymentToDelete(null)
  }, [deletePayment, paymentToDelete])

  // Get unique courses for filters
  const uniqueCourses = useMemo(() => {
    const courses = new Set<string>()
    payments.forEach((p) => courses.add(p.course))
    return Array.from(courses)
  }, [payments])

  // Filter payments
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // Search filter
      if (
        searchQuery &&
        !payment.studentName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Payment type filter
      if (paymentTypeFilter !== "all" && payment.paymentType !== paymentTypeFilter) {
        return false
      }

      // Course filter
      if (courseFilter !== "all" && payment.course !== courseFilter) {
        return false
      }

      // Status filter
      if (statusFilter !== "all" && payment.status !== statusFilter) {
        return false
      }

      // Date filter
      if (dateFilter && payment.date !== dateFilter) {
        return false
      }

      return true
    })
  }, [payments, searchQuery, paymentTypeFilter, courseFilter, statusFilter, dateFilter])

  const columns = useMemo<ColumnDef<PaymentRecord, unknown>[]>(() => [
    {
      id: "rowNumber",
      header: "#",
      cell: (info) => <span className="text-muted-foreground">{info.row.index + 1}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "studentName",
      header: "Talaba",
      cell: (info) => {
        const name = info.getValue() as string
        return <span className="font-medium">{name}</span>
      },
    },
    {
      accessorKey: "course",
      header: "Kurs",
    },
    {
      accessorKey: "paymentType",
      header: "To'lov turi",
      cell: (info) => {
        const type = info.getValue() as PaymentType
        return <Badge variant="outline">{PAYMENT_TYPE_LABELS_UZ[type]}</Badge>
      },
    },
    {
      accessorKey: "amount",
      header: "Summasi",
      cell: (info) => {
        const amount = info.getValue() as number
        return <span>{amount.toLocaleString()} so'm</span>
      },
    },
    {
      accessorKey: "date",
      header: "Sana",
      cell: (info) => {
        const date = info.getValue() as string
        return new Date(date).toLocaleDateString("uz-UZ")
      },
    },
    {
      accessorKey: "operator",
      header: "Operator",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as PaymentStatus
        const statusColors = {
          paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          refunded: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        }
        return (
          <Badge className={statusColors[status]}>
            {PAYMENT_STATUS_LABELS_UZ[status]}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Amal",
      cell: (info) => {
        const row = info.row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewReceipt(row.receipt)} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                Chekni ko'rish
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(row)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Tahrirlash
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(row)}
                className="cursor-pointer text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                O'chirish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [handleEdit, handleViewReceipt, handleDeleteClick])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data: filteredPayments,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const summaryCounts = useMemo(() => {
    return {
      total: payments.length,
      paid: payments.filter((p) => p.status === "paid").length,
      refunded: payments.filter((p) => p.status === "refunded").length,
      pending: payments.filter((p) => p.status === "pending").length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    }
  }, [payments])

  const handleExport = useCallback(() => {
    const csv = [
      ["Talaba", "Kurs", "To'lov turi", "Summasi", "Sana", "Operator", "Status"].join(","),
      ...filteredPayments.map((p) =>
        [
          p.studentName,
          p.course,
          PAYMENT_TYPE_LABELS_UZ[p.paymentType],
          p.amount,
          p.date,
          p.operator,
          PAYMENT_STATUS_LABELS_UZ[p.status],
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `tolovlar_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    toast.success("CSV fayl yuklab olindi")
  }, [filteredPayments])

  const handleImport = useCallback(() => {
    toast.info("Import funksiyasi tez orada qo'shiladi")
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
                <div className="space-y-1">
                  <CardDescription>Jami to'lovlar</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {summaryCounts.total}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
                <div className="space-y-1">
                  <CardDescription>To'langan</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {summaryCounts.paid}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
                <div className="space-y-1">
                  <CardDescription>Qaytarilgan</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {summaryCounts.refunded}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
                <div className="space-y-1">
                  <CardDescription>Kutilmoqda</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {summaryCounts.pending}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
                <div className="space-y-1">
                  <CardDescription>Jami summa</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {summaryCounts.totalAmount.toLocaleString()} so'm
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-6 mt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Talaba ismi bo'yicha qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:shrink-0">
                <Button variant="outline" onClick={handleImport} className="cursor-pointer flex-1 md:flex-initial">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button variant="outline" onClick={handleExport} className="cursor-pointer flex-1 md:flex-initial">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button onClick={() => onOpen()} className="cursor-pointer flex-1 md:flex-initial">
                  <Plus className="mr-2 h-4 w-4" />
                  To'lov qo'shish
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">To'lov turi</Label>
                <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Barcha turlar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha turlar</SelectItem>
                    {Object.entries(PAYMENT_TYPE_LABELS_UZ).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Kurs bo'yicha filter</Label>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Barcha kurslar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha kurslar</SelectItem>
                    {uniqueCourses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Barcha statuslar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Barcha statuslar</SelectItem>
                    {Object.entries(PAYMENT_STATUS_LABELS_UZ).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Sana bo'yicha filter</Label>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  placeholder="To'lov sanasi"
                  className="w-full"
                />
              </div>
            </div>

            {/* Table */}
            <div className="mt-6">
              <div className="overflow-hidden rounded-lg border bg-white">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>

                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell className="h-24 text-center" colSpan={columns.length}>
                          Hech qanday to'lovlar mavjud emas
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="cursor-pointer"
                >
                  Oldingi
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="cursor-pointer"
                >
                  Keyingi
                </Button>
              </div>
            </div>
          </div>

      <PaymentsDrawer />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>To'lovni o'chirish</DialogTitle>
            <DialogDescription>
              "{paymentToDelete?.studentName}" uchun to'lovni o'chirishni xohlaysizmi? Bu amalni qaytarib
              bo'lmaydi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="cursor-pointer"
            >
              Bekor qilish
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="cursor-pointer"
            >
              O'chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}