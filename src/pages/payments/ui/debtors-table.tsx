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
import { Label } from "@/components/ui/label"
import {
  MoreVertical,
  Phone,
  MessageSquare,
  Send,
  Plus,
  Download,
	Search,
	Filter,
	BookOpen,
	Users,
	AlertCircle,
	Calendar,
	X,
} from "lucide-react"
import { useStudentsStore, PAYMENT_STATUS_LABELS_UZ, type PaymentStatus, type Student } from "../../talabalar/utils/students-store"
import { usePaymentsStore } from "../utils/payments-store"
import { toast } from "sonner"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"

const DEBTOR_FILTER_DEFAULTS = {
	course: "all",
	group: "all",
	paymentStatus: "all",
	deadline: "",
}

export default function DebtorsTable() {
  const students = useStudentsStore((state) => state.students)
  const onOpenPayment = usePaymentsStore((state) => state.onOpen)

  const [searchQuery, setSearchQuery] = useState("")
	const [filterSheetOpen, setFilterSheetOpen] = useState(false)
	const [filterState, setFilterState] = useState({ ...DEBTOR_FILTER_DEFAULTS })
	const [activeFilters, setActiveFilters] = useState<
		Array<{ id: string; type: string; label: string; value: string }>
	>([])
  const [smsDialogOpen, setSmsDialogOpen] = useState(false)
  const [telegramDialogOpen, setTelegramDialogOpen] = useState(false)
  const [selectedDebtor, setSelectedDebtor] = useState<Student | null>(null)
  const [smsTemplate, setSmsTemplate] = useState("")

  // Filter debtors (students with debt)
	const debtors = useMemo(() => {
		return students.filter((student) => student.paymentStatus === "debt" || student.paymentStatus === "deadline_near")
	}, [students])

  // Get unique courses and groups
  const uniqueCourses = useMemo(() => {
    const courses = new Set<string>()
    debtors.forEach((d) => d.courses.forEach((c) => courses.add(c.name)))
    return Array.from(courses)
  }, [debtors])

  const uniqueGroups = useMemo(() => {
    const groups = new Set<string>()
    debtors.forEach((d) => groups.add(d.group))
    return Array.from(groups)
  }, [debtors])

  // Filter debtors
	const filteredDebtors = useMemo(() => {
		return debtors.filter((debtor) => {
			if (
				searchQuery &&
				!debtor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!debtor.phone.includes(searchQuery)
			) {
				return false
			}

			if (filterState.course !== "all" && !debtor.courses.some((c) => c.name === filterState.course)) {
				return false
			}

			if (filterState.group !== "all" && debtor.group !== filterState.group) {
				return false
			}

			if (filterState.paymentStatus !== "all" && debtor.paymentStatus !== filterState.paymentStatus) {
				return false
			}

			if (filterState.deadline && debtor.nextPaymentDate !== filterState.deadline) {
				return false
			}

			return true
		})
	}, [debtors, searchQuery, filterState])

	const handleApplyFilters = useCallback(() => {
		const newFilters: Array<{ id: string; type: string; label: string; value: string }> = []

		if (filterState.course !== "all") {
			newFilters.push({
				id: `course-${filterState.course}`,
				type: "course",
				value: filterState.course,
				label: filterState.course,
			})
		}

		if (filterState.group !== "all") {
			newFilters.push({
				id: `group-${filterState.group}`,
				type: "group",
				value: filterState.group,
				label: filterState.group,
			})
		}

		if (filterState.paymentStatus !== "all") {
			newFilters.push({
				id: `status-${filterState.paymentStatus}`,
				type: "paymentStatus",
				value: filterState.paymentStatus,
				label:
					PAYMENT_STATUS_LABELS_UZ[filterState.paymentStatus as PaymentStatus] ?? filterState.paymentStatus,
			})
		}

		if (filterState.deadline) {
			newFilters.push({
				id: `deadline-${filterState.deadline}`,
				type: "deadline",
				value: filterState.deadline,
				label: new Date(filterState.deadline).toLocaleDateString("uz-UZ"),
			})
		}

		setActiveFilters(newFilters)
		setFilterSheetOpen(false)
	}, [filterState])

	const handleClearFilters = useCallback(() => {
		setFilterState({ ...DEBTOR_FILTER_DEFAULTS })
		setActiveFilters([])
	}, [])

	const handleRemoveFilter = useCallback(
		(filterId: string) => {
			const filter = activeFilters.find((item) => item.id === filterId)
			if (!filter) return

			setActiveFilters((prev) => prev.filter((item) => item.id !== filterId))

			switch (filter.type) {
				case "course":
					setFilterState((prev) => ({ ...prev, course: "all" }))
					break
				case "group":
					setFilterState((prev) => ({ ...prev, group: "all" }))
					break
				case "paymentStatus":
					setFilterState((prev) => ({ ...prev, paymentStatus: "all" }))
					break
				case "deadline":
					setFilterState((prev) => ({ ...prev, deadline: "" }))
					break
			}
		},
		[activeFilters],
	)

	const handleResetFilters = useCallback(() => {
		setSearchQuery("")
		handleClearFilters()
	}, [handleClearFilters])

  const handleSmsReminder = useCallback((debtor: Student) => {
    setSelectedDebtor(debtor)
    setSmsTemplate(`Assalomu alaykum ${debtor.fullName}. Sizning to'lov muddati tugagan. Iltimos, 150 000 so'm to'lovni amalga oshiring.`)
    setSmsDialogOpen(true)
  }, [])

  const handleTelegramReminder = useCallback((debtor: Student) => {
    setSelectedDebtor(debtor)
    setSmsTemplate(`Assalomu alaykum ${debtor.fullName}. Sizning to'lov muddati tugagan. Iltimos, 150 000 so'm to'lovni amalga oshiring.`)
    setTelegramDialogOpen(true)
  }, [])

  const handleCallLog = useCallback((debtor: Student) => {
    toast.info(`${debtor.fullName} ga qo'ng'iroq qilindi - ${new Date().toLocaleString()}`)
  }, [])

  const handleAddPayment = useCallback((_debtor: Student) => {
    onOpenPayment(null) // Open payment form, but need to pre-select student
    // For now, just open
  }, [onOpenPayment])

  const handleSendSms = useCallback(() => {
    if (selectedDebtor) {
      toast.success(`SMS ${selectedDebtor.fullName} ga yuborildi`)
      setSmsDialogOpen(false)
      setSelectedDebtor(null)
      setSmsTemplate("")
    }
  }, [selectedDebtor])

  const handleSendTelegram = useCallback(() => {
    if (selectedDebtor) {
      toast.success(`Telegram xabari ${selectedDebtor.fullName} ga yuborildi`)
      setTelegramDialogOpen(false)
      setSelectedDebtor(null)
      setSmsTemplate("")
    }
  }, [selectedDebtor])

  const columns = useMemo<ColumnDef<Student, unknown>[]>(() => [
    {
      id: "rowNumber",
      header: "#",
      cell: (info) => <span className="text-muted-foreground">{info.row.index + 1}</span>,
      enableSorting: false,
    },
    {
      accessorKey: "fullName",
      header: "Talaba",
      cell: (info) => {
        const name = info.getValue() as string
        return <span className="font-medium">{name}</span>
      },
    },
    {
      accessorKey: "phone",
      header: "Telefon",
      cell: (info) => {
        const phone = info.getValue() as string
        return (
          <div className="flex items-center gap-2">
            <span>{phone}</span>
            <button
              onClick={() => handleCallLog(info.row.original)}
              className="text-muted-foreground hover:text-foreground"
              title="Qo'ng'iroq qilish"
            >
              <Phone className="h-4 w-4" />
            </button>
          </div>
        )
      },
    },
    {
      accessorKey: "courses",
      header: "Kurs",
      cell: (info) => {
        const courses = info.getValue() as Student["courses"]
        return (
          <div className="flex flex-wrap gap-1">
            {courses.map((course) => (
              <Badge key={course.id} variant="secondary">
                {course.name}
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      id: "debtAmount",
      header: "Qarz miqdori",
      cell: () => <span>150 000 so'm</span>, // Mock data
    },
    {
      id: "deadline",
      header: "Deadline",
      cell: () => <span className="text-red-600">3 kun qoldi 🔥</span>, // Mock data
    },
    {
      id: "lastPayment",
      header: "Oxirgi to'lov",
      cell: () => <span>2024-01-10</span>, // Mock data
    },
    {
      id: "actions",
      header: "Amal",
      cell: (info) => {
        const debtor = info.row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSmsReminder(debtor)} className="cursor-pointer">
                <MessageSquare className="mr-2 h-4 w-4" />
                SMS eslatma
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTelegramReminder(debtor)} className="cursor-pointer">
                <Send className="mr-2 h-4 w-4" />
                Telegram eslatma
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCallLog(debtor)} className="cursor-pointer">
                <Phone className="mr-2 h-4 w-4" />
                Qo'ng'iroq
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddPayment(debtor)} className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                To'lov qo'shish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [handleSmsReminder, handleTelegramReminder, handleCallLog, handleAddPayment])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data: filteredDebtors,
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
      totalDebtors: debtors.length,
      totalDebt: debtors.length * 150000, // Mock calculation
    }
  }, [debtors])

  const handleExport = useCallback(() => {
    const csv = [
      ["Talaba", "Telefon", "Kurs", "Qarz miqdori", "Deadline", "Oxirgi to'lov"].join(","),
      ...filteredDebtors.map((d) =>
        [
          d.fullName,
          d.phone,
          d.courses.map((c) => c.name).join("; "),
          "150000", // Mock
          "3 kun qoldi",
          "2024-01-10",
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `qarzdorlar_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    toast.success("CSV fayl yuklab olindi")
  }, [filteredDebtors])

  return (
		<div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
                <div className="space-y-1">
                  <CardDescription>Jami qarzdorlar</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {summaryCounts.totalDebtors}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
                <div className="space-y-1">
                  <CardDescription>Jami qarzdorlik</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    {summaryCounts.totalDebt.toLocaleString()} so'm
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
                <div className="space-y-1">
                  <CardDescription>O'rtacha qarz</CardDescription>
                  <CardTitle className="text-2xl font-semibold tabular-nums">
                    150 000 so'm
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
                  placeholder="Talaba ismi, telefon bo'yicha qidirish..."
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
						<Button variant="outline" size="sm" onClick={handleExport} className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

				{activeFilters.length > 0 && (
					<div className="flex flex-wrap items-center gap-2">
						{activeFilters.map((filter) => (
							<Badge key={filter.id} variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm bg-white">
								<span className="font-medium">
									{filter.type === "course" && "Kurs: "}
									{filter.type === "group" && "Guruh: "}
									{filter.type === "paymentStatus" && "Status: "}
									{filter.type === "deadline" && "Deadline: "}
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
							<SheetHeader className="px-6 pt-6 pb-4 border-b bg-linear-to-b from-background to-muted/20">
								<SheetTitle className="text-2xl font-bold tracking-tight">Qarzdorlar filtrlari</SheetTitle>
								<SheetDescription className="text-sm text-muted-foreground mt-2">
									Aniqroq natijalar uchun tegishli parametrlarni tanlang.
								</SheetDescription>
							</SheetHeader>

							<div className="flex-1 overflow-y-auto px-6 py-6">
								<div className="flex flex-col gap-6">
									<Card className="border shadow-sm">
										<CardHeader className="pb-3">
											<CardTitle className="text-base font-semibold flex items-center gap-2">
												<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
													<BookOpen className="h-4 w-4" />
												</div>
												Kurslar
											</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												Qaysi kurs qarzdorlarini ko'rsatishni tanlang
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
													<Users className="h-4 w-4" />
												</div>
												Guruhlar
											</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												Muayyan guruhdagi qarzdorlarni ko'ring
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Select
												value={filterState.group}
												onValueChange={(value) => setFilterState((prev) => ({ ...prev, group: value }))}
											>
												<SelectTrigger className="bg-background">
													<SelectValue placeholder="Barcha guruhlar" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">Barcha guruhlar</SelectItem>
													{uniqueGroups.map((group) => (
														<SelectItem key={group} value={group}>
															{group}
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
													<AlertCircle className="h-4 w-4" />
												</div>
												To'lov holati
											</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												Qarzdorlik turini tanlang
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Select
												value={filterState.paymentStatus}
												onValueChange={(value) => setFilterState((prev) => ({ ...prev, paymentStatus: value }))}
											>
												<SelectTrigger className="bg-background">
													<SelectValue placeholder="Barcha holatlar" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">Barcha holatlar</SelectItem>
													<SelectItem value="debt">Qarzdor</SelectItem>
													<SelectItem value="deadline_near">Deadline yaqin</SelectItem>
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
												Deadline
											</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												To'lov muddati bo'yicha saralang
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Input
												type="date"
												value={filterState.deadline}
												onChange={(e) => setFilterState((prev) => ({ ...prev, deadline: e.target.value }))}
												className="bg-background"
											/>
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
                          Hech qanday qarzdorlar mavjud emas
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

      {/* SMS Dialog */}
      <Dialog open={smsDialogOpen} onOpenChange={setSmsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>SMS eslatma yuborish</DialogTitle>
            <DialogDescription>
              {selectedDebtor?.fullName} ga SMS eslatma yuborish
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Matn</Label>
            <Input
              value={smsTemplate}
              onChange={(e) => setSmsTemplate(e.target.value)}
              placeholder="SMS matni"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSmsDialogOpen(false)} className="cursor-pointer">
              Bekor qilish
            </Button>
            <Button onClick={handleSendSms} className="cursor-pointer">
              Yuborish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Telegram Dialog */}
      <Dialog open={telegramDialogOpen} onOpenChange={setTelegramDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Telegram eslatma yuborish</DialogTitle>
            <DialogDescription>
              {selectedDebtor?.fullName} ga Telegram eslatma yuborish
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Matn</Label>
            <Input
              value={smsTemplate}
              onChange={(e) => setSmsTemplate(e.target.value)}
              placeholder="Telegram matni"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTelegramDialogOpen(false)} className="cursor-pointer">
              Bekor qilish
            </Button>
            <Button onClick={handleSendTelegram} className="cursor-pointer">
              Yuborish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}