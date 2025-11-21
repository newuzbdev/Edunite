"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
	ChevronLeft,
	ChevronRight,
	Edit,
	Users,
	MapPin,
	Clock,
} from "lucide-react"
import { useGroupsStore, type Lesson } from "../../group/utils/groups-store"
import { useTeachersStore } from "../utils/teachers-store"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Helper functions for date manipulation
const formatDate = (date: Date): string => {
	return date.getFullYear() + '-' +
		   String(date.getMonth() + 1).padStart(2, '0') + '-' +
		   String(date.getDate()).padStart(2, '0')
}

const formatDateDisplay = (date: Date): string => {
	const days = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']
	return days[date.getDay()] + ' ' + date.getDate()
}

const addDays = (date: Date, days: number): Date => {
	const result = new Date(date)
	result.setDate(result.getDate() + days)
	return result
}

const getWeekDays = (date: Date): Date[] => {
	const day = date.getDay()
	const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
	const monday = new Date(date.setDate(diff))
	const week = []
	for (let i = 0; i < 7; i++) {
		week.push(addDays(monday, i))
	}
	return week
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8) // 8:00 to 21:00

interface TeacherScheduleProps {
	teacherId: string
}

export default function TeacherSchedule({ teacherId }: TeacherScheduleProps) {
	const groups = useGroupsStore((state) => state.groups)
	const teachers = useTeachersStore((state) => state.teachers)
	const [currentWeek, setCurrentWeek] = useState(new Date())
	const [editDialogOpen, setEditDialogOpen] = useState(false)
	const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

	const teacher = teachers.find((t) => t.id === teacherId)
	const weekDays = useMemo(() => getWeekDays(currentWeek), [currentWeek])

	// Get all lessons for this teacher
	const teacherLessons = useMemo(() => {
		const allLessons: Array<Lesson & { groupName: string; courseName: string; roomName?: string; studentCount: number }> = []
		groups.forEach((group) => {
			if (group.teacherId === teacherId) {
				group.lessons.forEach((lesson) => {
					allLessons.push({
						...lesson,
						groupName: group.name,
						courseName: group.course.name,
						roomName: group.room?.name ?? '', // Ensure string, fallback to empty string if undefined
						studentCount: group.currentStudents,
					})
				})
			}
		})
		return allLessons
	}, [groups, teacherId])

	const lessonsByDayAndHour = useMemo(() => {
		const result: { [key: string]: { [hour: number]: typeof teacherLessons[0] } } = {}

		teacherLessons.forEach((lesson) => {
			const lessonDate = new Date(lesson.date)
			const dayKey = formatDate(lessonDate)
			const hour = parseInt(lesson.startTime.split(':')[0])

			if (!result[dayKey]) result[dayKey] = {}
			result[dayKey][hour] = lesson
		})

		return result
	}, [teacherLessons])

	const handlePreviousWeek = () => {
		setCurrentWeek(prev => addDays(prev, -7))
	}

	const handleNextWeek = () => {
		setCurrentWeek(prev => addDays(prev, 7))
	}

	const handleToday = () => {
		setCurrentWeek(new Date())
	}

	const handleLessonClick = (lesson: typeof teacherLessons[0]) => {
		setSelectedLesson(lesson)
		setEditDialogOpen(true)
	}

	const getLessonForSlot = (date: Date, hour: number) => {
		const dayKey = formatDate(date)
		return lessonsByDayAndHour[dayKey]?.[hour] || null
	}

	if (!teacher) {
		return <div>O'qituvchi topilmadi</div>
	}

	return (
		<div className="flex flex-col gap-4">
			{/* Controls */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Button variant="outline" size="sm" onClick={handlePreviousWeek} className="cursor-pointer">
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<h2 className="text-xl font-semibold min-w-[200px] text-center">
							{formatDateDisplay(weekDays[0])} - {formatDateDisplay(weekDays[6])}
						</h2>
						<Button variant="outline" size="sm" onClick={handleNextWeek} className="cursor-pointer">
							<ChevronRight className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm" onClick={handleToday} className="cursor-pointer">
							Bugun
						</Button>
					</div>
				</div>
			</div>

			{/* Calendar Grid */}
			<div className="overflow-x-auto">
				<div className="min-w-[800px]">
					{/* Header */}
					<div className="grid grid-cols-8 gap-1 mb-2">
						<div className="p-2 text-sm font-medium text-muted-foreground">Vaqt</div>
						{weekDays.map((day, index) => (
							<div key={index} className="p-2 text-center">
								<div className="text-sm font-medium">
									{['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'][index]}
								</div>
								<div className="text-lg font-bold">
									{day.getDate()}
								</div>
							</div>
						))}
					</div>

					{/* Time slots */}
					<div className="space-y-1">
						{HOURS.map((hour) => (
							<div key={hour} className="grid grid-cols-8 gap-1">
								<div className="p-2 text-sm text-muted-foreground border-r">
									{hour}:00
								</div>
								{weekDays.map((day, dayIndex) => {
									const lesson = getLessonForSlot(day, hour)

									return (
										<div
											key={dayIndex}
											className="min-h-[80px] border rounded-md p-1 cursor-pointer hover:bg-gray-50"
											onClick={() => lesson && handleLessonClick(lesson)}
										>
											{lesson && (
												<Card className="h-full bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors">
													<CardContent className="p-2 space-y-1">
														<div className="text-xs font-medium text-blue-900">
															{lesson.groupName}
														</div>
														<div className="text-xs text-blue-700">
															{lesson.courseName}
														</div>
														<div className="flex items-center gap-1 text-xs text-blue-600">
															<Clock className="h-3 w-3" />
															{lesson.startTime}–{lesson.endTime}
														</div>
														{lesson.roomName && (
															<div className="flex items-center gap-1 text-xs text-blue-600">
																<MapPin className="h-3 w-3" />
																Xona: {lesson.roomName}
															</div>
														)}
														<div className="flex items-center gap-1 text-xs text-blue-600">
															<Users className="h-3 w-3" />
															{lesson.studentCount} ta o'quvchi
														</div>
													</CardContent>
												</Card>
											)}
										</div>
									)
								})}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Edit Lesson Dialog */}
			<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Darsni o'zgartirish</DialogTitle>
						<DialogDescription>
							Dars vaqtini yoki boshqa ma'lumotlarni o'zgartiring
						</DialogDescription>
					</DialogHeader>
					{selectedLesson && (
						<div className="space-y-4 py-4">
							<div>
								<Label>Guruh</Label>
								<p className="font-medium">{selectedLesson.groupName}</p>
							</div>
							<div>
								<Label>Kurs</Label>
								<p className="font-medium">{selectedLesson.courseName}</p>
							</div>
							<div>
								<Label>Sana</Label>
								<Input
									type="date"
									value={selectedLesson.date}
									readOnly
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label>Boshlanish vaqti</Label>
									<Input
										type="time"
										value={selectedLesson.startTime}
										readOnly
									/>
								</div>
								<div>
									<Label>Tugash vaqti</Label>
									<Input
										type="time"
										value={selectedLesson.endTime}
										readOnly
									/>
								</div>
							</div>
							<div>
								<Label>Xona</Label>
								<p className="font-medium">{selectedLesson.roomName || "Belgilanmagan"}</p>
							</div>
							<div>
								<Label>O'quvchilar soni</Label>
								<p className="font-medium">{selectedLesson.studentCount} ta</p>
							</div>
						</div>
					)}
					<div className="flex justify-end gap-2">
						<Button variant="outline" onClick={() => setEditDialogOpen(false)} className="cursor-pointer">
							Yopish
						</Button>
						<Button className="cursor-pointer">
							<Edit className="mr-2 h-4 w-4" />
							Tahrirlash
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}

