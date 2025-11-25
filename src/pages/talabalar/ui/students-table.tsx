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
	UserPlus,
	Users,
	Download,
	Upload,
	Search,
	Copy,
	CheckCircle2,
	Filter,
	BookOpen,
	Calendar,
	GraduationCap,
	X,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
	useStudentsStore,
	PAYMENT_STATUS_LABELS_UZ,
	STUDENT_STATUS_LABELS_UZ,
	type PaymentStatus,
	type Student,
	type StudentStatus,
} from "../utils/students-store"
import StudentsDrawer from "./students-drawer"
import { toast } from "sonner"
import { TablePagination } from "@/components/ui/table-pagination"
import { useBranchFilter } from "@/hooks/use-branch-filter"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"

const STUDENT_FILTER_DEFAULTS = {
	course: "all",
	paymentStatus: "all",
	group: "all",
	studentStatus: "all",
	joinedDate: "",
}

export default function StudentsTable() {
	const allStudents = useStudentsStore((state) => state.students)
	const students = useBranchFilter(allStudents as any[])
	const onOpen = useStudentsStore((state) => state.onOpen)
	const deleteStudent = useStudentsStore((state) => state.deleteStudent)
	const navigate = useNavigate()

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [filterSheetOpen, setFilterSheetOpen] = useState(false)
	const [filterState, setFilterState] = useState({ ...STUDENT_FILTER_DEFAULTS })
	const [activeFilters, setActiveFilters] = useState<
		Array<{ id: string; type: string; label: string; value: string }>
	>([])

	const handleEdit = useCallback(
		(student: Student) => {
			onOpen(student)
		},
		[onOpen]
	)

	const handleView = useCallback(
		(student: Student) => {
			navigate(`/talabalar/${student.id}`)
		},
		[navigate]
	)

	const handleDeleteClick = useCallback((student: Student) => {
		setStudentToDelete(student)
		setDeleteDialogOpen(true)
	}, [])

	const handleConfirmDelete = useCallback(() => {
		if (!studentToDelete) return

		deleteStudent(studentToDelete.id)
		toast.success("Talaba muvaffaqiyatli o'chirildi")
		setDeleteDialogOpen(false)
		setStudentToDelete(null)
	}, [deleteStudent, studentToDelete])

	const handlePhoneCopy = useCallback((phone: string) => {
		navigator.clipboard.writeText(phone)
		toast.success("Telefon raqami nusxalandi")
	}, [])

	// Get unique courses, groups for filters
	const uniqueCourses = useMemo(() => {
		const courses = new Set<string>()
		students.forEach((s) => s.courses.forEach((c: { name: string }) => courses.add(c.name)))
		return Array.from(courses)
	}, [students])

	const uniqueGroups = useMemo(() => {
		const groups = new Set<string>()
		students.forEach((s) => groups.add(s.group))
		return Array.from(groups)
	}, [students])

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

		if (filterState.paymentStatus !== "all") {
			newFilters.push({
				id: `paymentStatus-${filterState.paymentStatus}`,
				type: "paymentStatus",
				value: filterState.paymentStatus,
				label:
					PAYMENT_STATUS_LABELS_UZ[filterState.paymentStatus as PaymentStatus] ?? filterState.paymentStatus,
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

		if (filterState.studentStatus !== "all") {
			newFilters.push({
				id: `studentStatus-${filterState.studentStatus}`,
				type: "studentStatus",
				value: filterState.studentStatus,
				label:
					STUDENT_STATUS_LABELS_UZ[filterState.studentStatus as StudentStatus] ?? filterState.studentStatus,
			})
		}

		if (filterState.joinedDate) {
			newFilters.push({
				id: `joined-${filterState.joinedDate}`,
				type: "joinedDate",
				value: filterState.joinedDate,
				label: new Date(filterState.joinedDate).toLocaleDateString("uz-UZ"),
			})
		}

		setActiveFilters(newFilters)
		setFilterSheetOpen(false)
	}, [filterState])

	const handleClearFilters = useCallback(() => {
		setFilterState({ ...STUDENT_FILTER_DEFAULTS })
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
				case "paymentStatus":
					setFilterState((prev) => ({ ...prev, paymentStatus: "all" }))
					break
				case "group":
					setFilterState((prev) => ({ ...prev, group: "all" }))
					break
				case "studentStatus":
					setFilterState((prev) => ({ ...prev, studentStatus: "all" }))
					break
				case "joinedDate":
					setFilterState((prev) => ({ ...prev, joinedDate: "" }))
					break
			}
		},
		[activeFilters],
	)

	const handleResetFilters = useCallback(() => {
		setSearchQuery("")
		handleClearFilters()
	}, [handleClearFilters])

	// Filter students
	const filteredStudents = useMemo(() => {
		return students.filter((student) => {
			if (
				searchQuery &&
				!student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!student.phone.includes(searchQuery)
			) {
				return false
			}

			if (filterState.course !== "all" && !student.courses.some((c: { name: string }) => c.name === filterState.course)) {
				return false
			}

			if (filterState.paymentStatus !== "all" && student.paymentStatus !== filterState.paymentStatus) {
				return false
			}

			if (filterState.group !== "all" && student.group !== filterState.group) {
				return false
			}

			if (filterState.studentStatus !== "all" && student.status !== filterState.studentStatus) {
				return false
			}

			if (filterState.joinedDate && student.joinedDate !== filterState.joinedDate) {
				return false
			}

			return true
		})
	}, [students, searchQuery, filterState])

	const columns = useMemo<ColumnDef<Student, unknown>[]>(
		() => [
			{
				id: "rowNumber",
				header: "#",
				cell: (info) => <span className="text-muted-foreground">{info.row.index + 1}</span>,
				enableSorting: false,
			},
			{
				accessorKey: "fullName",
				header: "Ism Familiya",
				cell: (info) => {
					const student = info.row.original
					return (
						<button
							onClick={() => handleView(student)}
							className="cursor-pointer text-left hover:underline font-medium"
						>
							{student.fullName}
						</button>
					)
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
								onClick={() => handlePhoneCopy(phone)}
								className="text-muted-foreground hover:text-foreground"
								title="Nusxalash"
							>
								<Copy className="h-4 w-4" />
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
				accessorKey: "group",
				header: "Guruh",
			},
			{
				accessorKey: "paymentStatus",
				header: "To'lov statusi",
				cell: (info) => {
					const status = info.getValue() as PaymentStatus
					const statusColors = {
						paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
						debt: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
						deadline_near: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
					}
					return (
						<Badge className={statusColors[status]}>
							{PAYMENT_STATUS_LABELS_UZ[status]}
						</Badge>
					)
				},
			},
			{
				accessorKey: "nextPaymentDate",
				header: "Keyingi to'lov sanasi",
				cell: (info) => {
					const date = info.getValue() as string
					return date ? new Date(date).toLocaleDateString("uz-UZ") : "-"
				},
			},
			{
				id: "actions",
				header: "Amallar",
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
								<DropdownMenuItem onClick={() => handleView(row)} className="cursor-pointer">
									Ko'rish
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleEdit(row)} className="cursor-pointer">
									Tahrirlash
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleDeleteClick(row)}
									className="cursor-pointer text-destructive"
								>
									O'chirish
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)
				},
			},
		],
		[handleEdit, handleView, handleDeleteClick, handlePhoneCopy]
	)

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	})

	const table = useReactTable({
		data: filteredStudents,
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
			total: students.length,
			paid: students.filter((s) => s.paymentStatus === "paid").length,
			debt: students.filter((s) => s.paymentStatus === "debt").length,
			deadlineNear: students.filter((s) => s.paymentStatus === "deadline_near").length,
		}
	}, [students])

	const handleExport = useCallback(() => {
		const csv = [
			["Ism Familiya", "Telefon", "Kurs", "Guruh", "To'lov statusi", "Keyingi to'lov sanasi"].join(","),
			...filteredStudents.map((s) =>
				[
					s.fullName,
					s.phone,
				s.courses.map((c: { name: string }) => c.name).join("; "),
				s.group,
				PAYMENT_STATUS_LABELS_UZ[s.paymentStatus as keyof typeof PAYMENT_STATUS_LABELS_UZ],
					s.nextPaymentDate,
				].join(",")
			),
		].join("\n")

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
		const link = document.createElement("a")
		link.href = URL.createObjectURL(blob)
		link.download = `talabalar_${new Date().toISOString().split("T")[0]}.csv`
		link.click()
		toast.success("CSV fayl yuklab olindi")
	}, [filteredStudents])

	const handleImport = useCallback(() => {
		// Placeholder for import functionality
		toast.info("Import funksiyasi tez orada qo'shiladi")
	}, [])

	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<Card className="shadow-xs">
						<CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
							<div className="space-y-1">
								<CardDescription>Jami talabalar</CardDescription>
								<CardTitle className="text-2xl font-semibold tabular-nums">
									{summaryCounts.total}
								</CardTitle>
							</div>
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Users className="h-5 w-5" />
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
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
								<CheckCircle2 className="h-5 w-5" />
							</div>
						</CardHeader>
					</Card>
					<Card className="shadow-xs">
						<CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
							<div className="space-y-1">
								<CardDescription>Qarzdor</CardDescription>
								<CardTitle className="text-2xl font-semibold tabular-nums">
									{summaryCounts.debt}
								</CardTitle>
							</div>
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
								<Users className="h-5 w-5" />
							</div>
						</CardHeader>
					</Card>
					<Card className="shadow-xs">
						<CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
							<div className="space-y-1">
								<CardDescription>Deadline yaqin</CardDescription>
								<CardTitle className="text-2xl font-semibold tabular-nums">
									{summaryCounts.deadlineNear}
								</CardTitle>
							</div>
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
								<Users className="h-5 w-5" />
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
							placeholder="Ism, telefon bo'yicha qidirish..."
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
							<UserPlus className="mr-2 h-4 w-4" />
							Talaba qo'shish
						</Button>
					</div>
				</div>

				{activeFilters.length > 0 && (
					<div className="flex flex-wrap items-center gap-2">
						{activeFilters.map((filter) => (
							<Badge key={filter.id} variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm bg-white">
								<span className="font-medium">
									{filter.type === "course" && "Kurs: "}
									{filter.type === "paymentStatus" && "To'lov: "}
									{filter.type === "group" && "Guruh: "}
									{filter.type === "studentStatus" && "Status: "}
									{filter.type === "joinedDate" && "Qo'shilgan sana: "}
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
								<SheetTitle className="text-2xl font-bold tracking-tight">Talabalar filtrlari</SheetTitle>
								<SheetDescription className="text-sm text-muted-foreground mt-2">
									Kerakli talabalar guruhini topish uchun parametrlarni belgilang.
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
												Qaysi kurs talabalarini ko'rsatishni tanlang
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
												To'lov holati
											</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												To'lov bo'yicha holatini tanlang
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Select
												value={filterState.paymentStatus}
												onValueChange={(value) => setFilterState((prev) => ({ ...prev, paymentStatus: value }))}
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
													<Users className="h-4 w-4" />
												</div>
												Guruhlar
											</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												Konkret guruhni ko'rsatish
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
													<GraduationCap className="h-4 w-4" />
												</div>
												Talaba statusi
											</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												Aktiv, tugagan yoki qarzdor holatini tanlang
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Select
												value={filterState.studentStatus}
												onValueChange={(value) => setFilterState((prev) => ({ ...prev, studentStatus: value }))}
											>
												<SelectTrigger className="bg-background">
													<SelectValue placeholder="Barcha statuslar" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">Barcha statuslar</SelectItem>
													{Object.entries(STUDENT_STATUS_LABELS_UZ).map(([key, label]) => (
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
												Qo'shilgan sana
											</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												Talaba tizimga qo'shilgan sanani tanlang
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Input
												type="date"
												value={filterState.joinedDate}
												onChange={(e) => setFilterState((prev) => ({ ...prev, joinedDate: e.target.value }))}
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
										Hech qanday talabalar mavjud emas
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

			<StudentsDrawer />

			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Talabani o'chirish</DialogTitle>
						<DialogDescription>
							&quot;{studentToDelete?.fullName}&quot; ni o'chirishni xohlaysizmi? Bu amalni qaytarib
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

