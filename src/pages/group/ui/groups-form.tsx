"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
	useGroupsStore,
	GROUP_STATUS_LABELS_UZ,
	DAYS_OF_WEEK,
	type GroupStatus,
	type Course,
	type Teacher,
	type Room,
} from "../utils/groups-store"
import { toast } from "sonner"

// Mock data for courses, teachers, and rooms
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

export default function GroupsForm() {
	const addGroup = useGroupsStore((state) => state.addGroup)
	const onClose = useGroupsStore((state) => state.onClose)
	const data = useGroupsStore((state) => state.data)
	const updateGroup = useGroupsStore((state) => state.updateGroup)

	const [name, setName] = useState("")
	const [courseId, setCourseId] = useState("")
	const [teacherId, setTeacherId] = useState("")
	const [selectedDays, setSelectedDays] = useState<string[]>([])
	const [startTime, setStartTime] = useState("")
	const [endTime, setEndTime] = useState("")
	const [roomId, setRoomId] = useState("")
	const [maxStudents, setMaxStudents] = useState("")
	const [status, setStatus] = useState<GroupStatus>("active")
	const [zoomLink, setZoomLink] = useState("")

	function handleSubmit(e?: React.FormEvent) {
		e?.preventDefault()
		if (!name.trim() || !courseId || !teacherId || selectedDays.length === 0 || !startTime || !endTime) {
			toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring")
			return
		}

		const selectedCourse = mockCourses.find(c => c.id === courseId)
		const selectedTeacher = mockTeachers.find(t => t.id === teacherId)
		const selectedRoom = mockRooms.find(r => r.id === roomId)

		if (!selectedCourse || !selectedTeacher) {
			toast.error("Noto'g'ri kurs yoki o'qituvchi tanlandi")
			return
		}

		const schedule = `${selectedDays.join('-')}, ${startTime}-${endTime}`

		const groupData = {
			name: name.trim(),
			courseId,
			course: selectedCourse,
			teacherId,
			teacher: selectedTeacher,
			schedule,
			roomId: roomId || undefined,
			room: selectedRoom,
			maxStudents: parseInt(maxStudents) || 15,
			status,
			createdDate: data?.createdDate || new Date().toISOString().split("T")[0],
			zoomLink: zoomLink.trim() || undefined,
		}

		if (data) {
			updateGroup({ ...data, ...groupData })
			toast.success("Guruh muvaffaqiyatli yangilandi")
		} else {
			addGroup(groupData)
			toast.success("Guruh muvaffaqiyatli qo'shildi")
		}

		// Reset
		setName("")
		setCourseId("")
		setTeacherId("")
		setSelectedDays([])
		setStartTime("")
		setEndTime("")
		setRoomId("")
		setMaxStudents("")
		setStatus("active")
		setZoomLink("")
		onClose()
	}

	useEffect(() => {
		if (data) {
			setName(data.name)
			setCourseId(data.courseId)
			setTeacherId(data.teacherId)
			setRoomId(data.roomId || "")
			setMaxStudents(data.maxStudents.toString())
			setStatus(data.status)
			setZoomLink(data.zoomLink || "")

			// Parse schedule
			const scheduleParts = data.schedule.split(', ')
			if (scheduleParts.length >= 2) {
				const daysPart = scheduleParts[0]
				const timePart = scheduleParts[1]

				setSelectedDays(daysPart.split('-'))

				const times = timePart.split('-')
				if (times.length >= 2) {
					setStartTime(times[0])
					setEndTime(times[1])
				}
			}
		} else {
			setName("")
			setCourseId("")
			setTeacherId("")
			setSelectedDays([])
			setStartTime("")
			setEndTime("")
			setRoomId("")
			setMaxStudents("")
			setStatus("active")
			setZoomLink("")
		}
	}, [data])

	const handleDayToggle = (day: string) => {
		setSelectedDays(prev =>
			prev.includes(day)
				? prev.filter(d => d !== day)
				: [...prev, day]
		)
	}

	return (
		<form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 py-2">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<Label className="mb-1 block text-sm font-medium">Guruh nomi *</Label>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="GE-1, IELTS Evening, Math Kids"
					/>
				</div>

				<div>
					<Label className="mb-1 block text-sm font-medium">Kurs *</Label>
					<Select value={courseId} onValueChange={setCourseId}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Kurs tanlang" />
						</SelectTrigger>
						<SelectContent>
							{mockCourses.map((course) => (
								<SelectItem key={course.id} value={course.id}>
									{course.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label className="mb-1 block text-sm font-medium">O'qituvchi *</Label>
					<Select value={teacherId} onValueChange={setTeacherId}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="O'qituvchi tanlang" />
						</SelectTrigger>
						<SelectContent>
							{mockTeachers.map((teacher) => (
								<SelectItem key={teacher.id} value={teacher.id}>
									{teacher.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label className="mb-1 block text-sm font-medium">Xona / Joy</Label>
					<Select value={roomId} onValueChange={setRoomId}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Xona tanlang" />
						</SelectTrigger>
						<SelectContent>
							{mockRooms.map((room) => (
								<SelectItem key={room.id} value={room.id}>
									{room.name} ({room.capacity} kishi)
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label className="mb-1 block text-sm font-medium">Maksimal talaba soni</Label>
					<Input
						type="number"
						value={maxStudents}
						onChange={(e) => setMaxStudents(e.target.value)}
						placeholder="15"
						min="1"
					/>
				</div>

				<div>
					<Label className="mb-1 block text-sm font-medium">Status</Label>
					<Select value={status} onValueChange={(v: string) => setStatus(v as GroupStatus)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Status tanlang" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(GROUP_STATUS_LABELS_UZ).map(([key, label]) => (
								<SelectItem key={key} value={key}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label className="mb-1 block text-sm font-medium">Boshlanish vaqti *</Label>
					<Input
						type="time"
						value={startTime}
						onChange={(e) => setStartTime(e.target.value)}
					/>
				</div>

				<div>
					<Label className="mb-1 block text-sm font-medium">Tugash vaqti *</Label>
					<Input
						type="time"
						value={endTime}
						onChange={(e) => setEndTime(e.target.value)}
					/>
				</div>
			</div>

			<div>
				<Label className="mb-2 block text-sm font-medium">Dars kunlari *</Label>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
					{DAYS_OF_WEEK.map((day) => (
						<div key={day} className="flex items-center space-x-2">
							<Checkbox
								id={day}
								checked={selectedDays.includes(day)}
								onCheckedChange={() => handleDayToggle(day)}
							/>
							<Label htmlFor={day} className="text-sm">
								{day}
							</Label>
						</div>
					))}
				</div>
			</div>

			<div>
				<Label className="mb-1 block text-sm font-medium">Zoom link (ixtiyoriy)</Label>
				<Input
					value={zoomLink}
					onChange={(e) => setZoomLink(e.target.value)}
					placeholder="https://zoom.us/j/example"
				/>
			</div>

			<div className="flex items-center gap-2 pt-2">
				<Button type="submit" className="cursor-pointer">
					{data ? "Yangilash" : "Qo'shish"}
				</Button>
				<Button variant="outline" type="button" onClick={() => onClose()} className="cursor-pointer">
					Bekor qilish
				</Button>
			</div>
		</form>
	)
}