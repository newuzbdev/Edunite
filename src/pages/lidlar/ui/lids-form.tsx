"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useLidsStore, COURSE_TYPES_UZ, STATUS_LABELS_UZ } from "../utils/lids-store"
import { useEffect } from "react"
import { toast } from "sonner"

export default function LidsForm() {
	const addLid = useLidsStore(state => state.addLid)
	const onClose = useLidsStore(state => state.onClose)
	const data = useLidsStore(state => state.data)
	const updateLid = useLidsStore(state => state.updateLid)

	const [name, setName] = useState("")
	const [phoneNumber, setPhoneNumber] = useState("")
	const [courseType, setCourseType] = useState(COURSE_TYPES_UZ[0])
	const [status, setStatus] = useState<"interested" | "tested" | "failed" | "accepted">("interested")

	function handleSubmit(e?: React.FormEvent) {
		e?.preventDefault()
		if (!name.trim() || !phoneNumber.trim()) {
			toast.error("Iltimos, barcha maydonlarni to'ldiring")
			return
		}

		if (data) {
			// editing existing lid
			updateLid({ id: data.id, name: name.trim(), phoneNumber: phoneNumber.trim(), courseType, status })
			toast.success("Lid muvaffaqiyatli yangilandi")
		} else {
			addLid({ name: name.trim(), phoneNumber: phoneNumber.trim(), courseType, status })
			toast.success("Lid muvaffaqiyatli qo'shildi")
		}
		// reset
		setName("")
		setPhoneNumber("")
		setCourseType(COURSE_TYPES_UZ[0])
		setStatus("interested")
		onClose()
	}

	useEffect(() => {
		if (data) {
			setName(data.name)
			setPhoneNumber(data.phoneNumber)
			setCourseType(data.courseType)
			setStatus(data.status)
		} else {
			// clear when no data
			setName("")
			setPhoneNumber("")
			setCourseType(COURSE_TYPES_UZ[0])
			setStatus("interested")
		}
	}, [data])

	return (
		<form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 p-4">
			<div>
				<label className="mb-1 block text-sm font-medium">Ism</label>
				<Input value={name} onChange={e => setName(e.target.value)} placeholder="Ism" />
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium">Telefon raqam</label>
				<Input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+998 90 123 45 67" />
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium">Kurs turi</label>
				<Select value={courseType} onValueChange={(v: string) => setCourseType(v)}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Kurs tanlang" />
					</SelectTrigger>
					<SelectContent>
						{COURSE_TYPES_UZ.map(ct => (
							<SelectItem key={ct} value={ct}>
								{ct}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium">Status</label>
				<Select value={status} onValueChange={(v: string) => setStatus(v as any)}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Status tanlang" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="interested">{STATUS_LABELS_UZ.interested}</SelectItem>
						<SelectItem value="tested">{STATUS_LABELS_UZ.tested}</SelectItem>
						<SelectItem value="failed">{STATUS_LABELS_UZ.failed}</SelectItem>
						<SelectItem value="accepted">{STATUS_LABELS_UZ.accepted}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-2 pt-2">
				<Button type="submit" className="cursor-pointer">{data ? "Yangilash" : "Qo'shish"}</Button>
				<Button variant="outline" type="button" onClick={() => onClose()} className="cursor-pointer">
					Bekor qilish
				</Button>
			</div>
		</form>
	)
}
