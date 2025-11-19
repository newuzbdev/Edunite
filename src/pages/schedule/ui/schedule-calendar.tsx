"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
	ChevronLeft,
	ChevronRight,
	Plus,
} from "lucide-react"
import { useGroupsStore, type Lesson } from "../../group/utils/groups-store"
import LessonModal from "./lesson-modal"

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

export default function ScheduleCalendar() {
	const groups = useGroupsStore((state) => state.groups)
	const [currentWeek, setCurrentWeek] = useState(new Date())
	const [selectedTeacher, setSelectedTeacher] = useState<string>("all")
	const [selectedCourse, setSelectedCourse] = useState<string>("all")
	const [selectedRoom, setSelectedRoom] = useState<string>("all")
	const [selectedGroup, setSelectedGroup] = useState<string>("all")
	const [showLessonModal, setShowLessonModal] = useState(false)
	const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
	const [selectedDate, setSelectedDate] = useState<string>("")

	const weekDays = useMemo(() => getWeekDays(currentWeek), [currentWeek])

	const allLessons = useMemo(() => {
		const lessons: Lesson[] = []
		groups.forEach(group => {
			lessons.push(...group.lessons)
		})
		return lessons
	}, [groups])

	const filteredLessons = useMemo(() => {
		return allLessons.filter(lesson => {
			const group = groups.find(g => g.id === lesson.groupId)
			if (!group) return false

			if (selectedTeacher !== "all" && group.teacher.name !== selectedTeacher) return false
			if (selectedCourse !== "all" && group.course.name !== selectedCourse) return false
			if (selectedRoom !== "all" && group.room?.name !== selectedRoom) return false
			if (selectedGroup !== "all" && lesson.groupId !== selectedGroup) return false

			return true
		})
	}, [allLessons, groups, selectedTeacher, selectedCourse, selectedRoom, selectedGroup])

	const lessonsByDayAndHour = useMemo(() => {
		const result: { [key: string]: { [hour: number]: Lesson } } = {}

		filteredLessons.forEach(lesson => {
			const lessonDate = new Date(lesson.date)
			const dayKey = formatDate(lessonDate)
			const hour = parseInt(lesson.startTime.split(':')[0])

			if (!result[dayKey]) result[dayKey] = {}
			result[dayKey][hour] = lesson
		})

		return result
	}, [filteredLessons])

	const uniqueTeachers = useMemo(() => {
		const teachers = new Set<string>()
		groups.forEach(g => teachers.add(g.teacher.name))
		return Array.from(teachers)
	}, [groups])

	const uniqueCourses = useMemo(() => {
		const courses = new Set<string>()
		groups.forEach(g => courses.add(g.course.name))
		return Array.from(courses)
	}, [groups])

	const uniqueRooms = useMemo(() => {
		const rooms = new Set<string>()
		groups.forEach(g => {
			if (g.room) rooms.add(g.room.name)
		})
		return Array.from(rooms)
	}, [groups])

	const handlePreviousWeek = () => {
		setCurrentWeek(prev => addDays(prev, -7))
	}

	const handleNextWeek = () => {
		setCurrentWeek(prev => addDays(prev, 7))
	}

	const handleToday = () => {
		setCurrentWeek(new Date())
	}

	const handleLessonClick = (lesson: Lesson) => {
		setSelectedLesson(lesson)
		setShowLessonModal(true)
	}

	const handleTimeSlotClick = (date: Date, _hour: number) => {
		const dateStr = formatDate(date)
		setSelectedDate(dateStr)
		setSelectedLesson(null)
		setShowLessonModal(true)
	}

	const getLessonForSlot = (date: Date, hour: number) => {
		const dayKey = formatDate(date)
		return lessonsByDayAndHour[dayKey]?.[hour] || null
	}

	return (
		<div className="flex w-full min-w-0 flex-col gap-4 -m-2 lg:-m-3">
			<div className="min-h-[calc(100vh-8rem)] rounded-lg bg-white p-4 lg:p-6 shadow-sm">
				<div className="flex flex-col gap-4">
					<div className="mb-2">
						<h1 className="text-3xl font-bold">Dars Jadvali</h1>
						<p className="text-muted-foreground mt-1">Haftalik darslar jadvali</p>
					</div>

					{/* Controls */}
					<div className="flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<Button variant="outline" size="sm" onClick={handlePreviousWeek}>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<h2 className="text-xl font-semibold min-w-[200px] text-center">
									{formatDateDisplay(weekDays[0])} - {formatDateDisplay(weekDays[6])}
								</h2>
								<Button variant="outline" size="sm" onClick={handleNextWeek}>
									<ChevronRight className="h-4 w-4" />
								</Button>
								<Button variant="outline" size="sm" onClick={handleToday}>
									Bugun
								</Button>
							</div>
							<Button onClick={() => setShowLessonModal(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Dars qo'shish
							</Button>
						</div>

						{/* Filters */}
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<div className="space-y-2">
								<Label className="text-sm font-medium">O'qituvchi</Label>
								<Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
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
								<Label className="text-sm font-medium">Kurs</Label>
								<Select value={selectedCourse} onValueChange={setSelectedCourse}>
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
								<Label className="text-sm font-medium">Xona</Label>
								<Select value={selectedRoom} onValueChange={setSelectedRoom}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Barcha xonalar" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Barcha xonalar</SelectItem>
										{uniqueRooms.map((room) => (
											<SelectItem key={room} value={room}>
												{room}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label className="text-sm font-medium">Guruh</Label>
								<Select value={selectedGroup} onValueChange={setSelectedGroup}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Barcha guruhlar" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Barcha guruhlar</SelectItem>
										{groups.map((group) => (
											<SelectItem key={group.id} value={group.id}>
												{group.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
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
											const group = lesson ? groups.find(g => g.id === lesson.groupId) : null

											return (
												<div
													key={dayIndex}
													className="min-h-[60px] border rounded-md p-1 cursor-pointer hover:bg-gray-50"
													onClick={() => lesson ? handleLessonClick(lesson) : handleTimeSlotClick(day, hour)}
												>
													{lesson && group && (
														<Card className="h-full bg-blue-50 border-blue-200">
															<CardContent className="p-2">
																<div className="text-xs font-medium text-blue-900">
																	{group.name}
																</div>
																<div className="text-xs text-blue-700">
																	{group.course.name}
																</div>
																<div className="text-xs text-blue-600">
																	{group.teacher.name}
																</div>
																<div className="text-xs text-blue-600">
																	{lesson.startTime}-{lesson.endTime}
																</div>
																{lesson.roomId && (
																	<div className="text-xs text-blue-600">
																		{group.room?.name}
																	</div>
																)}
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
				</div>
			</div>

			<LessonModal
				open={showLessonModal}
				onOpenChange={setShowLessonModal}
				lesson={selectedLesson}
				selectedDate={selectedDate}
			/>
		</div>
	)
}