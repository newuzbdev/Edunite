"use client"

import { useState, useEffect } from "react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useGroupsStore, type Lesson, LESSON_TYPE_LABELS_UZ } from "../../group/utils/groups-store"
import { toast } from "sonner"

interface LessonModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	lesson: Lesson | null
	selectedDate: string
}

export default function LessonModal({ open, onOpenChange, lesson, selectedDate }: LessonModalProps) {
	const groups = useGroupsStore((state) => state.groups)
	const addLesson = useGroupsStore((state) => state.addLesson)
	const updateLesson = useGroupsStore((state) => state.updateLesson)
	const checkScheduleConflict = useGroupsStore((state) => state.checkScheduleConflict)

	const [groupId, setGroupId] = useState("")
	const [date, setDate] = useState("")
	const [startTime, setStartTime] = useState("")
	const [endTime, setEndTime] = useState("")
	const [roomId, setRoomId] = useState("")
	const [type, setType] = useState<"online" | "offline">("offline")
	const [notes, setNotes] = useState("")

	useEffect(() => {
		if (lesson) {
			setGroupId(lesson.groupId)
			setDate(lesson.date)
			setStartTime(lesson.startTime)
			setEndTime(lesson.endTime)
			setRoomId(lesson.roomId || "")
			setType(lesson.type)
			setNotes(lesson.notes || "")
		} else if (selectedDate) {
			setDate(selectedDate)
			setGroupId("")
			setStartTime("")
			setEndTime("")
			setRoomId("")
			setType("offline")
			setNotes("")
		}
	}, [lesson, selectedDate])

	const handleSubmit = () => {
		if (!groupId || !date || !startTime || !endTime) {
			toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring")
			return
		}

		const selectedGroup = groups.find(g => g.id === groupId)
		if (!selectedGroup) {
			toast.error("Guruh topilmadi")
			return
		}

		const roomName = roomId === 'online' 
			? 'Online' 
			: selectedGroup.room?.name || ''

		const fullLessonData = {
			groupId,
			date,
			startTime,
			endTime,
			teacherId: selectedGroup.teacherId,
			roomId: roomId || undefined,
			type,
			notes: notes || undefined,
			groupName: selectedGroup.name,
			courseName: selectedGroup.course.name,
			roomName,
			studentCount: selectedGroup.currentStudents,
		}

		// Check for conflicts (only if creating new lesson, not updating)
		if (!lesson && checkScheduleConflict(fullLessonData)) {
			toast.error("Bu vaqtda boshqa dars mavjud!")
			return
		}

		if (lesson) {
			updateLesson(lesson.id, {
				groupId,
				date,
				startTime,
				endTime,
				teacherId: selectedGroup.teacherId,
				roomId: roomId || undefined,
				type,
				notes: notes || undefined,
			})
			toast.success("Dars muvaffaqiyatli yangilandi")
		} else {
			addLesson(groupId, fullLessonData)
			toast.success("Dars muvaffaqiyatli qo'shildi")
		}

		onOpenChange(false)
	}

	const selectedGroup = groups.find(g => g.id === groupId)

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{lesson ? "Darsni tahrirlash" : "Dars qo'shish"}
					</DialogTitle>
					<DialogDescription>
						Dars ma'lumotlarini kiriting
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="group" className="text-right">
							Guruh *
						</Label>
						<Select value={groupId} onValueChange={setGroupId}>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Guruh tanlang" />
							</SelectTrigger>
							<SelectContent>
								{groups.map((group) => (
									<SelectItem key={group.id} value={group.id}>
										{group.name} - {group.course.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="date" className="text-right">
							Sana *
						</Label>
						<Input
							id="date"
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className="col-span-3"
						/>
					</div>

					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="startTime" className="text-right">
							Boshlanish *
						</Label>
						<Input
							id="startTime"
							type="time"
							value={startTime}
							onChange={(e) => setStartTime(e.target.value)}
							className="col-span-3"
						/>
					</div>

					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="endTime" className="text-right">
							Tugash *
						</Label>
						<Input
							id="endTime"
							type="time"
							value={endTime}
							onChange={(e) => setEndTime(e.target.value)}
							className="col-span-3"
						/>
					</div>

					{selectedGroup && (
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="room" className="text-right">
								Xona
							</Label>
							<Select value={roomId} onValueChange={setRoomId}>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Xona tanlang" />
								</SelectTrigger>
								<SelectContent>
									{selectedGroup.room && (
										<SelectItem value={selectedGroup.room.id}>
											{selectedGroup.room.name}
										</SelectItem>
									)}
									<SelectItem value="online">Online</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}

					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="type" className="text-right">
							Turi
						</Label>
						<Select value={type} onValueChange={(value: "online" | "offline") => setType(value)}>
							<SelectTrigger className="col-span-3">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="offline">{LESSON_TYPE_LABELS_UZ.offline}</SelectItem>
								<SelectItem value="online">{LESSON_TYPE_LABELS_UZ.online}</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="notes" className="text-right">
							Izoh
						</Label>
						<Textarea
							id="notes"
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							className="col-span-3"
							placeholder="Qo'shimcha izoh..."
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Bekor qilish
					</Button>
					<Button onClick={handleSubmit}>
						{lesson ? "Yangilash" : "Qo'shish"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}