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
	Calendar,
	Eye,
	Edit,
	Trash2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useGroupsStore, GROUP_STATUS_LABELS_UZ, type Group, type Course, type Teacher, type Room } from "../utils/groups-store"
import GroupsDrawer from "./groups-drawer"
import { toast } from "sonner"

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
	const [courseFilter, setCourseFilter] = useState<string>("all")
	const [teacherFilter, setTeacherFilter] = useState<string>("all")
	const [statusFilter, setStatusFilter] = useState<string>("all")

	const handleEdit = useCallback(
		(group: Group) => {
			onOpen(group)
		},
		[onOpen]
	)

	const handleView = useCallback(
		(group: Group) => {
			navigate(`/groups/${group.id}`)
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
			if (courseFilter !== "all" && group.course.name !== courseFilter) {
				return false
			}

			// Teacher filter
			if (teacherFilter !== "all" && group.teacher.name !== teacherFilter) {
				return false
			}

			// Status filter
			if (statusFilter !== "all" && group.status !== statusFilter) {
				return false
			}

			return true
		})
	}, [groups, searchQuery, courseFilter, teacherFilter, statusFilter])

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
		<div className="flex w-full min-w-0 flex-col gap-4 -m-2 lg:-m-3">
			<div className="min-h-[calc(100vh-8rem)] rounded-lg bg-white p-4 lg:p-6 shadow-sm">
				<div className="flex flex-col gap-4">
					<div className="mb-2">
						<h1 className="text-3xl font-bold">Guruhlar</h1>
						<p className="text-muted-foreground mt-1">Guruhlar boshqaruvi va statistikasi</p>
					</div>
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
					<div className="flex flex-col gap-6 mt-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
							<div className="relative flex-1 w-full md:max-w-md">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Guruh nomi, kurs, o'qituvchi bo'yicha qidirish..."
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
									Guruh qo'shish
								</Button>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
								<Label className="text-sm font-medium">O'qituvchi bo'yicha filter</Label>
								<Select value={teacherFilter} onValueChange={setTeacherFilter}>
									<SelectTrigger className="w-full">
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
							</div>

							<div className="space-y-2">
								<Label className="text-sm font-medium">Status bo'yicha filter</Label>
								<Select value={statusFilter} onValueChange={setStatusFilter}>
									<SelectTrigger className="w-full">
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
													Hech qanday guruhlar mavjud emas
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