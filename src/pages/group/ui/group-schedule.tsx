"use client"

import { useState, useMemo, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	ChevronLeft,
	ChevronRight,
	ArrowLeft,
	Check,
	Circle,
	X,
	Search,
	Download,
} from "lucide-react"
import { useGroupsStore } from "../utils/groups-store"
import { toast } from "sonner"
import { PageLayout } from "@/shared/layout/page-layout"

// Types
type AttendanceStatus = "present" | "absent" | "late" | "none"

interface AttendanceRecord {
	studentId: string
	date: string // ISO date string
	status: AttendanceStatus
}

interface Student {
	id: string
	name: string
	phone: string
}

// Helper functions - moved outside component for better performance
const getMonthDates = (date: Date): Date[] => {
	const year = date.getFullYear()
	const month = date.getMonth()
	const lastDay = new Date(year, month + 1, 0)
	const dates: Date[] = []
	
	for (let day = 1; day <= lastDay.getDate(); day++) {
		dates.push(new Date(year, month, day))
	}
	
	return dates
}

const formatMonthYear = (date: Date): string => {
	const months = [
		'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
		'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
	]
	return `${months[date.getMonth()]} ${date.getFullYear()}`
}

const getDayAbbreviation = (date: Date): string => {
	const days = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh']
	return days[date.getDay()]
}

const formatDateKey = (date: Date): string => {
	return date.toISOString().split('T')[0]
}

const parseScheduleDays = (schedule: string): number[] => {
	const scheduleLower = schedule.toLowerCase()
	const dayMap: { [key: string]: number } = {
		'dush': 1, 'du': 1,
		'sesh': 2, 'se': 2,
		'chor': 3, 'ch': 3, 'cho': 3,
		'pay': 4, 'pa': 4,
		'jum': 5, 'ju': 5,
		'shan': 6, 'sh': 6, 'sha': 6,
		'yak': 0, 'ya': 0
	}
	
	const classDays: number[] = []
	Object.keys(dayMap).forEach(key => {
		if (scheduleLower.includes(key) && !classDays.includes(dayMap[key])) {
			classDays.push(dayMap[key])
		}
	})
	
	return classDays.length > 0 ? classDays : [1, 2, 3, 4, 5] // Default to weekdays
}

export default function GroupSchedule() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const groups = useGroupsStore((state) => state.groups)
	const [currentMonth, setCurrentMonth] = useState(new Date())
	const [searchQuery, setSearchQuery] = useState("")
	
	// Attendance state - using Map for O(1) lookups
	const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(new Map())

	const selectedGroup = groups.find(g => g.id === id)

	// Memoized students list
	const allStudents: Student[] = useMemo(() => [
		{ id: "1", name: "Akmal Karimov", phone: "+998 90 123 45 67" },
		{ id: "2", name: "Gulnora Alimova", phone: "+998 91 234 56 78" },
		{ id: "3", name: "Bobur Toshmatov", phone: "+998 92 345 67 89" },
		{ id: "4", name: "Dilshoda Rahimova", phone: "+998 93 456 78 90" },
		{ id: "5", name: "Farhod Ismoilov", phone: "+998 94 567 89 01" },
		{ id: "6", name: "Madina Yusupova", phone: "+998 95 678 90 12" },
		{ id: "7", name: "Sardor Qodirov", phone: "+998 97 789 01 23" },
		{ id: "8", name: "Zarina Bekmurodova", phone: "+998 98 890 12 34" },
		{ id: "9", name: "Muxlisayeva Milana", phone: "+998 92 677 31 46" },
	], [])

	// Filtered students based on search
	const filteredStudents = useMemo(() => {
		if (!searchQuery.trim()) return allStudents
		const query = searchQuery.toLowerCase()
		return allStudents.filter(student => 
			student.name.toLowerCase().includes(query) || 
			student.phone.includes(query)
		)
	}, [allStudents, searchQuery])

	if (!selectedGroup) {
		return (
			<PageLayout
				title="Guruh topilmadi"
				description=""
				headerActions={
					<Button onClick={() => navigate('/groups')}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Guruhlar ro'yxatiga qaytish
					</Button>
				}
			>
				<div className="flex flex-col items-center justify-center h-full min-h-[400px]">
					<p className="text-muted-foreground">Guruh topilmadi</p>
				</div>
			</PageLayout>
		)
	}

	// Memoized class days parsing
	const classDays = useMemo(() => 
		parseScheduleDays(selectedGroup.schedule), 
		[selectedGroup.schedule]
	)

	// Memoized month dates
	const monthDates = useMemo(() => getMonthDates(currentMonth), [currentMonth])
	
	// Memoized class dates - only recalculate when month or schedule changes
	const classDates = useMemo(() => {
		return monthDates.filter(date => classDays.includes(date.getDay()))
	}, [monthDates, classDays])

	// Get attendance status with fallback to generated data
	const getAttendanceStatus = useCallback((studentId: string, date: Date): AttendanceStatus => {
		const dateKey = formatDateKey(date)
		const key = `${studentId}-${dateKey}`
		const record = attendance.get(key)
		
		if (record) return record.status
		
		// Generate initial status (can be replaced with API call)
		const seed = (studentId.charCodeAt(0) + date.getTime()) % 10
		if (seed < 5) return "present"
		if (seed < 7) return "late"
		if (seed < 9) return "absent"
		return "none"
	}, [attendance])

	// Toggle attendance status
	const toggleAttendance = useCallback((studentId: string, date: Date) => {
		const dateKey = formatDateKey(date)
		const key = `${studentId}-${dateKey}`
		const currentStatus = getAttendanceStatus(studentId, date)
		
		// Cycle through: none -> present -> late -> absent -> none
		const nextStatus: AttendanceStatus = 
			currentStatus === "none" ? "present" :
			currentStatus === "present" ? "late" :
			currentStatus === "late" ? "absent" : "none"
		
		setAttendance(prev => {
			const newMap = new Map(prev)
			if (nextStatus === "none") {
				newMap.delete(key)
			} else {
				newMap.set(key, {
					studentId,
					date: dateKey,
					status: nextStatus
				})
			}
			return newMap
		})
		
		toast.success("Davomat yangilandi")
	}, [getAttendanceStatus])

	// Calculate statistics for a student - memoized per student
	const getStudentStats = useCallback((studentId: string) => {
		let present = 0
		let late = 0
		let absent = 0
		
		classDates.forEach(date => {
			const status = getAttendanceStatus(studentId, date)
			if (status === "present") present++
			else if (status === "late") late++
			else if (status === "absent") absent++
		})
		
		return { present, late, absent, total: present + late + absent }
	}, [classDates, getAttendanceStatus])

	// Export to CSV
	const handleExport = useCallback(() => {
		const headers = ['O\'quvchi', 'Telefon', ...classDates.map(d => formatDateKey(d)), 'Jami']
		const rows = filteredStudents.map(student => {
			const stats = getStudentStats(student.id)
			const attendanceRow = classDates.map(date => {
				const status = getAttendanceStatus(student.id, date)
				return status === "present" ? "Keldi" :
					status === "late" ? "Kech keldi" :
					status === "absent" ? "Kelmadi" : ""
			})
			return [student.name, student.phone, ...attendanceRow, stats.total.toString()]
		})
		
		const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = `davomat_${selectedGroup.name}_${formatMonthYear(currentMonth)}.csv`
		link.click()
		toast.success("CSV fayl yuklab olindi")
	}, [filteredStudents, classDates, getAttendanceStatus, getStudentStats, selectedGroup.name, currentMonth])

	const handlePreviousMonth = useCallback(() => {
		setCurrentMonth(prev => {
			const newDate = new Date(prev)
			newDate.setMonth(newDate.getMonth() - 1)
			return newDate
		})
	}, [])

	const handleNextMonth = useCallback(() => {
		setCurrentMonth(prev => {
			const newDate = new Date(prev)
			newDate.setMonth(newDate.getMonth() + 1)
			return newDate
		})
	}, [])

	const handleToday = useCallback(() => {
		setCurrentMonth(new Date())
	}, [])

	// Calculate grid columns dynamically
	const gridColumns = useMemo(() => 
		`200px repeat(${classDates.length}, 60px) 100px`,
		[classDates.length]
	)

	return (
		<PageLayout
			title={`${selectedGroup.name} - Davomat jadvali`}
			description="Oylik yo'qlama jadvali va davomat boshqaruvi"
			headerActions={
				<Button variant="outline" size="sm" onClick={() => navigate('/groups')} className="bg-green-500 text-white hover:bg-green-600 border-green-500">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Guruhlar ro'yxatiga qaytish
				</Button>
			}
		>
			<div className="flex flex-col gap-4">
				{/* Group Info Cards */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
							<div>
								<p className="text-sm text-muted-foreground">O'qituvchi</p>
								<p className="font-medium">{selectedGroup.teacher.name}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Dars vaqti</p>
								<p className="font-medium">{selectedGroup.schedule}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Kurs nomi</p>
								<p className="font-medium">{selectedGroup.course.name}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Kurs narxi</p>
								<p className="font-medium">1.200.000</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Davomiyligi</p>
								<p className="font-medium">2025-01-01/2026-09-01</p>
							</div>
						</div>

					{/* Title, Search, and Month Navigation */}
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
						<div className="flex items-center gap-3">
							<h2 className="text-2xl font-bold">Oylik yo'qlama jadvali</h2>
							<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-semibold">
								{filteredStudents.length}
							</div>
						</div>
						<div className="flex items-center gap-2">
							<div className="relative flex-1 md:flex-initial md:w-64">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="O'quvchi qidirish..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-9"
								/>
							</div>
							<Button variant="outline" size="sm" onClick={handleExport}>
								<Download className="h-4 w-4 mr-2" />
								Export
							</Button>
							<Button variant="outline" size="sm">
								Arxiv
							</Button>
							<Button variant="outline" size="sm" onClick={handlePreviousMonth}>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<span className="text-lg font-semibold min-w-[150px] text-center">
								{formatMonthYear(currentMonth)}
							</span>
							<Button variant="outline" size="sm" onClick={handleNextMonth}>
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Button variant="outline" size="sm" onClick={handleToday}>
								Bugun
							</Button>
						</div>
					</div>

					{/* Attendance Grid */}
					<div className="overflow-x-auto">
						<div className="min-w-[1200px]">
							{/* Date Headers */}
							<div className="grid gap-1 mb-2" style={{ gridTemplateColumns: gridColumns }}>
								<div className="p-2 text-sm font-medium text-muted-foreground border-b sticky left-0 bg-white z-10">O'quvchi</div>
								{classDates.map((date, index) => (
									<div key={index} className="p-2 text-center border-b">
										<div className="text-xs font-medium">
											{getDayAbbreviation(date)}
										</div>
										<div className="text-sm font-bold">
											{date.getDate()}
										</div>
									</div>
								))}
								<div className="p-2 text-sm font-medium text-muted-foreground border-b text-center">Statistika</div>
							</div>

							{/* Student Rows */}
							<div className="space-y-1">
								{filteredStudents.map((student) => {
									const stats = getStudentStats(student.id)
									return (
										<div key={student.id} className="grid gap-1" style={{ gridTemplateColumns: gridColumns }}>
											<div className="p-2 text-sm border-r flex flex-col justify-center sticky left-0 bg-white z-10">
												<div className="font-medium">{student.name}</div>
												<div className="text-xs text-muted-foreground">{student.phone}</div>
											</div>
											{classDates.map((date, dateIndex) => {
												const status = getAttendanceStatus(student.id, date)
												return (
													<div
														key={dateIndex}
														onClick={() => toggleAttendance(student.id, date)}
														className="min-h-[50px] border flex items-center justify-center p-1 cursor-pointer hover:bg-gray-50 transition-colors"
														title="Davomatni o'zgartirish uchun bosing"
													>
														{status === "present" && (
															<Check className="h-5 w-5 text-green-600" strokeWidth={3} />
														)}
														{status === "late" && (
															<div className="relative">
																<Circle className="h-5 w-5 text-yellow-500" strokeWidth={2} fill="currentColor" />
																<div className="absolute inset-0 flex items-center justify-center">
																	<div className="h-2 w-2 bg-yellow-700 rounded-full" />
																</div>
															</div>
														)}
														{status === "absent" && (
															<X className="h-5 w-5 text-red-600" strokeWidth={3} />
														)}
														{status === "none" && (
															<div className="h-4 w-4 rounded-full bg-gray-200" />
														)}
													</div>
												)
											})}
											<div className="p-2 text-sm border-l text-center flex items-center justify-center font-medium">
												{stats.total}
											</div>
										</div>
									)
								})}
							</div>
						</div>
					</div>

					{/* Legend */}
					<div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t">
						<div className="flex items-center gap-2">
							<Check className="h-5 w-5 text-green-600" strokeWidth={3} />
							<span className="text-sm">Keldi</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="relative">
								<Circle className="h-5 w-5 text-yellow-500" strokeWidth={2} fill="currentColor" />
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="h-2 w-2 bg-yellow-700 rounded-full" />
								</div>
							</div>
							<span className="text-sm">Kech keldi</span>
						</div>
						<div className="flex items-center gap-2">
							<X className="h-5 w-5 text-red-600" strokeWidth={3} />
							<span className="text-sm">Kelmadi</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="h-4 w-4 rounded-full bg-gray-200" />
							<span className="text-sm">Yo'qlama qilinmagan</span>
						</div>
						<div className="text-xs text-muted-foreground ml-auto">
							Davomatni o'zgartirish uchun katakchaga bosing
						</div>
					</div>
			</div>
		</PageLayout>
	)
}
