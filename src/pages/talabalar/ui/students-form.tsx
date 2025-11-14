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
	useStudentsStore,
	COURSE_TYPES_UZ,
	PAYMENT_STATUS_LABELS_UZ,
	STUDENT_STATUS_LABELS_UZ,
	type PaymentStatus,
	type StudentStatus,
} from "../utils/students-store"
import { toast } from "sonner"

export default function StudentsForm() {
	const addStudent = useStudentsStore((state) => state.addStudent)
	const onClose = useStudentsStore((state) => state.onClose)
	const data = useStudentsStore((state) => state.data)
	const updateStudent = useStudentsStore((state) => state.updateStudent)

	const [fullName, setFullName] = useState("")
	const [phone, setPhone] = useState("")
	const [courseName, setCourseName] = useState(COURSE_TYPES_UZ[0])
	const [group, setGroup] = useState("")
	const [schedule, setSchedule] = useState("")
	const [teacher, setTeacher] = useState("")
	const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("paid")
	const [nextPaymentDate, setNextPaymentDate] = useState("")
	const [status, setStatus] = useState<StudentStatus>("active")
	const [address, setAddress] = useState("")
	const [notes, setNotes] = useState("")
	const [joinedDate, setJoinedDate] = useState("")
	const [studentId, setStudentId] = useState("")

	function handleSubmit(e?: React.FormEvent) {
		e?.preventDefault()
		if (!fullName.trim() || !phone.trim() || !group.trim()) {
			toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring")
			return
		}

		const studentData = {
			fullName: fullName.trim(),
			phone: phone.trim(),
			courses: [
				{
					id: data?.courses[0]?.id || Date.now().toString(),
					name: courseName,
					group,
					schedule: schedule || "Belgilanmagan",
					teacher: teacher || "Belgilanmagan",
				},
			],
			group,
			paymentStatus,
			nextPaymentDate: nextPaymentDate || new Date().toISOString().split("T")[0],
			status,
			address: address.trim() || undefined,
			notes: notes.trim() || undefined,
			joinedDate: joinedDate || new Date().toISOString().split("T")[0],
			studentId: studentId || `STU-${Date.now()}`,
		}

		if (data) {
			updateStudent({ ...data, ...studentData })
			toast.success("Talaba muvaffaqiyatli yangilandi")
		} else {
			addStudent(studentData)
			toast.success("Talaba muvaffaqiyatli qo'shildi")
		}

		// Reset
		setFullName("")
		setPhone("")
		setCourseName(COURSE_TYPES_UZ[0])
		setGroup("")
		setSchedule("")
		setTeacher("")
		setPaymentStatus("paid")
		setNextPaymentDate("")
		setStatus("active")
		setAddress("")
		setNotes("")
		setJoinedDate("")
		setStudentId("")
		onClose()
	}

	useEffect(() => {
		if (data) {
			setFullName(data.fullName)
			setPhone(data.phone)
			setCourseName(data.courses[0]?.name || COURSE_TYPES_UZ[0])
			setGroup(data.group)
			setSchedule(data.courses[0]?.schedule || "")
			setTeacher(data.courses[0]?.teacher || "")
			setPaymentStatus(data.paymentStatus)
			setNextPaymentDate(data.nextPaymentDate)
			setStatus(data.status)
			setAddress(data.address || "")
			setNotes(data.notes || "")
			setJoinedDate(data.joinedDate)
			setStudentId(data.studentId)
		} else {
			setFullName("")
			setPhone("")
			setCourseName(COURSE_TYPES_UZ[0])
			setGroup("")
			setSchedule("")
			setTeacher("")
			setPaymentStatus("paid")
			setNextPaymentDate("")
			setStatus("active")
			setAddress("")
			setNotes("")
			setJoinedDate("")
			setStudentId("")
		}
	}, [data])

	return (
		<form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 p-4">
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

			<div>
				<Label className="mb-1 block text-sm font-medium">Kurs turi</Label>
				<Select value={courseName} onValueChange={(v: string) => setCourseName(v)}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Kurs tanlang" />
					</SelectTrigger>
					<SelectContent>
						{COURSE_TYPES_UZ.map((ct) => (
							<SelectItem key={ct} value={ct}>
								{ct}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label className="mb-1 block text-sm font-medium">Guruh *</Label>
				<Input
					value={group}
					onChange={(e) => setGroup(e.target.value)}
					placeholder="Guruh nomi"
				/>
			</div>

			<div>
				<Label className="mb-1 block text-sm font-medium">Dars jadvali</Label>
				<Input
					value={schedule}
					onChange={(e) => setSchedule(e.target.value)}
					placeholder="Dushanba, Chorshanba, Juma - 18:00"
				/>
			</div>

			<div>
				<Label className="mb-1 block text-sm font-medium">O'qituvchi</Label>
				<Input
					value={teacher}
					onChange={(e) => setTeacher(e.target.value)}
					placeholder="O'qituvchi ismi"
				/>
			</div>

			<div>
				<Label className="mb-1 block text-sm font-medium">To'lov statusi</Label>
				<Select
					value={paymentStatus}
					onValueChange={(v: string) => setPaymentStatus(v as PaymentStatus)}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Status tanlang" />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(PAYMENT_STATUS_LABELS_UZ).map(([key, label]) => (
							<SelectItem key={key} value={key}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label className="mb-1 block text-sm font-medium">Keyingi to'lov sanasi</Label>
				<Input
					type="date"
					value={nextPaymentDate}
					onChange={(e) => setNextPaymentDate(e.target.value)}
				/>
			</div>

			<div>
				<Label className="mb-1 block text-sm font-medium">Status</Label>
				<Select value={status} onValueChange={(v: string) => setStatus(v as StudentStatus)}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Status tanlang" />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(STUDENT_STATUS_LABELS_UZ).map(([key, label]) => (
							<SelectItem key={key} value={key}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<Label className="mb-1 block text-sm font-medium">Manzil</Label>
				<Input
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					placeholder="Manzil"
				/>
			</div>

			<div>
				<Label className="mb-1 block text-sm font-medium">Qo'shimcha izoh</Label>
				<Input
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					placeholder="Izoh"
				/>
			</div>

			<div>
				<Label className="mb-1 block text-sm font-medium">Qo'shilgan sana</Label>
				<Input
					type="date"
					value={joinedDate}
					onChange={(e) => setJoinedDate(e.target.value)}
				/>
			</div>

			<div>
				<Label className="mb-1 block text-sm font-medium">Student ID</Label>
				<Input
					value={studentId}
					onChange={(e) => setStudentId(e.target.value)}
					placeholder="STU-001"
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

