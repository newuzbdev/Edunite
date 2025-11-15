"use client"

import React, { useState } from "react"
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
import { useLidsStore, COURSE_TYPES_UZ, STATUS_LABELS_UZ, SOURCE_LABELS_UZ, MANAGERS, type LidStatus, type LeadSource } from "../utils/lids-store"
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
	const [status, setStatus] = useState<LidStatus>("new")
	const [interestedDate, setInterestedDate] = useState(new Date().toISOString().split('T')[0])
	const [source, setSource] = useState<LeadSource | "">("")
	const [managerId, setManagerId] = useState("")
	const [comments, setComments] = useState("")
	const [suitableGroup, setSuitableGroup] = useState("")

	function handleSubmit(e?: React.FormEvent) {
		e?.preventDefault()
		if (!name.trim() || !phoneNumber.trim()) {
			toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring")
			return
		}

		const lidData = {
			name: name.trim(),
			phoneNumber: phoneNumber.trim(),
			courseType,
			status,
			interestedDate: new Date(interestedDate).toISOString(),
			source: source || undefined,
			managerId: managerId || undefined,
			managerName: managerId ? MANAGERS.find(m => m.id === managerId)?.name : undefined,
			comments: comments.trim() || undefined,
			suitableGroup: suitableGroup.trim() || undefined,
		}

		if (data) {
			// editing existing lid
			updateLid({ 
				...data,
				...lidData,
			})
			toast.success("Lead muvaffaqiyatli yangilandi")
		} else {
			addLid(lidData)
			toast.success("Lead muvaffaqiyatli qo'shildi")
		}
		// reset
		resetForm()
		onClose()
	}

	function resetForm() {
		setName("")
		setPhoneNumber("")
		setCourseType(COURSE_TYPES_UZ[0])
		setStatus("new")
		setInterestedDate(new Date().toISOString().split('T')[0])
		setSource("")
		setManagerId("")
		setComments("")
		setSuitableGroup("")
	}

	useEffect(() => {
		if (data) {
			setName(data.name)
			setPhoneNumber(data.phoneNumber)
			setCourseType(data.courseType)
			setStatus(data.status)
			setInterestedDate(new Date(data.interestedDate).toISOString().split('T')[0])
			setSource(data.source || "")
			setManagerId(data.managerId || "")
			setComments(data.comments || "")
			setSuitableGroup(data.suitableGroup || "")
		} else {
			// clear when no data
			resetForm()
		}
	}, [data])

	return (
		<form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<Label htmlFor="name" className="mb-1 block text-sm font-medium">
						Ism Familiya <span className="text-destructive">*</span>
					</Label>
					<Input 
						id="name"
						value={name} 
						onChange={e => setName(e.target.value)} 
						placeholder="Ism Familiya" 
						required
					/>
				</div>

				<div>
					<Label htmlFor="phone" className="mb-1 block text-sm font-medium">
						Telefon raqam <span className="text-destructive">*</span>
					</Label>
					<Input 
						id="phone"
						value={phoneNumber} 
						onChange={e => setPhoneNumber(e.target.value)} 
						placeholder="+998 90 123 45 67" 
						required
					/>
				</div>

				<div>
					<Label htmlFor="course" className="mb-1 block text-sm font-medium">
						Qiziqqan kurs <span className="text-destructive">*</span>
					</Label>
					<Select value={courseType} onValueChange={(v: string) => setCourseType(v)}>
						<SelectTrigger id="course" className="w-full">
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
					<Label htmlFor="date" className="mb-1 block text-sm font-medium">
						Qiziqqan vaqti
					</Label>
					<Input 
						id="date"
						type="date" 
						value={interestedDate} 
						onChange={e => setInterestedDate(e.target.value)} 
					/>
				</div>

				<div>
					<Label htmlFor="source" className="mb-1 block text-sm font-medium">
						Manba
					</Label>
					<Select value={source || undefined} onValueChange={(v: string) => setSource(v as LeadSource)}>
						<SelectTrigger id="source" className="w-full">
							<SelectValue placeholder="Manba tanlang (ixtiyoriy)" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(SOURCE_LABELS_UZ).map(([key, label]) => (
								<SelectItem key={key} value={key}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label htmlFor="group" className="mb-1 block text-sm font-medium">
						Qaysi guruhga mos?
					</Label>
					<Input 
						id="group"
						value={suitableGroup} 
						onChange={e => setSuitableGroup(e.target.value)} 
						placeholder="Guruh nomi (ixtiyoriy)" 
					/>
				</div>

				<div>
					<Label htmlFor="manager" className="mb-1 block text-sm font-medium">
						Mas'ul menedjer
					</Label>
					<Select value={managerId || undefined} onValueChange={(v: string) => setManagerId(v)}>
						<SelectTrigger id="manager" className="w-full">
							<SelectValue placeholder="Menedjer tanlang (ixtiyoriy)" />
						</SelectTrigger>
						<SelectContent>
							{MANAGERS.map(manager => (
								<SelectItem key={manager.id} value={manager.id}>
									{manager.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label htmlFor="status" className="mb-1 block text-sm font-medium">
						Status <span className="text-destructive">*</span>
					</Label>
					<Select value={status} onValueChange={(v: string) => setStatus(v as LidStatus)}>
						<SelectTrigger id="status" className="w-full">
							<SelectValue placeholder="Status tanlang" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(STATUS_LABELS_UZ).map(([key, label]) => (
								<SelectItem key={key} value={key}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div>
				<Label htmlFor="comments" className="mb-1 block text-sm font-medium">
					Izohlar
				</Label>
				<Textarea 
					id="comments"
					value={comments} 
					onChange={e => setComments(e.target.value)} 
					placeholder="Izohlar qo'shish (ixtiyoriy)" 
					rows={3}
				/>
			</div>

			<div className="flex items-center gap-2 pt-4 pb-4 border-t mt-4">
				<Button type="submit" className="cursor-pointer">{data ? "Yangilash" : "Qo'shish"}</Button>
				<Button variant="outline" type="button" onClick={() => onClose()} className="cursor-pointer">
					Bekor qilish
				</Button>
			</div>
		</form>
	)
}
