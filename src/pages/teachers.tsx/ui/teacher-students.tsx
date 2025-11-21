"use client"

import { useMemo, useState, useCallback } from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, } from "lucide-react"
import { useGroupsStore } from "../../group/utils/groups-store"
import { useStudentsStore, PAYMENT_STATUS_LABELS_UZ, } from "../../talabalar/utils/students-store"
import { useNavigate } from "react-router-dom"

interface TeacherStudentsProps {
	teacherId: string
}

export default function TeacherStudents({ teacherId }: TeacherStudentsProps) {
	const groups = useGroupsStore((state) => state.groups)
	const students = useStudentsStore((state) => state.students)
	const navigate = useNavigate()

	const [searchQuery, setSearchQuery] = useState("")
	const [selectedGroup, setSelectedGroup] = useState<string>("all")
	const [selectedCourse, setSelectedCourse] = useState<string>("all")
	const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("all")

	// Get teacher's groups
	const teacherGroups = useMemo(() => {
		return groups.filter((g) => g.teacherId === teacherId)
	}, [groups, teacherId])

	// Get students from teacher's groups
	const teacherStudents = useMemo(() => {
		const groupNames = teacherGroups.map((g) => g.name)
		return students.filter((s) => {
			// Check if student is in any of teacher's groups
			return s.courses.some((c) => groupNames.includes(c.group)) || groupNames.includes(s.group)
		})
	}, [students, teacherGroups])

	// Get unique courses and groups for filters
	const uniqueCourses = useMemo(() => {
		const courses = new Set<string>()
		teacherStudents.forEach((s) => {
			s.courses.forEach((c) => {
				if (teacherGroups.some((g) => g.name === c.group)) {
					courses.add(c.name)
				}
			})
		})
		return Array.from(courses)
	}, [teacherStudents, teacherGroups])

	const uniqueGroups = useMemo(() => {
		return teacherGroups.map((g) => g.name)
	}, [teacherGroups])

	// Filter students
	const filteredStudents = useMemo(() => {
		return teacherStudents.filter((student) => {
			// Search filter
			if (
				searchQuery &&
				!student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!student.phone.includes(searchQuery)
			) {
				return false
			}

			// Group filter
			if (selectedGroup !== "all") {
				const inGroup = student.courses.some((c) => c.group === selectedGroup) || student.group === selectedGroup
				if (!inGroup) return false
			}

			// Course filter
			if (selectedCourse !== "all") {
				const inCourse = student.courses.some((c) => {
					return c.name === selectedCourse && teacherGroups.some((g) => g.name === c.group)
				})
				if (!inCourse) return false
			}

			// Payment status filter
			if (selectedPaymentStatus !== "all" && student.paymentStatus !== selectedPaymentStatus) {
				return false
			}

			// Attendance filter (simplified - would need actual attendance data)
			// For now, we'll skip this filter

			return true
		})
	}, [teacherStudents, searchQuery, selectedGroup, selectedCourse, selectedPaymentStatus, teacherGroups])

	// Calculate attendance percentage (simplified)
	const getAttendancePercentage = useCallback((studentId: string) => {
		// This would normally calculate from attendance records
		// For now, return a placeholder
		const student = students.find((s) => s.id === studentId)
		if (!student) return 0
		// Simple calculation based on attendance records
		const total = student.attendance.length
		if (total === 0) return 0
		const present = student.attendance.filter((a) => a.status === "present").length
		return Math.round((present / total) * 100)
	}, [students])

	const handleViewStudent = useCallback((studentId: string) => {
		navigate(`/talabalar/${studentId}`)
	}, [navigate])

	return (
		<div className="flex flex-col gap-4">
			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Filtrlar</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Ism bo'yicha qidirish..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>

						<div>
							<Select value={selectedGroup} onValueChange={setSelectedGroup}>
								<SelectTrigger>
									<SelectValue placeholder="Guruh bo'yicha" />
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

						<div>
							<Select value={selectedCourse} onValueChange={setSelectedCourse}>
								<SelectTrigger>
									<SelectValue placeholder="Kurs bo'yicha" />
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

						<div>
							<Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
								<SelectTrigger>
									<SelectValue placeholder="To'lov statusi" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Barcha</SelectItem>
									{Object.entries(PAYMENT_STATUS_LABELS_UZ).map(([key, label]) => (
										<SelectItem key={key} value={key}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Students Table */}
			<Card>
				<CardHeader>
					<CardTitle>O'quvchilar ro'yxati</CardTitle>
					<CardDescription>
						{filteredStudents.length} ta o'quvchi topildi
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>#</TableHead>
									<TableHead>Ism</TableHead>
									<TableHead>Kurs</TableHead>
									<TableHead>Guruh</TableHead>
									<TableHead>Davomat</TableHead>
									<TableHead>To'lov statusi</TableHead>
									<TableHead>Amallar</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredStudents.length > 0 ? (
									filteredStudents.map((student, index) => {
										// Get the course/group for this teacher
										const studentCourse = student.courses.find((c) =>
											teacherGroups.some((g) => g.name === c.group)
										) || student.courses[0]

										return (
											<TableRow key={student.id}>
												<TableCell>{index + 1}</TableCell>
												<TableCell>
													<button
														onClick={() => handleViewStudent(student.id)}
														className="cursor-pointer text-left hover:underline font-medium"
													>
														{student.fullName}
													</button>
												</TableCell>
												<TableCell>
													{studentCourse ? studentCourse.name : student.courses[0]?.name || "-"}
												</TableCell>
												<TableCell>
													{studentCourse ? studentCourse.group : student.group}
												</TableCell>
												<TableCell>
													{getAttendancePercentage(student.id)}%
												</TableCell>
												<TableCell>
													<Badge
														className={
															student.paymentStatus === "paid"
																? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
																: student.paymentStatus === "debt"
																	? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
																	: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
														}
													>
														{PAYMENT_STATUS_LABELS_UZ[student.paymentStatus]}
													</Badge>
												</TableCell>
												<TableCell>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleViewStudent(student.id)}
														className="cursor-pointer"
													>
														Profilga o'tish
													</Button>
												</TableCell>
											</TableRow>
										)
									})
								) : (
									<TableRow>
										<TableCell colSpan={7} className="text-center text-muted-foreground">
											O'quvchilar topilmadi
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

