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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import {
	MoreVertical,
	Plus,
	Download,
	Upload,
	Search,
	Eye,
	Edit,
	Trash2,
	Filter,
	Calendar,
	CreditCard,
	BookOpen,
	CheckCircle2,
	X,
} from "lucide-react"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import type { ChangeEvent } from "react"

const PAYMENT_FILTER_DEFAULTS = {
	paymentType: "all",
	course: "all",
	status: "all",
	date: "",
	amountMin: "",
	amountMax: "",
}
import { usePaymentsStore, PAYMENT_STATUS_LABELS_UZ, PAYMENT_TYPE_LABELS_UZ, type PaymentRecord, type PaymentStatus, type PaymentType } from "../utils/payments-store"
import PaymentsDrawer from "./payments-drawer"
import { toast } from "sonner"
import { TablePagination } from "@/components/ui/table-pagination"

export default function PaymentsTable() {
  const payments = usePaymentsStore((state) => state.payments)
  const onOpen = usePaymentsStore((state) => state.onOpen)
  const deletePayment = usePaymentsStore((state) => state.deletePayment)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState<PaymentRecord | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
	const [filterSheetOpen, setFilterSheetOpen] = useState(false)
	const [filterState, setFilterState] = useState({ ...PAYMENT_FILTER_DEFAULTS })
	const [activeFilters, setActiveFilters] = useState<
		Array<{ id: string; type: string; label: string; value: string }>
	>([])

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

	const handleApplyFilters = useCallback(() => {
		const newFilters: Array<{ id: string; type: string; label: string; value: string }> = []

		if (filterState.paymentType !== "all") {
			newFilters.push({
				id: `paymentType-${filterState.paymentType}`,
				type: "paymentType",
				value: filterState.paymentType,
				label: PAYMENT_TYPE_LABELS_UZ[filterState.paymentType as PaymentType] ?? filterState.paymentType,
			})
		}

		if (filterState.course !== "all") {
			newFilters.push({
				id: `course-${filterState.course}`,
				type: "course",
				value: filterState.course,
				label: filterState.course,
			})
		}

		if (filterState.status !== "all") {
			newFilters.push({
				id: `status-${filterState.status}`,
				type: "status",
				value: filterState.status,
				label: PAYMENT_STATUS_LABELS_UZ[filterState.status as PaymentStatus] ?? filterState.status,
			})
		}

		if (filterState.date) {
			newFilters.push({
				id: `date-${filterState.date}`,
				type: "date",
				value: filterState.date,
				label: new Date(filterState.date).toLocaleDateString("uz-UZ"),
			})
		}

		if (filterState.amountMin || filterState.amountMax) {
			newFilters.push({
				id: `amount-${filterState.amountMin}-${filterState.amountMax}`,
				type: "amount",
				value: `${filterState.amountMin}-${filterState.amountMax}`,
				label: `${filterState.amountMin || "0"} - ${filterState.amountMax || "∞"} so'm`,
			})
		}

		setActiveFilters(newFilters)
		setFilterSheetOpen(false)
	}, [filterState])

	const handleClearFilters = useCallback(() => {
		setFilterState({ ...PAYMENT_FILTER_DEFAULTS })
		setActiveFilters([])
	}, [])

	const handleRemoveFilter = useCallback(
		(filterId: string) => {
			const target = activeFilters.find((filter) => filter.id === filterId)
			if (!target) return

			setActiveFilters((prev) => prev.filter((filter) => filter.id !== filterId))

			switch (target.type) {
				case "paymentType":
					setFilterState((prev) => ({ ...prev, paymentType: "all" }))
					break
				case "course":
					setFilterState((prev) => ({ ...prev, course: "all" }))
					break
				case "status":
					setFilterState((prev) => ({ ...prev, status: "all" }))
					break
				case "date":
					setFilterState((prev) => ({ ...prev, date: "" }))
					break
				case "amount":
					setFilterState((prev) => ({ ...prev, amountMin: "", amountMax: "" }))
					break
			}
		},
		[activeFilters],
	)

	const handleResetFilters = useCallback(() => {
		setSearchQuery("")
		handleClearFilters()
	}, [handleClearFilters])

	// Filter payments
	const filteredPayments = useMemo(() => {
		return payments.filter((payment) => {
			if (
				searchQuery &&
				!payment.studentName.toLowerCase().includes(searchQuery.toLowerCase())
			) {
				return false
			}

			if (filterState.paymentType !== "all" && payment.paymentType !== filterState.paymentType) {
				return false
			}

			if (filterState.course !== "all" && payment.course !== filterState.course) {
				return false
			}

			if (filterState.status !== "all" && payment.status !== filterState.status) {
				return false
			}

			if (filterState.date && payment.date !== filterState.date) {
				return false
			}

			if (filterState.amountMin && payment.amount < Number(filterState.amountMin)) {
				return false
			}

			if (filterState.amountMax && payment.amount > Number(filterState.amountMax)) {
				return false
			}

			return true
		})
	}, [payments, searchQuery, filterState])

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
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="relative flex-1 w-full lg:max-w-xl">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Talaba ismi bo'yicha qidirish..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9 w-full bg-white shadow-sm"
						/>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						{(activeFilters.length > 0 || searchQuery) && (
							<Button variant="outline" size="sm" onClick={handleResetFilters} className="cursor-pointer">
								Tozalash
							</Button>
						)}
						<Button
							variant="outline"
							size="sm"
							onClick={() => setFilterSheetOpen(true)}
							className="cursor-pointer"
						>
							<Filter className="mr-2 h-4 w-4" />
							Barcha Filterlar
						</Button>
						<Button variant="outline" size="sm" onClick={handleImport} className="cursor-pointer">
							<Upload className="mr-2 h-4 w-4" />
							Import
						</Button>
						<Button variant="outline" size="sm" onClick={handleExport} className="cursor-pointer">
							<Download className="mr-2 h-4 w-4" />
							Export
						</Button>
						<Button size="sm" onClick={() => onOpen()} className="cursor-pointer">
							<Plus className="mr-2 h-4 w-4" />
							To'lov qo'shish
						</Button>
					</div>
				</div>

				{activeFilters.length > 0 && (
					<div className="flex flex-wrap items-center gap-2">
						{activeFilters.map((filter) => (
							<Badge key={filter.id} variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm bg-white">
								<span className="font-medium">
									{filter.type === "paymentType" && "To'lov turi: "}
									{filter.type === "course" && "Kurs: "}
									{filter.type === "status" && "Status: "}
									{filter.type === "date" && "Sana: "}
									{filter.type === "amount" && "Summasi: "}
								</span>
								<span>{filter.label}</span>
								<button
									onClick={() => handleRemoveFilter(filter.id)}
									className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						))}
					</div>
				)}

				<Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
					<SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
						<div className="flex flex-col h-full">
							<SheetHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-b from-background to-muted/20">
								<SheetTitle className="text-2xl font-bold tracking-tight">Kengaytirilgan Filterlar</SheetTitle>
								<SheetDescription className="text-sm text-muted-foreground mt-2">
									Aniqroq natija olish uchun quyidagi parametrlarni sozlang.
								</SheetDescription>
							</SheetHeader>

							<div className="flex-1 overflow-y-auto px-6 py-6">
								<div className="flex flex-col gap-6">
									<Card className="border shadow-sm">
										<CardHeader className="pb-3">
											<CardTitle className="text-base font-semibold flex items-center gap-2">
												<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
													<CreditCard className="h-4 w-4" />
												</div>
												To'lov turi
											</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												To'lov manbasi yoki usulini tanlang
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Select
												value={filterState.paymentType}
												onValueChange={(value) => setFilterState((prev) => ({ ...prev, paymentType: value }))}
											>
												<SelectTrigger className="bg-background">
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
										</CardContent>
									</Card>

									<Card className="border shadow-sm">
										<CardHeader className="pb-3">
											<CardTitle className="text-base font-semibold flex items-center gap-2">
												<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
													<BookOpen className="h-4 w-4" />
												</div>
												Kurs
											</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												Ma'lum bir kursni tanlang
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Select
												value={filterState.course}
												onValueChange={(value) => setFilterState((prev) => ({ ...prev, course: value }))}
											>
												<SelectTrigger className="bg-background">
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
										</CardContent>
									</Card>

									<Card className="border shadow-sm">
										<CardHeader className="pb-3">
											<CardTitle className="text-base font-semibold flex items-center gap-2">
												<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
													<CheckCircle2 className="h-4 w-4" />
												</div>
												Status
											</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												To'lov holatini tanlang
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Select
												value={filterState.status}
												onValueChange={(value) => setFilterState((prev) => ({ ...prev, status: value }))}
											>
												<SelectTrigger className="bg-background">
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
										</CardContent>
									</Card>

									<Card className="border shadow-sm">
										<CardHeader className="pb-3">
											<CardTitle className="text-base font-semibold flex items-center gap-2">
												<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
													<Calendar className="h-4 w-4" />
												</div>
												Sana va summa
											</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												To'lov sanasi yoki summasi bo'yicha filterlang
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="space-y-2">
												<label className="text-sm font-medium">To'lov sanasi</label>
												<Input
													type="date"
													value={filterState.date}
													onChange={(event: ChangeEvent<HTMLInputElement>) =>
														setFilterState((prev) => ({ ...prev, date: event.target.value }))
													}
													className="bg-background"
												/>
											</div>
											<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
												<Input
													type="number"
													min={0}
													placeholder="Minimal summa"
													value={filterState.amountMin}
													onChange={(event: ChangeEvent<HTMLInputElement>) =>
														setFilterState((prev) => ({ ...prev, amountMin: event.target.value }))
													}
													className="bg-background"
												/>
												<Input
													type="number"
													min={0}
													placeholder="Maksimal summa"
													value={filterState.amountMax}
													onChange={(event: ChangeEvent<HTMLInputElement>) =>
														setFilterState((prev) => ({ ...prev, amountMax: event.target.value }))
													}
													className="bg-background"
												/>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>

							<SheetFooter className="px-6 py-4 border-t bg-muted/30 flex flex-row items-center justify-between gap-3">
								<Button variant="outline" onClick={handleClearFilters} className="cursor-pointer hover:bg-muted">
									Tozalash
								</Button>
								<div className="flex items-center gap-3">
									<Button
										variant="ghost"
										onClick={() => setFilterSheetOpen(false)}
										className="cursor-pointer text-muted-foreground hover:text-foreground"
									>
										Bekor qilish
									</Button>
									<Button onClick={handleApplyFilters} className="cursor-pointer shadow-sm hover:shadow-md transition-shadow">
										Natijalarni ko'rsatish
									</Button>
								</div>
							</SheetFooter>
						</div>
					</SheetContent>
				</Sheet>

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
              <div className="flex items-center justify-end py-4">
                <TablePagination table={table} />
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