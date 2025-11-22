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
	Plus,
	Download,
	Upload,
	Search,
	Filter,
	BookOpen,
	X,
	Eye,
	Edit,
	Trash2,
	Archive,
	Users,
	DollarSign,
	Clock,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
	useCoursesStore,
	COURSE_STATUS_LABELS_UZ,
	PRICE_TYPE_LABELS_UZ,

	type Course,
	type CourseStatus,
} from "../utils/courses-store"
import CoursesDrawer from "./courses-drawer"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { TablePagination } from "@/components/ui/table-pagination"

const COURSE_FILTER_DEFAULTS = {
	name: "",
	price: "all",
	duration: "all",
	teacher: "all",
	status: "all",
	studentCount: "all",
}

export default function CoursesTable() {
	const courses = useCoursesStore((state) => state.courses)
	const onOpen = useCoursesStore((state) => state.onOpen)
	const deleteCourse = useCoursesStore((state) => state.deleteCourse)
	const archiveCourse = useCoursesStore((state) => state.archiveCourse)
	const navigate = useNavigate()

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [filterSheetOpen, setFilterSheetOpen] = useState(false)
	const [filterState, setFilterState] = useState({ ...COURSE_FILTER_DEFAULTS })
	const [activeFilters, setActiveFilters] = useState<
		Array<{ id: string; type: string; label: string; value: string }>
	>([])
	const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())

	const handleEdit = useCallback(
		(course: Course) => {
			onOpen(course)
		},
		[onOpen]
	)

	const handleView = useCallback(
		(course: Course) => {
			navigate(`/kurslar/${course.id}`)
		},
		[navigate]
	)

	const handleDeleteClick = useCallback((course: Course) => {
		setCourseToDelete(course)
		setDeleteDialogOpen(true)
	}, [])

	const handleConfirmDelete = useCallback(() => {
		if (!courseToDelete) return

		deleteCourse(courseToDelete.id)
		toast.success("Kurs muvaffaqiyatli o'chirildi")
		setDeleteDialogOpen(false)
		setCourseToDelete(null)
	}, [deleteCourse, courseToDelete])

	const handleArchiveSelected = useCallback(() => {
		selectedCourses.forEach((id) => {
			archiveCourse(id)
		})
		toast.success(`${selectedCourses.size} ta kurs arxivlandi`)
		setSelectedCourses(new Set())
	}, [selectedCourses, archiveCourse])

	const handleDeleteSelected = useCallback(() => {
		selectedCourses.forEach((id) => {
			deleteCourse(id)
		})
		toast.success(`${selectedCourses.size} ta kurs o'chirildi`)
		setSelectedCourses(new Set())
	}, [selectedCourses, deleteCourse])

	// Get unique values for filters
	const uniqueTeachers = useMemo(() => {
		const teachers = new Set<string>()
		courses.forEach((c) => {
			teachers.add(c.mainTeacher.fullName)
			c.additionalTeachers.forEach((t) => teachers.add(t.fullName))
		})
		return Array.from(teachers)
	}, [courses])

	const handleApplyFilters = useCallback(() => {
		const newFilters: Array<{ id: string; type: string; label: string; value: string }> = []

		if (filterState.name) {
			newFilters.push({
				id: `name-${filterState.name}`,
				type: "name",
				value: filterState.name,
				label: filterState.name,
			})
		}

		if (filterState.price !== "all") {
			newFilters.push({
				id: `price-${filterState.price}`,
				type: "price",
				value: filterState.price,
				label: filterState.price === "low" ? "Arzon → Qimmat" : "Qimmat → Arzon",
			})
		}

		if (filterState.duration !== "all") {
			newFilters.push({
				id: `duration-${filterState.duration}`,
				type: "duration",
				value: filterState.duration,
				label: filterState.duration,
			})
		}

		if (filterState.teacher !== "all") {
			newFilters.push({
				id: `teacher-${filterState.teacher}`,
				type: "teacher",
				value: filterState.teacher,
				label: filterState.teacher,
			})
		}

		if (filterState.status !== "all") {
			newFilters.push({
				id: `status-${filterState.status}`,
				type: "status",
				value: filterState.status,
				label: COURSE_STATUS_LABELS_UZ[filterState.status as CourseStatus],
			})
		}

		if (filterState.studentCount !== "all") {
			newFilters.push({
				id: `studentCount-${filterState.studentCount}`,
				type: "studentCount",
				value: filterState.studentCount,
				label: filterState.studentCount === "low" ? "Kam → Ko'p" : "Ko'p → Kam",
			})
		}

		setActiveFilters(newFilters)
		setFilterSheetOpen(false)
	}, [filterState])

	const handleClearFilters = useCallback(() => {
		setFilterState({ ...COURSE_FILTER_DEFAULTS })
		setActiveFilters([])
	}, [])

	const handleRemoveFilter = useCallback(
		(filterId: string) => {
			const filter = activeFilters.find((item) => item.id === filterId)
			if (!filter) return

			setActiveFilters((prev) => prev.filter((item) => item.id !== filterId))

			switch (filter.type) {
				case "name":
					setFilterState((prev) => ({ ...prev, name: "" }))
					break
				case "price":
					setFilterState((prev) => ({ ...prev, price: "all" }))
					break
				case "duration":
					setFilterState((prev) => ({ ...prev, duration: "all" }))
					break
				case "teacher":
					setFilterState((prev) => ({ ...prev, teacher: "all" }))
					break
				case "status":
					setFilterState((prev) => ({ ...prev, status: "all" }))
					break
				case "studentCount":
					setFilterState((prev) => ({ ...prev, studentCount: "all" }))
					break
			}
		},
		[activeFilters]
	)

	const handleResetFilters = useCallback(() => {
		setSearchQuery("")
		handleClearFilters()
	}, [handleClearFilters])

	// Filter courses
	const filteredCourses = useMemo(() => {
		let result = courses.filter((course) => {
			// Search filter
			if (
				searchQuery &&
				!course.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!course.mainTeacher.fullName.toLowerCase().includes(searchQuery.toLowerCase())
			) {
				return false
			}

			// Name filter
			if (filterState.name && !course.name.toLowerCase().includes(filterState.name.toLowerCase())) {
				return false
			}

			// Teacher filter
			if (
				filterState.teacher !== "all" &&
				course.mainTeacher.fullName !== filterState.teacher &&
				!course.additionalTeachers.some((t) => t.fullName === filterState.teacher)
			) {
				return false
			}

			// Status filter
			if (filterState.status !== "all" && course.status !== filterState.status) {
				return false
			}

			return true
		})

		// Sort by price
		if (filterState.price !== "all") {
			result = [...result].sort((a, b) => {
				if (filterState.price === "low") {
					return a.price - b.price
				} else {
					return b.price - a.price
				}
			})
		}

		// Sort by student count
		if (filterState.studentCount !== "all") {
			result = [...result].sort((a, b) => {
				if (filterState.studentCount === "low") {
					return a.students.length - b.students.length
				} else {
					return b.students.length - a.students.length
				}
			})
		}

		return result
	}, [courses, searchQuery, filterState])

	const columns = useMemo<ColumnDef<Course, unknown>[]>(
		() => [
			{
				id: "select",
				header: ({ table }) => (
					<Checkbox
						checked={table.getIsAllPageRowsSelected()}
						onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
						aria-label="Barchasini tanlash"
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Tanlash"
					/>
				),
				enableSorting: false,
			},
			{
				id: "rowNumber",
				header: "#",
				cell: (info) => <span className="text-muted-foreground">{info.row.index + 1}</span>,
				enableSorting: false,
			},
			{
				accessorKey: "name",
				header: "Kurs nomi",
				cell: (info) => {
					const course = info.row.original
					return (
						<button
							onClick={() => handleView(course)}
							className="cursor-pointer text-left hover:underline font-medium"
						>
							{course.name}
						</button>
					)
				},
			},
			{
				accessorKey: "price",
				header: "Narxi",
				cell: (info) => {
					const course = info.row.original
					if (course.priceType === "free") {
						return <Badge variant="secondary">Bepul</Badge>
					}
					return (
						<span>
							{course.price.toLocaleString("uz-UZ")} so'm / {PRICE_TYPE_LABELS_UZ[course.priceType]}
						</span>
					)
				},
			},
			{
				accessorKey: "duration",
				header: "Davomiyligi",
				cell: (info) => {
					const course = info.row.original
					return (
						<div className="flex items-center gap-1">
							<Clock className="h-4 w-4 text-muted-foreground" />
							<span>{course.duration}</span>
						</div>
					)
				},
			},
			{
				accessorKey: "mainTeacher",
				header: "O'qituvchi",
				cell: (info) => {
					const teacher = info.getValue() as Course["mainTeacher"]
					return <span>{teacher.fullName}</span>
				},
			},
			{
				accessorKey: "students",
				header: "Talabalar soni",
				cell: (info) => {
					const students = info.getValue() as Course["students"]
					return (
						<div className="flex items-center gap-1">
							<Users className="h-4 w-4 text-muted-foreground" />
							<span>{students.length}</span>
						</div>
					)
				},
			},
			{
				accessorKey: "status",
				header: "Status",
				cell: (info) => {
					const status = info.getValue() as CourseStatus
					const statusColors = {
						active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
						archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
						draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
					}
					return (
						<Badge className={statusColors[status]}>
							{COURSE_STATUS_LABELS_UZ[status]}
						</Badge>
					)
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
									<Eye className="mr-2 h-4 w-4" />
									Ko'rish
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleEdit(row)} className="cursor-pointer">
									<Edit className="mr-2 h-4 w-4" />
									Tahrirlash
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										archiveCourse(row.id)
										toast.success("Kurs arxivlandi")
									}}
									className="cursor-pointer"
								>
									<Archive className="mr-2 h-4 w-4" />
									Arxivlash
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
		],
		[handleEdit, handleView, handleDeleteClick, archiveCourse]
	)

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	})

	const table = useReactTable({
		data: filteredCourses,
		columns,
		state: {
			pagination,
			rowSelection: Object.fromEntries(Array.from(selectedCourses).map((id) => [id, true])),
		},
		onPaginationChange: setPagination,
		onRowSelectionChange: (updater) => {
			if (typeof updater === "function") {
				const newSelection = updater(Object.fromEntries(Array.from(selectedCourses).map((id) => [id, true])))
				setSelectedCourses(new Set(Object.keys(newSelection)))
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		enableRowSelection: true,
	})

	const summaryCounts = useMemo(() => {
		return {
			total: courses.length,
			active: courses.filter((c) => c.status === "active").length,
			archived: courses.filter((c) => c.status === "archived").length,
			draft: courses.filter((c) => c.status === "draft").length,
		}
	}, [courses])

	const handleExport = useCallback(() => {
		const csv = [
			[
				"Kurs nomi",
				"Kategoriya",
				"Narxi",
				"Davomiyligi",
				"O'qituvchi",
				"Talabalar soni",
				"Status",
			].join(","),
			...filteredCourses.map((c) =>
				[
					c.name,
					c.category,
					c.priceType === "free" ? "Bepul" : `${c.price} so'm`,
					c.duration,
					c.mainTeacher.fullName,
					c.students.length,
					COURSE_STATUS_LABELS_UZ[c.status],
				].join(",")
			),
		].join("\n")

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
		const link = document.createElement("a")
		link.href = URL.createObjectURL(blob)
		link.download = `kurslar_${new Date().toISOString().split("T")[0]}.csv`
		link.click()
		toast.success("CSV fayl yuklab olindi")
	}, [filteredCourses])

	const handleImport = useCallback(() => {
		toast.info("Import funksiyasi tez orada qo'shiladi")
	}, [])

	return (
		<div className="flex flex-col gap-4">
			{/* Summary Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card className="shadow-xs">
					<CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
						<div className="space-y-1">
							<CardDescription>Jami kurslar</CardDescription>
							<CardTitle className="text-2xl font-semibold tabular-nums">
								{summaryCounts.total}
							</CardTitle>
						</div>
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
							<BookOpen className="h-5 w-5" />
						</div>
					</CardHeader>
				</Card>
				<Card className="shadow-xs">
					<CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
						<div className="space-y-1">
							<CardDescription>Aktiv kurslar</CardDescription>
							<CardTitle className="text-2xl font-semibold tabular-nums text-green-600">
								{summaryCounts.active}
							</CardTitle>
						</div>
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
							<BookOpen className="h-5 w-5" />
						</div>
					</CardHeader>
				</Card>
				<Card className="shadow-xs">
					<CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
						<div className="space-y-1">
							<CardDescription>Arxivlangan</CardDescription>
							<CardTitle className="text-2xl font-semibold tabular-nums text-gray-600">
								{summaryCounts.archived}
							</CardTitle>
						</div>
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
							<Archive className="h-5 w-5" />
						</div>
					</CardHeader>
				</Card>
				<Card className="shadow-xs">
					<CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
						<div className="space-y-1">
							<CardDescription>Qoralama</CardDescription>
							<CardTitle className="text-2xl font-semibold tabular-nums text-yellow-600">
								{summaryCounts.draft}
							</CardTitle>
						</div>
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
							<BookOpen className="h-5 w-5" />
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
							placeholder="Kurs nomi, o'qituvchi bo'yicha qidirish..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9 w-full bg-white shadow-sm"
						/>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						{selectedCourses.size > 0 && (
							<>
								<Button
									variant="outline"
									size="sm"
									onClick={handleArchiveSelected}
									className="cursor-pointer"
								>
									<Archive className="mr-2 h-4 w-4" />
									Arxivlash ({selectedCourses.size})
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={handleDeleteSelected}
									className="cursor-pointer text-destructive"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									O'chirish ({selectedCourses.size})
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
							<Plus className="mr-2 h-4 w-4" />
							Yangi kurs qo'shish
						</Button>
					</div>
				</div>

				{activeFilters.length > 0 && (
					<div className="flex flex-wrap items-center gap-2">
						{activeFilters.map((filter) => (
							<Badge key={filter.id} variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm bg-white">
								<span className="font-medium">
									{filter.type === "name" && "Nomi: "}
									{filter.type === "price" && "Narx: "}
									{filter.type === "duration" && "Davomiylik: "}
									{filter.type === "teacher" && "O'qituvchi: "}
									{filter.type === "status" && "Status: "}
									{filter.type === "studentCount" && "Talabalar: "}
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
								<SheetTitle className="text-2xl font-bold tracking-tight">Kurslar filtrlari</SheetTitle>
								<SheetDescription className="text-sm text-muted-foreground mt-2">
									Kerakli kurslarni topish uchun parametrlarni belgilang.
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
												Kurs nomi
											</CardTitle>
										</CardHeader>
										<CardContent>
											<Input
												value={filterState.name}
												onChange={(e) => setFilterState((prev) => ({ ...prev, name: e.target.value }))}
												placeholder="Kurs nomini kiriting"
												className="bg-background"
											/>
										</CardContent>
									</Card>

									<Card className="border shadow-sm">
										<CardHeader className="pb-3">
											<CardTitle className="text-base font-semibold flex items-center gap-2">
												<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
													<DollarSign className="h-4 w-4" />
												</div>
												Narx bo'yicha
											</CardTitle>
										</CardHeader>
										<CardContent>
											<Select
												value={filterState.price}
												onValueChange={(value) => setFilterState((prev) => ({ ...prev, price: value }))}
											>
												<SelectTrigger className="bg-background">
													<SelectValue placeholder="Narx bo'yicha saralash" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">Barchasi</SelectItem>
													<SelectItem value="low">Arzon → Qimmat</SelectItem>
													<SelectItem value="high">Qimmat → Arzon</SelectItem>
												</SelectContent>
											</Select>
										</CardContent>
									</Card>

									<Card className="border shadow-sm">
										<CardHeader className="pb-3">
											<CardTitle className="text-base font-semibold flex items-center gap-2">
												<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
													<Clock className="h-4 w-4" />
												</div>
												Davomiylik
											</CardTitle>
										</CardHeader>
										<CardContent>
											<Select
												value={filterState.duration}
												onValueChange={(value) => setFilterState((prev) => ({ ...prev, duration: value }))}
											>
												<SelectTrigger className="bg-background">
													<SelectValue placeholder="Davomiylik tanlang" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">Barchasi</SelectItem>
													<SelectItem value="4 hafta">4 hafta</SelectItem>
													<SelectItem value="8 hafta">8 hafta</SelectItem>
													<SelectItem value="2 oy">2 oy</SelectItem>
													<SelectItem value="3 oy">3 oy</SelectItem>
													<SelectItem value="4 oy">4 oy</SelectItem>
													<SelectItem value="6 oy">6 oy</SelectItem>
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
												O'qituvchi
											</CardTitle>
										</CardHeader>
										<CardContent>
											<Select
												value={filterState.teacher}
												onValueChange={(value) => setFilterState((prev) => ({ ...prev, teacher: value }))}
											>
												<SelectTrigger className="bg-background">
													<SelectValue placeholder="O'qituvchi tanlang" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">Barcha o'qituvchilar</SelectItem>
													{uniqueTeachers.map((teacher) => (
														<SelectItem key={teacher} value={teacher}>
															{teacher}
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
												Status
											</CardTitle>
										</CardHeader>
										<CardContent>
											<Select
												value={filterState.status}
												onValueChange={(value) => setFilterState((prev) => ({ ...prev, status: value }))}
											>
												<SelectTrigger className="bg-background">
													<SelectValue placeholder="Status tanlang" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">Barcha statuslar</SelectItem>
													{Object.entries(COURSE_STATUS_LABELS_UZ).map(([key, label]) => (
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
												Talabalar soni
											</CardTitle>
										</CardHeader>
										<CardContent>
											<Select
												value={filterState.studentCount}
												onValueChange={(value) =>
													setFilterState((prev) => ({ ...prev, studentCount: value }))
												}
											>
												<SelectTrigger className="bg-background">
													<SelectValue placeholder="Talabalar soni bo'yicha" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">Barchasi</SelectItem>
													<SelectItem value="low">Kam → Ko'p</SelectItem>
													<SelectItem value="high">Ko'p → Kam</SelectItem>
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
									<Button
										onClick={handleApplyFilters}
										className="cursor-pointer shadow-sm hover:shadow-md transition-shadow"
									>
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
				{filteredCourses.length === 0 ? (
					<Card>
						<CardContent className="py-16 text-center">
							<BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<p className="text-lg font-medium mb-2">Hozircha kurs qo'shilmagan</p>
							<p className="text-sm text-muted-foreground mb-4">Yangi kurs yarating.</p>
							<Button onClick={() => onOpen()} className="cursor-pointer">
								<Plus className="mr-2 h-4 w-4" />
								Yangi kurs qo'shish
							</Button>
						</CardContent>
					</Card>
				) : (
					<>
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
												Hech qanday kurslar topilmadi
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
					</>
				)}
			</div>

			<CoursesDrawer />

			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Kursni o'chirish</DialogTitle>
						<DialogDescription>
							&quot;{courseToDelete?.name}&quot; ni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
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
						<Button variant="destructive" onClick={handleConfirmDelete} className="cursor-pointer">
							O'chirish
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

