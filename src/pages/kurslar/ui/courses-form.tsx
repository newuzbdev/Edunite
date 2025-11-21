"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
	useCoursesStore,
	COURSE_STATUS_LABELS_UZ,
	PRICE_TYPE_LABELS_UZ,
	FORMAT_LABELS_UZ,
	COURSE_CATEGORIES,
	DAYS_OF_WEEK_UZ,
	type PriceType,
	type CourseFormat,
	type CourseStatus,
	type DayOfWeek,
} from "../utils/courses-store"
import { toast } from "sonner"
import { useTeachersStore } from "@/pages/teachers.tsx/utils/teachers-store"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, BookOpen, DollarSign, Clock, Users, Calendar, Settings } from "lucide-react"

export default function CoursesForm() {
	const addCourse = useCoursesStore((state) => state.addCourse)
	const onClose = useCoursesStore((state) => state.onClose)
	const data = useCoursesStore((state) => state.data)
	const updateCourse = useCoursesStore((state) => state.updateCourse)
	const teachers = useTeachersStore((state) => state.teachers)

	const [name, setName] = useState("")
	const [category, setCategory] = useState(COURSE_CATEGORIES[0])
	const [shortDescription, setShortDescription] = useState("")
	const [fullDescription, setFullDescription] = useState("")
	const [priceType, setPriceType] = useState<PriceType>("monthly")
	const [price, setPrice] = useState("")
	const [discount, setDiscount] = useState("")
	const [duration, setDuration] = useState("")
	const [lessonsCount, setLessonsCount] = useState("")
	const [lessonDuration, setLessonDuration] = useState("")
	const [format, setFormat] = useState<CourseFormat>("offline")
	const [mainTeacherId, setMainTeacherId] = useState("")
	const [additionalTeacherIds, setAdditionalTeacherIds] = useState<string[]>([])
	const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([])
	const [scheduleTime, setScheduleTime] = useState("")
	const [status, setStatus] = useState<CourseStatus>("draft")

	function handleSubmit(e?: React.FormEvent) {
		e?.preventDefault()
		if (!name.trim() || !category || !mainTeacherId || selectedDays.length === 0 || !scheduleTime) {
			toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring")
			return
		}

		const selectedMainTeacher = teachers.find((t) => t.id === mainTeacherId)
		if (!selectedMainTeacher) {
			toast.error("Asosiy o'qituvchi tanlanmagan")
			return
		}

		const courseData = {
			name: name.trim(),
			category,
			shortDescription: shortDescription.trim(),
			fullDescription: fullDescription.trim(),
			priceType,
			price: priceType === "free" ? 0 : Number(price) || 0,
			discount: discount ? Number(discount) : undefined,
			duration: duration.trim(),
			lessonsCount: Number(lessonsCount) || 0,
			lessonDuration: Number(lessonDuration) || 60,
			format,
			mainTeacher: {
				id: selectedMainTeacher.id,
				fullName: selectedMainTeacher.fullName,
				phone: selectedMainTeacher.phone,
				isMain: true,
			},
			additionalTeachers: additionalTeacherIds
				.map((id) => {
					const teacher = teachers.find((t) => t.id === id)
					return teacher
						? {
								id: teacher.id,
								fullName: teacher.fullName,
								phone: teacher.phone,
								isMain: false,
							}
						: null
				})
				.filter((t): t is NonNullable<typeof t> => t !== null),
			schedule: {
				daysOfWeek: selectedDays,
				time: scheduleTime,
			},
			status,
		}

		if (data) {
			updateCourse({ ...data, ...courseData })
			toast.success("Kurs muvaffaqiyatli yangilandi")
			onClose()
		} else {
			addCourse(courseData)
			toast.success("Kurs muvaffaqiyatli qo'shildi")
			
			// Reset
			setName("")
			setCategory(COURSE_CATEGORIES[0])
			setShortDescription("")
			setFullDescription("")
			setPriceType("monthly")
			setPrice("")
			setDiscount("")
			setDuration("")
			setLessonsCount("")
			setLessonDuration("")
			setFormat("offline")
			setMainTeacherId("")
			setAdditionalTeacherIds([])
			setSelectedDays([])
			setScheduleTime("")
			setStatus("draft")
			onClose()
		}
	}

	useEffect(() => {
		if (data) {
			setName(data.name)
			setCategory(data.category)
			setShortDescription(data.shortDescription)
			setFullDescription(data.fullDescription)
			setPriceType(data.priceType)
			setPrice(data.price.toString())
			setDiscount(data.discount?.toString() || "")
			setDuration(data.duration)
			setLessonsCount(data.lessonsCount.toString())
			setLessonDuration(data.lessonDuration.toString())
			setFormat(data.format)
			setMainTeacherId(data.mainTeacher.id)
			setAdditionalTeacherIds(data.additionalTeachers.map((t) => t.id))
			setSelectedDays(data.schedule.daysOfWeek)
			setScheduleTime(data.schedule.time)
			setStatus(data.status)
		} else {
			setName("")
			setCategory(COURSE_CATEGORIES[0])
			setShortDescription("")
			setFullDescription("")
			setPriceType("monthly")
			setPrice("")
			setDiscount("")
			setDuration("")
			setLessonsCount("")
			setLessonDuration("")
			setFormat("offline")
			setMainTeacherId("")
			setAdditionalTeacherIds([])
			setSelectedDays([])
			setScheduleTime("")
			setStatus("draft")
		}
	}, [data])

	const toggleDay = (day: DayOfWeek) => {
		setSelectedDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
		)
	}

	return (
		<form onSubmit={handleSubmit} className="flex w-full flex-col gap-6 py-4">
			{/* 1. Asosiy ma'lumotlar */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<BookOpen className="h-4 w-4" />
						</div>
						<div>
							<CardTitle className="text-lg">1. Asosiy ma'lumotlar</CardTitle>
							<CardDescription>Kursning asosiy ma'lumotlarini kiriting</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="md:col-span-2">
						<Label className="mb-1 block text-sm font-medium">
							Kurs nomi <span className="text-destructive">*</span>
						</Label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Kurs nomini kiriting"
							required
						/>
					</div>

					<div>
						<Label className="mb-1 block text-sm font-medium">
							Kategoriya <span className="text-destructive">*</span>
						</Label>
						<Select value={category} onValueChange={setCategory}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Kategoriya tanlang" />
							</SelectTrigger>
							<SelectContent>
								{COURSE_CATEGORIES.map((cat) => (
									<SelectItem key={cat} value={cat}>
										{cat}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="md:col-span-2">
						<Label className="mb-1 block text-sm font-medium">Qisqacha tavsif</Label>
						<Input
							value={shortDescription}
							onChange={(e) => setShortDescription(e.target.value)}
							placeholder="Qisqacha tavsif"
						/>
					</div>

					<div className="md:col-span-2">
						<Label className="mb-1 block text-sm font-medium">Batafsil tavsif</Label>
						<Textarea
							value={fullDescription}
							onChange={(e) => setFullDescription(e.target.value)}
							placeholder="Batafsil tavsif"
							rows={4}
						/>
					</div>
				</div>
			</CardContent>
		</Card>

			{/* 2. Narxlash */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<DollarSign className="h-4 w-4" />
						</div>
						<div>
							<CardTitle className="text-lg">2. Narxlash</CardTitle>
							<CardDescription>Kurs narxini va to'lov turini belgilang</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label className="mb-1 block text-sm font-medium">
							Narx turi <span className="text-destructive">*</span>
						</Label>
						<Select value={priceType} onValueChange={(v: string) => setPriceType(v as PriceType)}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Narx turi" />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(PRICE_TYPE_LABELS_UZ).map(([key, label]) => (
									<SelectItem key={key} value={key}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{priceType !== "free" && (
						<>
							<div>
								<Label className="mb-1 block text-sm font-medium">
									Narxi (so'm) <span className="text-destructive">*</span>
								</Label>
								<Input
									type="number"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									placeholder="500000"
									required
								/>
							</div>

							<div>
								<Label className="mb-1 block text-sm font-medium">Chegirma (%)</Label>
								<Input
									type="number"
									value={discount}
									onChange={(e) => setDiscount(e.target.value)}
									placeholder="10"
									min="0"
									max="100"
								/>
							</div>
						</>
					)}
				</div>
			</CardContent>
		</Card>

			{/* 3. Davomiylik va format */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<Clock className="h-4 w-4" />
						</div>
						<div>
							<CardTitle className="text-lg">3. Davomiylik va format</CardTitle>
							<CardDescription>Kurs davomiyligi va formatini belgilang</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label className="mb-1 block text-sm font-medium">
							Kurs davomiyligi <span className="text-destructive">*</span>
						</Label>
						<Input
							value={duration}
							onChange={(e) => setDuration(e.target.value)}
							placeholder="4 hafta, 8 hafta, 2 oy..."
							required
						/>
					</div>

					<div>
						<Label className="mb-1 block text-sm font-medium">Darslar soni</Label>
						<Input
							type="number"
							value={lessonsCount}
							onChange={(e) => setLessonsCount(e.target.value)}
							placeholder="48"
							min="1"
						/>
					</div>

					<div>
						<Label className="mb-1 block text-sm font-medium">Har bir dars davomiyligi (daqiqa)</Label>
						<Input
							type="number"
							value={lessonDuration}
							onChange={(e) => setLessonDuration(e.target.value)}
							placeholder="60"
							min="1"
						/>
					</div>

					<div>
						<Label className="mb-1 block text-sm font-medium">
							Format <span className="text-destructive">*</span>
						</Label>
						<Select value={format} onValueChange={(v: string) => setFormat(v as CourseFormat)}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Format tanlang" />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(FORMAT_LABELS_UZ).map(([key, label]) => (
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

			{/* 4. O'qituvchi */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<Users className="h-4 w-4" />
						</div>
						<div>
							<CardTitle className="text-lg">4. O'qituvchi</CardTitle>
							<CardDescription>Asosiy va qo'shimcha o'qituvchilarni tanlang</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label className="mb-1 block text-sm font-medium">
							Asosiy o'qituvchi <span className="text-destructive">*</span>
						</Label>
						<Select value={mainTeacherId} onValueChange={setMainTeacherId}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="O'qituvchi tanlang" />
							</SelectTrigger>
							<SelectContent>
								{teachers.map((teacher) => (
									<SelectItem key={teacher.id} value={teacher.id}>
										{teacher.fullName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="md:col-span-2">
						<Label className="mb-2 block text-sm font-medium">Qo'shimcha o'qituvchi (ixtiyoriy)</Label>
						<Select
							value=""
							onValueChange={(value) => {
								if (value && !additionalTeacherIds.includes(value)) {
									setAdditionalTeacherIds([...additionalTeacherIds, value])
								}
							}}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Qo'shimcha o'qituvchi tanlang" />
							</SelectTrigger>
							<SelectContent>
								{teachers
									.filter((t) => t.id !== mainTeacherId && !additionalTeacherIds.includes(t.id))
									.map((teacher) => (
										<SelectItem key={teacher.id} value={teacher.id}>
											{teacher.fullName}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
						{additionalTeacherIds.length > 0 && (
							<div className="mt-3 flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/30">
								{additionalTeacherIds.map((id) => {
									const teacher = teachers.find((t) => t.id === id)
									return teacher ? (
										<Badge key={id} variant="secondary" className="gap-1.5 px-3 py-1.5">
											{teacher.fullName}
											<button
												type="button"
												onClick={() =>
													setAdditionalTeacherIds(additionalTeacherIds.filter((tid) => tid !== id))
												}
												className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
											>
												<X className="h-3 w-3" />
											</button>
										</Badge>
									) : null
								})}
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>

			{/* 5. Dars jadvali */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<Calendar className="h-4 w-4" />
						</div>
						<div>
							<CardTitle className="text-lg">5. Dars jadvali</CardTitle>
							<CardDescription>Dars kunlari va vaqtini belgilang</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="md:col-span-2">
							<Label className="mb-2 block text-sm font-medium">
								Haftaning qaysi kunlari <span className="text-destructive">*</span>
							</Label>
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 border rounded-lg bg-muted/30">
								{Object.entries(DAYS_OF_WEEK_UZ).map(([key, label]) => (
									<div key={key} className="flex items-center space-x-2">
										<Checkbox
											id={key}
											checked={selectedDays.includes(key as DayOfWeek)}
											onCheckedChange={() => toggleDay(key as DayOfWeek)}
										/>
										<Label
											htmlFor={key}
											className="text-sm font-normal cursor-pointer flex-1"
										>
											{label}
										</Label>
									</div>
								))}
							</div>
						</div>

						<div>
							<Label className="mb-1 block text-sm font-medium">
								Vaqti <span className="text-destructive">*</span>
							</Label>
							<Input
								type="time"
								value={scheduleTime}
								onChange={(e) => setScheduleTime(e.target.value)}
								required
								className="w-full"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* 6. Status */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<Settings className="h-4 w-4" />
						</div>
						<div>
							<CardTitle className="text-lg">6. Status</CardTitle>
							<CardDescription>Kurs holatini belgilang</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div>
						<Label className="mb-1 block text-sm font-medium">Status</Label>
						<Select value={status} onValueChange={(v: string) => setStatus(v as CourseStatus)}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Status tanlang" />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(COURSE_STATUS_LABELS_UZ).map(([key, label]) => (
									<SelectItem key={key} value={key}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Actions */}
			<div className="flex items-center justify-end gap-3 pt-6 border-t bg-background -mx-6 px-6 pb-2">
				<Button variant="outline" type="button" onClick={() => onClose()} className="cursor-pointer">
					Bekor qilish
				</Button>
				{!data && (
					<Button
						type="button"
						variant="outline"
						onClick={(e) => {
							e.preventDefault()
							setStatus("draft")
							handleSubmit(e)
						}}
						className="cursor-pointer"
					>
						Qoralama sifatida saqlash
					</Button>
				)}
				<Button type="submit" className="cursor-pointer">
					{data ? "Yangilash" : "Saqlash"}
				</Button>
			</div>
		</form>
	)
}

