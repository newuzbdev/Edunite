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
import {
	useTeachersStore,
	WORK_TYPE_LABELS_UZ,
	TEACHER_STATUS_LABELS_UZ,
	DAYS_OF_WEEK_SHORT,
	type WorkType,
	type TeacherStatus,
	type Subject,
} from "../utils/teachers-store"
import { toast } from "sonner"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const COMMON_SUBJECTS = [
	'English',
	'Math',
	'IELTS',
	'Physics',
	'Chemistry',
	'Biology',
	'Frontend',
	'Backend',
	'Fullstack',
	'UI/UX',
]

export default function TeachersForm() {
	const addTeacher = useTeachersStore((state) => state.addTeacher)
	const onClose = useTeachersStore((state) => state.onClose)
	const data = useTeachersStore((state) => state.data)
	const updateTeacher = useTeachersStore((state) => state.updateTeacher)

	const [fullName, setFullName] = useState("")
	const [phone, setPhone] = useState("")
	const [subjects, setSubjects] = useState<Subject[]>([])
	const [newSubject, setNewSubject] = useState("")
	const [workType, setWorkType] = useState<WorkType>("monthly")
	const [salary, setSalary] = useState("")
	const [rate, setRate] = useState("")
	const [percentage, setPercentage] = useState("")
	const [hireDate, setHireDate] = useState("")
	const [status, setStatus] = useState<TeacherStatus>("active")
	const [workingDays, setWorkingDays] = useState<string[]>([])

	function handleSubmit(e?: React.FormEvent) {
		e?.preventDefault()
		if (!fullName.trim() || !phone.trim() || subjects.length === 0) {
			toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring")
			return
		}

		if (workType === "monthly" && !salary.trim()) {
			toast.error("Iltimos, oylik maoshni kiriting")
			return
		}

		if (workType === "rate" && !rate.trim()) {
			toast.error("Iltimos, stavkani kiriting")
			return
		}

		if (workType === "percentage" && !percentage.trim()) {
			toast.error("Iltimos, foizni kiriting")
			return
		}

		const teacherData = {
			fullName: fullName.trim(),
			phone: phone.trim(),
			subjects,
			workType,
			salary: workType === "monthly" ? Number(salary) : undefined,
			rate: workType === "rate" ? Number(rate) : undefined,
			percentage: workType === "percentage" ? Number(percentage) : undefined,
			hireDate: hireDate || new Date().toISOString().split("T")[0],
			status,
			workingDays,
		}

		if (data) {
			updateTeacher({ ...data, ...teacherData })
			toast.success("O'qituvchi muvaffaqiyatli yangilandi")
		} else {
			addTeacher(teacherData)
			toast.success("O'qituvchi muvaffaqiyatli qo'shildi")
		}

		// Reset
		setFullName("")
		setPhone("")
		setSubjects([])
		setNewSubject("")
		setWorkType("monthly")
		setSalary("")
		setRate("")
		setPercentage("")
		setHireDate("")
		setStatus("active")
		setWorkingDays([])
		onClose()
	}

	function handleAddSubject() {
		if (!newSubject.trim()) return
		if (subjects.some((s) => s.name === newSubject.trim())) {
			toast.error("Bu fan allaqachon qo'shilgan")
			return
		}
		setSubjects([...subjects, { id: Date.now().toString(), name: newSubject.trim() }])
		setNewSubject("")
	}

	function handleRemoveSubject(subjectId: string) {
		setSubjects(subjects.filter((s) => s.id !== subjectId))
	}

	function handleToggleWorkingDay(day: string) {
		if (workingDays.includes(day)) {
			setWorkingDays(workingDays.filter((d) => d !== day))
		} else {
			setWorkingDays([...workingDays, day])
		}
	}

	useEffect(() => {
		if (data) {
			setFullName(data.fullName)
			setPhone(data.phone)
			setSubjects(data.subjects)
			setWorkType(data.workType)
			setSalary(data.salary?.toString() || "")
			setRate(data.rate?.toString() || "")
			setPercentage(data.percentage?.toString() || "")
			setHireDate(data.hireDate)
			setStatus(data.status)
			setWorkingDays(data.workingDays)
		} else {
			setFullName("")
			setPhone("")
			setSubjects([])
			setNewSubject("")
			setWorkType("monthly")
			setSalary("")
			setRate("")
			setPercentage("")
			setHireDate("")
			setStatus("active")
			setWorkingDays([])
		}
	}, [data])

	return (
		<form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 py-2">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<Label className="mb-1 block text-sm font-medium">To'liq ism *</Label>
					<Input
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						placeholder="Ism Familiya"
					/>
				</div>

				<div>
					<Label className="mb-1 block text-sm font-medium">Telefon raqam *</Label>
					<Input
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						placeholder="+998 90 123 45 67"
					/>
				</div>

				<div className="md:col-span-2">
					<Label className="mb-1 block text-sm font-medium">O'qitadigan fanlari *</Label>
					<div className="flex flex-wrap gap-2 mb-2">
						{subjects.map((subject) => (
							<Badge key={subject.id} variant="secondary" className="gap-1.5">
								{subject.name}
								<button
									type="button"
									onClick={() => handleRemoveSubject(subject.id)}
									className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						))}
					</div>
					<div className="flex gap-2">
						<Input
							value={newSubject}
							onChange={(e) => setNewSubject(e.target.value)}
							placeholder="Fan nomi"
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault()
									handleAddSubject()
								}
							}}
						/>
						<Button type="button" onClick={handleAddSubject} variant="outline">
							Qo'shish
						</Button>
					</div>
					<div className="mt-2 flex flex-wrap gap-1">
						{COMMON_SUBJECTS.filter((s) => !subjects.some((sub) => sub.name === s)).map((subject) => (
							<Button
								key={subject}
								type="button"
								variant="outline"
								size="sm"
								onClick={() => {
									setNewSubject(subject)
									handleAddSubject()
								}}
							>
								{subject}
							</Button>
						))}
					</div>
				</div>

				<div>
					<Label className="mb-1 block text-sm font-medium">Ish turi</Label>
					<Select value={workType} onValueChange={(v: string) => setWorkType(v as WorkType)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Ish turi tanlang" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(WORK_TYPE_LABELS_UZ).map(([key, label]) => (
								<SelectItem key={key} value={key}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{workType === "monthly" && (
					<div>
						<Label className="mb-1 block text-sm font-medium">Oylik maoshi *</Label>
						<Input
							type="number"
							value={salary}
							onChange={(e) => setSalary(e.target.value)}
							placeholder="3 000 000"
						/>
					</div>
				)}

				{workType === "rate" && (
					<div>
						<Label className="mb-1 block text-sm font-medium">Dars uchun stavka *</Label>
						<Input
							type="number"
							value={rate}
							onChange={(e) => setRate(e.target.value)}
							placeholder="40 000"
						/>
					</div>
				)}

				{workType === "percentage" && (
					<div>
						<Label className="mb-1 block text-sm font-medium">Foiz *</Label>
						<Input
							type="number"
							value={percentage}
							onChange={(e) => setPercentage(e.target.value)}
							placeholder="15"
						/>
					</div>
				)}

				<div>
					<Label className="mb-1 block text-sm font-medium">Ishga kirgan sana</Label>
					<Input
						type="date"
						value={hireDate}
						onChange={(e) => setHireDate(e.target.value)}
					/>
				</div>

				<div>
					<Label className="mb-1 block text-sm font-medium">Status</Label>
					<Select value={status} onValueChange={(v: string) => setStatus(v as TeacherStatus)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Status tanlang" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(TEACHER_STATUS_LABELS_UZ).map(([key, label]) => (
								<SelectItem key={key} value={key}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="md:col-span-2">
					<Label className="mb-1 block text-sm font-medium">Dars kunlari</Label>
					<div className="flex flex-wrap gap-2">
						{DAYS_OF_WEEK_SHORT.map((day) => (
							<Button
								key={day}
								type="button"
								variant={workingDays.includes(day) ? "default" : "outline"}
								size="sm"
								onClick={() => handleToggleWorkingDay(day)}
							>
								{day}
							</Button>
						))}
					</div>
				</div>
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
