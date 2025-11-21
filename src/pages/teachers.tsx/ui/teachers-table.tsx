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
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import {
	MoreVertical,
	UserPlus,
	Users,
	Download,
	Upload,
	Search,
	Filter,
	X,
	Trash2,
	Archive,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
	useTeachersStore,
	TEACHER_STATUS_LABELS_UZ,
	WORK_TYPE_LABELS_UZ,
	type Teacher,
	type TeacherStatus,
	type WorkType,
} from "../utils/teachers-store"
import TeachersDrawer from "./teachers-drawer"
import { toast } from "sonner"

const TEACHER_FILTER_DEFAULTS = {
	course: "all",
	status: "all",
	workType: "all",
	workingDay: "all",
}

export default function TeachersTable() {
	const teachers = useTeachersStore((state) => state.teachers)
	const onOpen = useTeachersStore((state) => state.onOpen)
	const deleteTeacher = useTeachersStore((state) => state.deleteTeacher)
	const archiveTeacher = useTeachersStore((state) => state.archiveTeacher)
	const navigate = useNavigate()

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
	const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null)
	const [teacherToArchive, setTeacherToArchive] = useState<Teacher | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [filterSheetOpen, setFilterSheetOpen] = useState(false)
	const [filterState, setFilterState] = useState({ ...TEACHER_FILTER_DEFAULTS })
	const [activeFilters, setActiveFilters] = useState<
		Array<{ id: string; type: string; label: string; value: string }>
	>([])
	const [selectedTeachers, setSelectedTeachers] = useState<string[]>([])

	const handleEdit = useCallback(
		(teacher: Teacher) => {
			onOpen(teacher)
		},
		[onOpen]
	)

	const handleView = useCallback(
		(teacher: Teacher) => {
			navigate(`/teachers/${teacher.id}`)
		},
		[navigate]
	)

	const handleDeleteClick = useCallback((teacher: Teacher) => {
		setTeacherToDelete(teacher)
		setDeleteDialogOpen(true)
	}, [])

	const handleConfirmDelete = useCallback(() => {
		if (!teacherToDelete) return

		deleteTeacher(teacherToDelete.id)
		toast.success("O'qituvchi muvaffaqiyatli o'chirildi")
		setDeleteDialogOpen(false)
		setTeacherToDelete(null)
	}, [deleteTeacher, teacherToDelete])

	const handleArchiveClick = useCallback((teacher: Teacher) => {
		setTeacherToArchive(teacher)
		setArchiveDialogOpen(true)
	}, [])

	const handleConfirmArchive = useCallback(() => {
		if (!teacherToArchive) return

		archiveTeacher(teacherToArchive.id)
		toast.success("O'qituvchi arxivlandi")
		setArchiveDialogOpen(false)
		setTeacherToArchive(null)
	}, [archiveTeacher, teacherToArchive])

	// Get unique courses, work types for filters
	const uniqueCourses = useMemo(() => {
		const courses = new Set<string>()
		teachers.forEach((t) => t.subjects.forEach((s) => courses.add(s.name)))
		return Array.from(courses)
	}, [teachers])

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

		if (filterState.status !== "all") {
			newFilters.push({
				id: `status-${filterState.status}`,
				type: "status",
				value: filterState.status,
				label: TEACHER_STATUS_LABELS_UZ[filterState.status as TeacherStatus],
			})
		}

		if (filterState.workType !== "all") {
			newFilters.push({
				id: `workType-${filterState.workType}`,
				type: "workType",
				value: filterState.workType,
				label: WORK_TYPE_LABELS_UZ[filterState.workType as WorkType],
			})
		}

		if (filterState.workingDay !== "all") {
			newFilters.push({
				id: `workingDay-${filterState.workingDay}`,
				type: "workingDay",
				value: filterState.workingDay,
				label: filterState.workingDay,
			})
		}

		setActiveFilters(newFilters)
		setFilterSheetOpen(false)
	}, [filterState])

	const handleClearFilters = useCallback(() => {
		setFilterState({ ...TEACHER_FILTER_DEFAULTS })
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
				case "status":
					setFilterState((prev) => ({ ...prev, status: "all" }))
					break
				case "workType":
					setFilterState((prev) => ({ ...prev, workType: "all" }))
					break
				case "workingDay":
					setFilterState((prev) => ({ ...prev, workingDay: "all" }))
					break
			}
		},
		[activeFilters],
	)

	const handleResetFilters = useCallback(() => {
		setSearchQuery("")
		handleClearFilters()
	}, [handleClearFilters])

	// Filter teachers
	const filteredTeachers = useMemo(() => {
		return teachers.filter((teacher) => {
			if (
				searchQuery &&
				!teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!teacher.phone.includes(searchQuery)
			) {
				return false
			}

			if (filterState.course !== "all" && !teacher.subjects.some((s) => s.name === filterState.course)) {
				return false
			}

			if (filterState.status !== "all" && teacher.status !== filterState.status) {
				return false
			}

			if (filterState.workType !== "all" && teacher.workType !== filterState.workType) {
				return false
			}

			if (filterState.workingDay !== "all" && !teacher.workingDays.includes(filterState.workingDay)) {
				return false
			}

			return true
		})
	}, [teachers, searchQuery, filterState])

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	})

	const columns = useMemo<ColumnDef<Teacher, unknown>[]>(
		() => [
			{
				id: "rowNumber",
				header: "#",
				cell: (info) => (
					<span className="text-muted-foreground">
						{info.row.index + 1 + pagination.pageIndex * pagination.pageSize}
					</span>
				),
				enableSorting: false,
				size: 50,
			},
			{
				accessorKey: "fullName",
				header: "Ism",
				cell: (info) => {
					const teacher = info.row.original
					return (
						<button
							onClick={() => handleView(teacher)}
							className="cursor-pointer text-left hover:underline font-medium"
						>
							{teacher.fullName}
						</button>
					)
				},
				size: 180,
			},
			{
				accessorKey: "subjects",
				header: "Fanlari / Kurslari",
				cell: (info) => {
					const subjects = info.getValue() as Teacher["subjects"]
					return (
						<div className="flex flex-wrap gap-1">
							{subjects.slice(0, 3).map((subject) => (
								<Badge key={subject.id} variant="secondary" className="text-xs px-2 py-0.5">
									{subject.name}
								</Badge>
							))}
							{subjects.length > 3 && (
								<Badge variant="outline" className="text-xs px-2 py-0.5">
									+{subjects.length - 3}
								</Badge>
							)}
						</div>
					)
				},
				size: 200,
			},
			{
				accessorKey: "workType",
				header: "Maoshi / Stavkasi",
				cell: (info) => {
					const teacher = info.row.original
					if (teacher.workType === "monthly" && teacher.salary) {
						return <span className="font-medium">{teacher.salary.toLocaleString("uz-UZ")} so'm</span>
					}
					if (teacher.workType === "rate" && teacher.rate) {
						return <span className="font-medium">Dars uchun {teacher.rate.toLocaleString("uz-UZ")} so'm</span>
					}
					if (teacher.workType === "percentage" && teacher.percentage) {
						return <span className="font-medium">{teacher.percentage}%</span>
					}
					return <span className="text-muted-foreground">-</span>
				},
				size: 180,
			},
			{
				accessorKey: "attendance",
				header: "Davomat",
				cell: (info) => {
					const attendance = info.getValue() as Teacher["attendance"]
					const percentage = attendance.last30Days
					return (
						<div className="flex items-center gap-2">
							<span className="font-medium">{percentage}%</span>
							<div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
								<div 
									className={`h-full ${
										percentage >= 90 ? 'bg-green-500' : 
										percentage >= 70 ? 'bg-yellow-500' : 
										'bg-red-500'
									}`}
									style={{ width: `${percentage}%` }}
								/>
							</div>
						</div>
					)
				},
				size: 120,
			},
			{
				accessorKey: "groups",
				header: "Guruhlari",
				cell: (info) => {
					const groups = info.getValue() as Teacher["groups"]
					return (
						<Badge variant="outline" className="text-xs">
							{groups.length} ta
						</Badge>
					)
				},
				size: 100,
			},
			{
				id: "actions",
				header: "Amallar",
				cell: (info) => {
					const row = info.row.original
					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button size="sm" variant="ghost" className="cursor-pointer h-8 w-8 p-0">
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-40">
								<DropdownMenuItem onClick={() => handleView(row)} className="cursor-pointer text-sm">
									Ko'rish
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleEdit(row)} className="cursor-pointer text-sm">
									Tahrirlash
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleArchiveClick(row)}
									className="cursor-pointer text-sm"
								>
									Arxivlash
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleDeleteClick(row)}
									className="cursor-pointer text-destructive text-sm"
								>
									O'chirish
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)
				},
				size: 80,
			},
		],
		[handleEdit, handleView, handleDeleteClick, handleArchiveClick, pagination]
	)

	const table = useReactTable({
		data: filteredTeachers,
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
			total: teachers.length,
			active: teachers.filter((t) => t.status === "active").length,
			busy: teachers.filter((t) => t.status === "busy").length,
			inactive: teachers.filter((t) => t.status === "inactive").length,
		}
	}, [teachers])

	const handleExport = useCallback(() => {
		const csv = [
			["Ism", "Telefon", "Fanlar", "Ish turi", "Maoshi/Stavkasi", "Status", "Guruhlari"].join(","),
			...filteredTeachers.map((t) =>
				[
					t.fullName,
					t.phone,
					t.subjects.map((s) => s.name).join("; "),
					WORK_TYPE_LABELS_UZ[t.workType],
					t.workType === "monthly"
						? `${t.salary} so'm`
						: t.workType === "rate"
							? `Dars uchun ${t.rate} so'm`
							: `${t.percentage}%`,
					TEACHER_STATUS_LABELS_UZ[t.status],
					t.groups.length.toString(),
				].join(",")
			),
		].join("\n")

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
		const link = document.createElement("a")
		link.href = URL.createObjectURL(blob)
		link.download = `oqituvchilar_${new Date().toISOString().split("T")[0]}.csv`
		link.click()
		toast.success("CSV fayl yuklab olindi")
	}, [filteredTeachers])

	const handleImport = useCallback(() => {
		toast.info("Import funksiyasi tez orada qo'shiladi")
	}, [])

	const handleBulkDelete = useCallback(() => {
		if (selectedTeachers.length === 0) {
			toast.error("Hech qanday o'qituvchi tanlanmagan")
			return
		}
		selectedTeachers.forEach((id) => deleteTeacher(id))
		toast.success(`${selectedTeachers.length} ta o'qituvchi o'chirildi`)
		setSelectedTeachers([])
	}, [selectedTeachers, deleteTeacher])

	const handleBulkArchive = useCallback(() => {
		if (selectedTeachers.length === 0) {
			toast.error("Hech qanday o'qituvchi tanlanmagan")
			return
		}
		selectedTeachers.forEach((id) => archiveTeacher(id))
		toast.success(`${selectedTeachers.length} ta o'qituvchi arxivlandi`)
		setSelectedTeachers([])
	}, [selectedTeachers, archiveTeacher])

	return (
		<div className="flex flex-col gap-4">
			{/* Compact Summary Cards */}
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				<Card className="border shadow-sm">
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium text-muted-foreground mb-1">Jami</p>
								<p className="text-xl font-semibold tabular-nums">{summaryCounts.total}</p>
							</div>
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
								<Users className="h-4 w-4" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="border shadow-sm">
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium text-muted-foreground mb-1">Aktiv</p>
								<p className="text-xl font-semibold tabular-nums text-green-600">{summaryCounts.active}</p>
							</div>
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
								<Users className="h-4 w-4" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="border shadow-sm">
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium text-muted-foreground mb-1">Band</p>
								<p className="text-xl font-semibold tabular-nums text-yellow-600">{summaryCounts.busy}</p>
							</div>
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
								<Users className="h-4 w-4" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="border shadow-sm">
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium text-muted-foreground mb-1">Nofaol</p>
								<p className="text-xl font-semibold tabular-nums text-gray-600">{summaryCounts.inactive}</p>
							</div>
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
								<Users className="h-4 w-4" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Search and Filters */}
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
					<div className="relative flex-1 w-full lg:max-w-md">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Ism, familiya bo'yicha qidirish..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9 h-9 bg-white"
						/>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						{selectedTeachers.length > 0 && (
							<>
								<Button
									variant="outline"
									size="sm"
									onClick={handleBulkArchive}
									className="cursor-pointer"
								>
									<Archive className="mr-2 h-4 w-4" />
									Arxivlash ({selectedTeachers.length})
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={handleBulkDelete}
									className="cursor-pointer text-destructive"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									O'chirish ({selectedTeachers.length})
								</Button>
							</>
						)}
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
							Yangi o'qituvchi qo'shish
						</Button>
					</div>
				</div>

				{activeFilters.length > 0 && (
					<div className="flex flex-wrap items-center gap-2">
						{activeFilters.map((filter) => (
							<Badge key={filter.id} variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm bg-white">
								<span className="font-medium">
									{filter.type === "course" && "Kurs: "}
									{filter.type === "status" && "Status: "}
									{filter.type === "workType" && "Ish turi: "}
									{filter.type === "workingDay" && "Dars kuni: "}
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
								<SheetTitle className="text-2xl font-bold tracking-tight">O'qituvchilar filtrlari</SheetTitle>
								<SheetDescription className="text-sm text-muted-foreground mt-2">
									Kerakli o'qituvchilar guruhini topish uchun parametrlarni belgilang.
								</SheetDescription>
							</SheetHeader>

							<div className="flex-1 overflow-y-auto px-6 py-6">
								<div className="flex flex-col gap-6">
									<Card className="border shadow-sm">
										<CardHeader className="pb-3">
											<CardTitle className="text-base font-semibold">Kurslar</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												Qaysi kurs bo'yicha filter qilish
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
											<CardTitle className="text-base font-semibold">Status</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												Faol/Nofaol o'qituvchilar
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
													{Object.entries(TEACHER_STATUS_LABELS_UZ).map(([key, label]) => (
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
											<CardTitle className="text-base font-semibold">Ish turi</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												Stavka / Oylik / %
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Select
												value={filterState.workType}
												onValueChange={(value) => setFilterState((prev) => ({ ...prev, workType: value }))}
											>
												<SelectTrigger className="bg-background">
													<SelectValue placeholder="Barcha turlar" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">Barcha turlar</SelectItem>
													{Object.entries(WORK_TYPE_LABELS_UZ).map(([key, label]) => (
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
											<CardTitle className="text-base font-semibold">Dars kunlari</CardTitle>
											<CardDescription className="text-xs text-muted-foreground">
												Dush–Juma bo'yicha filter
											</CardDescription>
										</CardHeader>
										<CardContent>
											<Select
												value={filterState.workingDay}
												onValueChange={(value) => setFilterState((prev) => ({ ...prev, workingDay: value }))}
											>
												<SelectTrigger className="bg-background">
													<SelectValue placeholder="Barcha kunlar" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">Barcha kunlar</SelectItem>
													<SelectItem value="Dush">Dushanba</SelectItem>
													<SelectItem value="Sesh">Seshanba</SelectItem>
													<SelectItem value="Chor">Chorshanba</SelectItem>
													<SelectItem value="Pay">Payshanba</SelectItem>
													<SelectItem value="Jum">Juma</SelectItem>
													<SelectItem value="Shan">Shanba</SelectItem>
													<SelectItem value="Yak">Yakshanba</SelectItem>
												</SelectContent>
											</Select>
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
			<div className="mt-4 w-full overflow-x-auto">
				{filteredTeachers.length === 0 ? (
					<div className="rounded-lg border bg-white shadow-sm py-12 text-center">
						<p className="text-muted-foreground mb-4">
							Hozircha o'qituvchi qo'shilmagan. Yangi o'qituvchi qo'shing.
						</p>
						<Button onClick={() => onOpen()} size="sm" className="cursor-pointer">
							<UserPlus className="mr-2 h-4 w-4" />
							Yangi o'qituvchi qo'shish
						</Button>
					</div>
				) : (
					<>
						<div className="min-w-full rounded-lg border-0 bg-white shadow-sm">
							<Table>
								<TableHeader>
									{table.getHeaderGroups().map((headerGroup) => (
										<TableRow key={headerGroup.id} className="border-b bg-muted/30">
											{headerGroup.headers.map((header) => (
												<TableHead 
													key={header.id} 
													colSpan={header.colSpan}
													className="font-semibold text-foreground whitespace-nowrap"
												>
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
											<TableRow 
												key={row.id}
												className="border-b hover:bg-muted/30 transition-colors"
											>
												{row.getVisibleCells().map((cell) => (
													<TableCell 
														key={cell.id}
														className="py-3 whitespace-nowrap"
													>
														{flexRender(cell.column.columnDef.cell, cell.getContext())}
													</TableCell>
												))}
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell className="h-24 text-center" colSpan={columns.length}>
												Hech qanday o'qituvchi mavjud emas
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>

						{/* Pagination */}
						<div className="flex items-center justify-between mt-4">
							<div className="text-sm text-muted-foreground">
								Jami {filteredTeachers.length} ta o'qituvchi
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
									className="cursor-pointer h-8"
								>
									Oldingi
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
									className="cursor-pointer h-8"
								>
									Keyingi
								</Button>
							</div>
						</div>
					</>
				)}
			</div>

			<TeachersDrawer />

			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>O'qituvchini o'chirish</DialogTitle>
						<DialogDescription>
							&quot;{teacherToDelete?.fullName}&quot; ni o'chirishni xohlaysizmi? Bu amalni qaytarib
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

			<Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>O'qituvchini arxivlash</DialogTitle>
						<DialogDescription>
							&quot;{teacherToArchive?.fullName}&quot; ni arxivlashni xohlaysizmi?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setArchiveDialogOpen(false)}
							className="cursor-pointer"
						>
							Bekor qilish
						</Button>
						<Button
							onClick={handleConfirmArchive}
							className="cursor-pointer"
						>
							Arxivlash
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
