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
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
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
	Calendar,
	Eye,
	Edit,
	Trash2,
	Filter,
	X,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useGroupsStore, GROUP_STATUS_LABELS_UZ, type Group, type Course, type Teacher, type Room } from "../utils/groups-store"
import GroupsDrawer from "./groups-drawer"
import { toast } from "sonner"
import { TablePagination } from "@/components/ui/table-pagination"

// Import mock data from groups-form
const mockCourses: Course[] = [
	{ id: 'c1', name: 'General English', description: 'Umumiy ingliz tili kursi' },
	{ id: 'c2', name: 'IELTS Exam Preparation', description: 'IELTS imtihoniga tayyorgarlik' },
	{ id: 'c3', name: 'Business English', description: 'Biznes ingliz tili' },
	{ id: 'c4', name: 'Frontend Development', description: 'Frontend dasturlash' },
]

const mockTeachers: Teacher[] = [
	{ id: 't1', name: 'Akmal O\'qituvchi', phone: '+998901234567', email: 'akmal@example.com' },
	{ id: 't2', name: 'Gulnora O\'qituvchi', phone: '+998939876543', email: 'gulnora@example.com' },
	{ id: 't3', name: 'Bobur O\'qituvchi', phone: '+998935556667', email: 'bobur@example.com' },
]

const mockRooms: Room[] = [
	{ id: 'r1', name: 'Xona-1', capacity: 20, type: 'classroom' },
	{ id: 'r2', name: 'Xona-2', capacity: 12, type: 'classroom' },
	{ id: 'r3', name: 'Xona-3', capacity: 15, type: 'lab' },
	{ id: 'online', name: 'Online', capacity: 100, type: 'online' },
]

export default function GroupsTable() {
	const groups = useGroupsStore((state) => state.groups)
	const onOpen = useGroupsStore((state) => state.onOpen)
	const deleteGroup = useGroupsStore((state) => state.deleteGroup)
	const navigate = useNavigate()

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [groupToDelete, setGroupToDelete] = useState<Group | null>(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [filterSheetOpen, setFilterSheetOpen] = useState(false)
	const [filterState, setFilterState] = useState({
		course: "all",
		teacher: "all",
		status: "all",
	})
	const [activeFilters, setActiveFilters] = useState<
		Array<{ id: string; type: string; label: string; value: string }>
	>([])

	const handleEdit = useCallback(
		(group: Group) => {
			onOpen(group)
		},
		[onOpen]
	)

	const handleView = useCallback(
		(group: Group) => {
			navigate(`/groups/${group.id}/schedule`)
		},
		[navigate]
	)

	const handleSchedule = useCallback(
		(group: Group) => {
			navigate(`/schedule?group=${group.id}`)
		},
		[navigate]
	)

	const handleDeleteClick = useCallback((group: Group) => {
		setGroupToDelete(group)
		setDeleteDialogOpen(true)
	}, [])

	const handleConfirmDelete = useCallback(() => {
		if (!groupToDelete) return

		deleteGroup(groupToDelete.id)
		toast.success("Guruh muvaffaqiyatli o'chirildi")
		setDeleteDialogOpen(false)
		setGroupToDelete(null)
	}, [deleteGroup, groupToDelete])

	// Get unique courses and teachers for filters
	const uniqueCourses = useMemo(() => {
		const courses = new Set<string>()
		groups.forEach((g) => courses.add(g.course.name))
		return Array.from(courses)
	}, [groups])

	const uniqueTeachers = useMemo(() => {
		const teachers = new Set<string>()
		groups.forEach((g) => teachers.add(g.teacher.name))
		return Array.from(teachers)
	}, [groups])

	// Filter groups
	const filteredGroups = useMemo(() => {
		return groups.filter((group) => {
			// Search filter
			if (
				searchQuery &&
				!group.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!group.course.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!group.teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
			) {
				return false
			}

			// Course filter
			if (filterState.course !== "all" && group.course.name !== filterState.course) {
				return false
			}

			// Teacher filter
			if (filterState.teacher !== "all" && group.teacher.name !== filterState.teacher) {
				return false
			}

			// Status filter
			if (filterState.status !== "all" && group.status !== filterState.status) {
				return false
			}

			return true
		})
	}, [groups, searchQuery, filterState])

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
				label: GROUP_STATUS_LABELS_UZ[filterState.status as Group["status"]],
			})
		}

		setActiveFilters(newFilters)
		setFilterSheetOpen(false)
	}, [filterState])

	const handleClearFilters = useCallback(() => {
		setFilterState({
			course: "all",
			teacher: "all",
			status: "all",
		})
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
				case "teacher":
					setFilterState((prev) => ({ ...prev, teacher: "all" }))
					break
				case "status":
					setFilterState((prev) => ({ ...prev, status: "all" }))
					break
			}
		},
		[activeFilters],
	)

	const handleResetFilters = useCallback(() => {
		setSearchQuery("")
		handleClearFilters()
	}, [handleClearFilters])

	const columns = useMemo<ColumnDef<Group, unknown>[]>(() => [
		{
			id: "rowNumber",
			header: "#",
			cell: (info) => <span className="text-muted-foreground">{info.row.index + 1}</span>,
			enableSorting: false,
		},
		{
			accessorKey: "name",
			header: "Guruh nomi",
			cell: (info) => {
				const group = info.row.original
				return (
					<button
						onClick={() => handleView(group)}
						className="cursor-pointer text-left hover:underline font-medium"
					>
						{group.name}
					</button>
				)
			},
		},
		{
			accessorKey: "course.name",
			header: "Kurs",
			cell: (info) => {
				const group = info.row.original
				return <span>{group.course.name}</span>
			},
		},
		{
			accessorKey: "teacher.name",
			header: "O'qituvchi",
			cell: (info) => {
				const group = info.row.original
				return <span>{group.teacher.name}</span>
			},
		},
		{
			accessorKey: "schedule",
			header: "Dars vaqti",
		},
		{
			id: "students",
			header: "Talabalar",
			cell: (info) => {
				const group = info.row.original
				return (
					<div className="flex items-center gap-2">
						<Users className="h-4 w-4 text-muted-foreground" />
						<span>{group.currentStudents}/{group.maxStudents}</span>
					</div>
				)
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: (info) => {
				const status = info.getValue() as Group["status"]
				const statusColors = {
					active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
					new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
					finished: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
				}
				return (
					<Badge className={statusColors[status]}>
						{GROUP_STATUS_LABELS_UZ[status]}
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
							<DropdownMenuItem onClick={() => handleSchedule(row)} className="cursor-pointer">
								<Calendar className="mr-2 h-4 w-4" />
								Jadval
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
	], [handleEdit, handleView, handleSchedule, handleDeleteClick])

	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	})

	const table = useReactTable({
		data: filteredGroups,
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
			total: groups.length,
			active: groups.filter((g) => g.status === "active").length,
			new: groups.filter((g) => g.status === "new").length,
			finished: groups.filter((g) => g.status === "finished").length,
		}
	}, [groups])

	const handleExport = useCallback(() => {
		const csv = [
			["Guruh nomi", "Kurs", "O'qituvchi", "Dars vaqti", "Talabalar", "Status", "Xona"].join(","),
			...filteredGroups.map((g) =>
				[
					g.name,
					g.course.name,
					g.teacher.name,
					g.schedule,
					`${g.currentStudents}/${g.maxStudents}`,
					GROUP_STATUS_LABELS_UZ[g.status],
					g.room?.name || "",
				].join(",")
			),
		].join("\n")

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
		const link = document.createElement("a")
		link.href = URL.createObjectURL(blob)
		link.download = `guruhlar_${new Date().toISOString().split("T")[0]}.csv`
		link.click()
		toast.success("CSV fayl yuklab olindi")
	}, [filteredGroups])

	const handleImport = useCallback(() => {
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = '.csv'
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0]
			if (!file) return

			const reader = new FileReader()
			reader.onload = (e) => {
				const csv = e.target?.result as string
				if (!csv) return

				try {
					const lines = csv.split('\n').filter(line => line.trim())
					if (lines.length < 2) {
						toast.error("CSV faylda ma'lumotlar yo'q")
						return
					}

					const headers = lines[0].split(',').map(h => h.trim())
					const expectedHeaders = ["Guruh nomi", "Kurs", "O'qituvchi", "Dars vaqti", "Talabalar", "Status", "Xona"]

					// Check if headers match (at least some key ones)
					const hasRequiredHeaders = expectedHeaders.some(header => headers.includes(header))
					if (!hasRequiredHeaders) {
						toast.error("CSV fayl formati noto'g'ri. Kerakli ustunlar: Guruh nomi, Kurs, O'qituvchi, Dars vaqti, Talabalar, Status")
						return
					}

					let successCount = 0
					let errorCount = 0

					for (let i = 1; i < lines.length; i++) {
						try {
							const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))

							if (values.length < 6) continue

							const [name, courseName, teacherName, schedule, studentsInfo, statusStr, roomName] = values

							// Parse students info (format: "5/15")
							const studentsMatch = studentsInfo.match(/(\d+)\/(\d+)/)
							// const currentStudents = studentsMatch ? parseInt(studentsMatch[1]) : 0
							const maxStudents = studentsMatch ? parseInt(studentsMatch[2]) : 15

							// Find or create course
							let course = mockCourses.find(c => c.name === courseName)
							if (!course) {
								course = {
									id: `c_${Date.now()}_${Math.random()}`,
									name: courseName,
									description: `${courseName} kursi`
								}
								mockCourses.push(course)
							}

							// Find or create teacher
							let teacher = mockTeachers.find(t => t.name === teacherName)
							if (!teacher) {
								teacher = {
									id: `t_${Date.now()}_${Math.random()}`,
									name: teacherName,
									phone: '+998000000000',
									email: `${teacherName.toLowerCase().replace(/\s+/g, '.')}@example.com`
								}
								mockTeachers.push(teacher)
							}

							// Find room if specified
							let room = undefined
							if (roomName && roomName !== 'Online') {
								room = mockRooms.find(r => r.name === roomName)
								if (!room) {
									room = {
										id: `r_${Date.now()}_${Math.random()}`,
										name: roomName,
										capacity: maxStudents,
										type: 'classroom' as const
									}
									mockRooms.push(room)
								}
							}

							// Parse status
							let status: 'active' | 'new' | 'finished' = 'active'
							const statusLower = statusStr.toLowerCase()
							if (statusLower.includes('yangi')) status = 'new'
							else if (statusLower.includes('tugagan') || statusLower.includes('finished')) status = 'finished'

							const groupData = {
								name: name || `Guruh-${Date.now()}`,
								courseId: course.id,
								course,
								teacherId: teacher.id,
								teacher,
								schedule: schedule || "Dushanba-Chorshanba-Juma, 18:00-19:30",
								roomId: room?.id,
								room,
								maxStudents,
								status,
								createdDate: new Date().toISOString().split("T")[0],
								zoomLink: roomName === 'Online' ? 'https://zoom.us/j/example' : undefined,
							}

							// Add group to store
							const addGroup = useGroupsStore.getState().addGroup
							addGroup(groupData)
							successCount++

						} catch (error) {
							console.error(`Error parsing line ${i}:`, error)
							errorCount++
						}
					}

					if (successCount > 0) {
						toast.success(`${successCount} ta guruh muvaffaqiyatli import qilindi${errorCount > 0 ? `, ${errorCount} ta xatolik` : ''}`)
					} else {
						toast.error("Hech qanday guruh import qilinmadi")
					}

				} catch (error) {
					console.error('Import error:', error)
					toast.error("CSV faylini o'qishda xatolik yuz berdi")
				}
			}
			reader.readAsText(file)
		}
		input.click()
	}, [])

	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<Card className="shadow-xs">
							<CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
								<div className="space-y-1">
									<CardDescription>Jami guruhlar</CardDescription>
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
									<CardDescription>Aktiv guruhlar</CardDescription>
									<CardTitle className="text-2xl font-semibold tabular-nums">
										{summaryCounts.active}
									</CardTitle>
								</div>
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
									<Users className="h-5 w-5" />
								</div>
							</CardHeader>
						</Card>
						<Card className="shadow-xs">
							<CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
								<div className="space-y-1">
									<CardDescription>Yangi guruhlar</CardDescription>
									<CardTitle className="text-2xl font-semibold tabular-nums">
										{summaryCounts.new}
									</CardTitle>
								</div>
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
									<UserPlus className="h-5 w-5" />
								</div>
							</CardHeader>
						</Card>
						<Card className="shadow-xs">
							<CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
								<div className="space-y-1">
									<CardDescription>Tugagan guruhlar</CardDescription>
									<CardTitle className="text-2xl font-semibold tabular-nums">
										{summaryCounts.finished}
									</CardTitle>
								</div>
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
									<Users className="h-5 w-5" />
								</div>
							</CardHeader>
						</Card>
					</div>

					{/* Search and Filters */}
					<div className="flex flex-col gap-4 mt-6">
						<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
							<div className="relative flex-1 w-full lg:max-w-md">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Guruh nomi, kurs, o'qituvchi bo'yicha qidirish..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-9 h-9 bg-white"
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
									Guruh qo'shish
								</Button>
							</div>
						</div>

						{activeFilters.length > 0 && (
							<div className="flex flex-wrap items-center gap-2">
								{activeFilters.map((filter) => (
									<Badge key={filter.id} variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm bg-white">
										<span className="font-medium">
											{filter.type === "course" && "Kurs: "}
											{filter.type === "teacher" && "O'qituvchi: "}
											{filter.type === "status" && "Status: "}
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
										<SheetTitle className="text-2xl font-bold tracking-tight">Guruhlar filtrlari</SheetTitle>
										<SheetDescription className="text-sm text-muted-foreground mt-2">
											Kerakli guruhlarni topish uchun parametrlarni belgilang.
										</SheetDescription>
									</SheetHeader>

									<div className="flex-1 overflow-y-auto px-6 py-6">
										<div className="flex flex-col gap-6">
											<Card className="border shadow-sm">
												<CardHeader className="pb-3">
													<CardTitle className="text-base font-semibold flex items-center gap-2">
														<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
															<Calendar className="h-4 w-4" />
														</div>
														Kurslar
													</CardTitle>
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
													<CardTitle className="text-base font-semibold flex items-center gap-2">
														<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
															<Users className="h-4 w-4" />
														</div>
														O'qituvchilar
													</CardTitle>
													<CardDescription className="text-xs text-muted-foreground">
														O'qituvchi bo'yicha filter
													</CardDescription>
												</CardHeader>
												<CardContent>
													<Select
														value={filterState.teacher}
														onValueChange={(value) => setFilterState((prev) => ({ ...prev, teacher: value }))}
													>
														<SelectTrigger className="bg-background">
															<SelectValue placeholder="Barcha o'qituvchilar" />
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
															<Edit className="h-4 w-4" />
														</div>
														Status
													</CardTitle>
													<CardDescription className="text-xs text-muted-foreground">
														Aktiv, yangi yoki tugagan holatini tanlang
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
															{Object.entries(GROUP_STATUS_LABELS_UZ).map(([key, label]) => (
																<SelectItem key={key} value={key}>
																	{label}
																</SelectItem>
															))}
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
													Hech qanday guruhlar mavjud emas
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

			<GroupsDrawer />

			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Guruhni o'chirish</DialogTitle>
						<DialogDescription>
							"{groupToDelete?.name}" guruhini o'chirishni xohlaysizmi? Bu amalni qaytarib
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