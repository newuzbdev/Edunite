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
	UserPlus,
	Users,
	Download,
	Upload,
	Search,
	Copy,
	CheckCircle2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useStudentsStore, PAYMENT_STATUS_LABELS_UZ, type Student, type PaymentStatus } from "../utils/students-store"
import StudentsDrawer from "./students-drawer"
import { toast } from "sonner"

export default function StudentsTable() {
	const students = useStudentsStore((state) => state.students)
	const onOpen = useStudentsStore((state) => state.onOpen)
	const deleteStudent = useStudentsStore((state) => state.deleteStudent)
	const navigate = useNavigate()

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [courseFilter, setCourseFilter] = useState<string>("all")
	const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all")
	const [groupFilter, setGroupFilter] = useState<string>("all")
	const [dateFilter, setDateFilter] = useState<string>("")

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
		students.forEach((s) => s.courses.forEach((c) => courses.add(c.name)))
		return Array.from(courses)
	}, [students])

	const uniqueGroups = useMemo(() => {
		const groups = new Set<string>()
		students.forEach((s) => groups.add(s.group))
		return Array.from(groups)
	}, [students])

	// Filter students
	const filteredStudents = useMemo(() => {
		return students.filter((student) => {
			// Search filter
			if (
				searchQuery &&
				!student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!student.phone.includes(searchQuery)
			) {
				return false
			}

			// Course filter
			if (courseFilter !== "all" && !student.courses.some((c) => c.name === courseFilter)) {
				return false
			}

			// Payment status filter
			if (paymentStatusFilter !== "all" && student.paymentStatus !== paymentStatusFilter) {
				return false
			}

			// Group filter
			if (groupFilter !== "all" && student.group !== groupFilter) {
				return false
			}

			// Date filter
			if (dateFilter && student.joinedDate !== dateFilter) {
				return false
			}

			return true
		})
	}, [students, searchQuery, courseFilter, paymentStatusFilter, groupFilter, dateFilter])

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
					s.courses.map((c) => c.name).join("; "),
					s.group,
					PAYMENT_STATUS_LABELS_UZ[s.paymentStatus],
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
		<div className="flex w-full min-w-0 flex-col gap-4">
			<div className="flex flex-col gap-3 px-4 lg:px-6">
				<h2 className="text-lg font-semibold">Talabalar</h2>
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
			</div>

			{/* Search and Filters */}
			<div className="flex flex-col gap-6 px-4 lg:px-6 mt-6">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
					<div className="relative flex-1 w-full md:max-w-md">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Ism, telefon bo'yicha qidirish..."
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
							<UserPlus className="mr-2 h-4 w-4" />
							Talaba qo'shish
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<div className="space-y-2">
						<Label className="text-sm font-medium">Kurslar bo'yicha filter</Label>
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
						<Label className="text-sm font-medium">To'lov statusi</Label>
						<Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
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
						<Label className="text-sm font-medium">Guruh bo'yicha filter</Label>
						<Select value={groupFilter} onValueChange={setGroupFilter}>
							<SelectTrigger className="w-full">
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
					</div>

					<div className="space-y-2">
						<Label className="text-sm font-medium">Sana bo'yicha filter</Label>
						<Input
							type="date"
							value={dateFilter}
							onChange={(e) => setDateFilter(e.target.value)}
							placeholder="Qo'shilgan sana"
							className="w-full"
						/>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="px-4 lg:px-6 mt-6">
				<div className="overflow-hidden rounded-lg border">
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

