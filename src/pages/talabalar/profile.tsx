"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useStudentsStore, STUDENT_STATUS_LABELS_UZ, PAYMENT_TYPE_LABELS_UZ } from "./utils/students-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select"
import {
	ArrowLeft,
	Edit,
	Plus,
	Send,
	QrCode,
	Calendar,
	MapPin,
	FileText,
	User,
	Clock,
	CheckCircle2,
	XCircle,
	AlertCircle,
} from "lucide-react"
import { useState, useMemo } from "react"
import { toast } from "sonner"

export default function StudentProfile() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const students = useStudentsStore((state) => state.students)
	const addPayment = useStudentsStore((state) => state.addPayment)
	const addAttendance = useStudentsStore((state) => state.addAttendance)
	const addNote = useStudentsStore((state) => state.addNote)
	const onOpen = useStudentsStore((state) => state.onOpen)

	const student = students.find((s) => s.id === id)

	const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
	const [noteDialogOpen, setNoteDialogOpen] = useState(false)
	const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false)
	const [selectedGroup, setSelectedGroup] = useState<string>("all")

	// Payment form state
	const [paymentAmount, setPaymentAmount] = useState("")
	const [paymentType, setPaymentType] = useState<"cash" | "card" | "payme" | "click">("cash")
	const [paymentMonth, setPaymentMonth] = useState("")
	const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])

	// Note form state
	const [noteContent, setNoteContent] = useState("")

	// Attendance form state
	const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
	const [attendanceStatus, setAttendanceStatus] = useState<"present" | "absent" | "excused">("present")
	const [attendanceGroup, setAttendanceGroup] = useState("")

	const handleAddPayment = () => {
		if (!student || !paymentAmount || !paymentMonth || !paymentDate) {
			toast.error("Iltimos, barcha maydonlarni to'ldiring")
			return
		}

		addPayment(student.id, {
			date: paymentDate,
			amount: Number(paymentAmount),
			type: paymentType,
			month: paymentMonth,
			status: "paid",
		})

		toast.success("To'lov muvaffaqiyatli qo'shildi")
		setPaymentDialogOpen(false)
		setPaymentAmount("")
		setPaymentType("cash")
		setPaymentMonth("")
		setPaymentDate(new Date().toISOString().split("T")[0])
	}

	const handleAddNote = () => {
		if (!student || !noteContent.trim()) {
			toast.error("Iltimos, izoh kiriting")
			return
		}

		addNote(student.id, {
			date: new Date().toISOString().split("T")[0],
			author: "Admin", // In real app, get from auth context
			content: noteContent.trim(),
		})

		toast.success("Izoh muvaffaqiyatli qo'shildi")
		setNoteDialogOpen(false)
		setNoteContent("")
	}

	const handleAddAttendance = () => {
		if (!student || !attendanceDate || !attendanceGroup) {
			toast.error("Iltimos, barcha maydonlarni to'ldiring")
			return
		}

		addAttendance(student.id, {
			date: attendanceDate,
			group: attendanceGroup,
			status: attendanceStatus,
		})

		toast.success("Davomat muvaffaqiyatli qo'shildi")
		setAttendanceDialogOpen(false)
		setAttendanceDate(new Date().toISOString().split("T")[0])
		setAttendanceStatus("present")
		setAttendanceGroup("")
	}

	const handleSendReminder = () => {
		toast.info("Eslatma yuborildi (SMS/Telegram)")
	}

	const currentDebt = useMemo(() => {
		if (!student) return 0
		// Calculate debt based on payments and expected payments
		// This is a simplified calculation
		return 125000 // Placeholder
	}, [student])

	const deadlineDays = useMemo(() => {
		if (!student) return 0
		const nextPayment = new Date(student.nextPaymentDate)
		const today = new Date()
		const diff = Math.ceil((nextPayment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
		return diff
	}, [student])

	const filteredAttendance = useMemo(() => {
		if (!student) return []
		if (selectedGroup === "all") return student.attendance
		return student.attendance.filter((a) => a.group === selectedGroup)
	}, [student, selectedGroup])

	const attendanceStats = useMemo(() => {
		const total = filteredAttendance.length
		const present = filteredAttendance.filter((a) => a.status === "present").length
		const absent = filteredAttendance.filter((a) => a.status === "absent").length
		const excused = filteredAttendance.filter((a) => a.status === "excused").length
		return { total, present, absent, excused }
	}, [filteredAttendance])

	if (!student) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<p className="text-muted-foreground">Talaba topilmadi</p>
				<Button onClick={() => navigate("/talabalar")} className="cursor-pointer">
					Orqaga
				</Button>
			</div>
		)
	}

	const initials = student.fullName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2)

	const statusColors = {
		active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
		finished: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
		debtor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
	}

	return (
		<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			{/* Header */}
			<div className="flex items-center gap-4 px-4 lg:px-6">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate("/talabalar")}
					className="cursor-pointer"
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<h1 className="text-2xl font-semibold">Talaba profili</h1>
			</div>

			{/* Student Header Card */}
			<Card className="mx-4 lg:mx-6">
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-4">
							<Avatar className="h-20 w-20">
								<AvatarImage src="" alt={student.fullName} />
								<AvatarFallback className="text-lg">{initials}</AvatarFallback>
							</Avatar>
							<div className="space-y-1">
								<CardTitle className="text-2xl">{student.fullName}</CardTitle>
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<span className="flex items-center gap-1">
										<User className="h-4 w-4" />
										{student.phone}
									</span>
									<span className="flex items-center gap-1">
										<QrCode className="h-4 w-4" />
										{student.studentId}
									</span>
								</div>
								<div className="flex items-center gap-2 pt-2">
									<Badge className={statusColors[student.status]}>
										{STUDENT_STATUS_LABELS_UZ[student.status]}
									</Badge>
								</div>
							</div>
						</div>
						<Button
							variant="outline"
							onClick={() => onOpen(student)}
							className="cursor-pointer"
						>
							<Edit className="mr-2 h-4 w-4" />
							Tahrirlash
						</Button>
					</div>
				</CardHeader>
			</Card>

			{/* Tabs */}
			<div className="px-4 lg:px-6">
				<Tabs defaultValue="overview" className="w-full">
					<TabsList>
						<TabsTrigger value="overview" className="cursor-pointer">
							Umumiy
						</TabsTrigger>
						<TabsTrigger value="payments" className="cursor-pointer">
							To'lovlar
						</TabsTrigger>
						<TabsTrigger value="attendance" className="cursor-pointer">
							Davomat
						</TabsTrigger>
						<TabsTrigger value="notes" className="cursor-pointer">
							Eslatmalar
						</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value="overview" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>Talaba haqida ma'lumot</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div>
										<Label className="text-muted-foreground">To'liq ism</Label>
										<p className="font-medium">{student.fullName}</p>
									</div>
									<div>
										<Label className="text-muted-foreground">Telefon</Label>
										<p className="font-medium">{student.phone}</p>
									</div>
									{student.address && (
										<div>
											<Label className="text-muted-foreground flex items-center gap-1">
												<MapPin className="h-4 w-4" />
												Manzil
											</Label>
											<p className="font-medium">{student.address}</p>
										</div>
									)}
									{student.notes && (
										<div>
											<Label className="text-muted-foreground flex items-center gap-1">
												<FileText className="h-4 w-4" />
												Qo'shimcha izoh
											</Label>
											<p className="font-medium">{student.notes}</p>
										</div>
									)}
									<div>
										<Label className="text-muted-foreground flex items-center gap-1">
											<Calendar className="h-4 w-4" />
											Qo'shilgan sana
										</Label>
										<p className="font-medium">
											{new Date(student.joinedDate).toLocaleDateString("uz-UZ")}
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Kurslar</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{student.courses.map((course) => (
										<div key={course.id} className="space-y-2 border-b pb-4 last:border-0">
											<div>
												<Label className="text-muted-foreground">Kurs nomi</Label>
												<p className="font-medium">{course.name}</p>
											</div>
											<div>
												<Label className="text-muted-foreground">Guruh</Label>
												<p className="font-medium">{course.group}</p>
											</div>
											<div>
												<Label className="text-muted-foreground flex items-center gap-1">
													<Clock className="h-4 w-4" />
													Dars jadvali
												</Label>
												<p className="font-medium">{course.schedule}</p>
											</div>
											<div>
												<Label className="text-muted-foreground">O'qituvchi</Label>
												<p className="font-medium">{course.teacher}</p>
											</div>
										</div>
									))}
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Payments Tab */}
					<TabsContent value="payments" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-3">
							<Card>
								<CardHeader>
									<CardTitle>Qarzdorlik paneli</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									<div>
										<Label className="text-muted-foreground">Hozirgi qarz</Label>
										<p className="text-2xl font-bold text-red-600">
											{currentDebt.toLocaleString("uz-UZ")} so'm
										</p>
									</div>
									<div>
										<Label className="text-muted-foreground">Deadline</Label>
										<p className="text-lg font-medium">
											{deadlineDays > 0 ? `${deadlineDays} kun qoldi` : "Muddati o'tgan"}
										</p>
									</div>
									<div className="flex gap-2 pt-2">
										<Button
											size="sm"
											onClick={() => setPaymentDialogOpen(true)}
											className="cursor-pointer"
										>
											<Plus className="mr-2 h-4 w-4" />
											To'lov qo'shish
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={handleSendReminder}
											className="cursor-pointer"
										>
											<Send className="mr-2 h-4 w-4" />
											Eslatma yuborish
										</Button>
									</div>
								</CardContent>
							</Card>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>To'lovlar jadvali</CardTitle>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Sana</TableHead>
											<TableHead>To'lov miqdori</TableHead>
											<TableHead>To'lov turi</TableHead>
											<TableHead>To'langan oy</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{student.payments.length > 0 ? (
											student.payments.map((payment) => (
												<TableRow key={payment.id}>
													<TableCell>
														{new Date(payment.date).toLocaleDateString("uz-UZ")}
													</TableCell>
													<TableCell className="font-medium">
														{payment.amount.toLocaleString("uz-UZ")} so'm
													</TableCell>
													<TableCell>{PAYMENT_TYPE_LABELS_UZ[payment.type]}</TableCell>
													<TableCell>{payment.month}</TableCell>
													<TableCell>
														<Badge
															className={
																payment.status === "paid"
																	? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
																	: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
															}
														>
															{payment.status === "paid" ? "To'langan" : "Qarz"}
														</Badge>
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={5} className="text-center text-muted-foreground">
													To'lovlar mavjud emas
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Attendance Tab */}
					<TabsContent value="attendance" className="space-y-4">
						<div className="flex items-center justify-between">
							<Select value={selectedGroup} onValueChange={setSelectedGroup}>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Guruh tanlang" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Barcha guruhlar</SelectItem>
									{student.courses.map((course) => (
										<SelectItem key={course.id} value={course.group}>
											{course.group}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button
								onClick={() => setAttendanceDialogOpen(true)}
								className="cursor-pointer"
							>
								<Plus className="mr-2 h-4 w-4" />
								Davomat qo'shish
							</Button>
						</div>

						<div className="grid gap-4 md:grid-cols-4">
							<Card>
								<CardHeader className="pb-2">
									<CardDescription>Jami</CardDescription>
									<CardTitle className="text-2xl">{attendanceStats.total}</CardTitle>
								</CardHeader>
							</Card>
							<Card>
								<CardHeader className="pb-2">
									<CardDescription className="flex items-center gap-1">
										<CheckCircle2 className="h-4 w-4 text-green-600" />
										Kelgan
									</CardDescription>
									<CardTitle className="text-2xl text-green-600">
										{attendanceStats.present}
									</CardTitle>
								</CardHeader>
							</Card>
							<Card>
								<CardHeader className="pb-2">
									<CardDescription className="flex items-center gap-1">
										<XCircle className="h-4 w-4 text-red-600" />
										Kelmagan
									</CardDescription>
									<CardTitle className="text-2xl text-red-600">
										{attendanceStats.absent}
									</CardTitle>
								</CardHeader>
							</Card>
							<Card>
								<CardHeader className="pb-2">
									<CardDescription className="flex items-center gap-1">
										<AlertCircle className="h-4 w-4 text-yellow-600" />
										Sababli
									</CardDescription>
									<CardTitle className="text-2xl text-yellow-600">
										{attendanceStats.excused}
									</CardTitle>
								</CardHeader>
							</Card>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Davomat jadvali</CardTitle>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Sana</TableHead>
											<TableHead>Guruh</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredAttendance.length > 0 ? (
											filteredAttendance.map((attendance) => (
												<TableRow key={attendance.id}>
													<TableCell>
														{new Date(attendance.date).toLocaleDateString("uz-UZ")}
													</TableCell>
													<TableCell>{attendance.group}</TableCell>
													<TableCell>
														{attendance.status === "present" ? (
															<span className="text-green-600">⚪ Kelgan</span>
														) : attendance.status === "absent" ? (
															<span className="text-red-600">🔴 Kelmagan</span>
														) : (
															<span className="text-yellow-600">🟡 Sababli</span>
														)}
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={3} className="text-center text-muted-foreground">
													Davomat mavjud emas
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Notes Tab */}
					<TabsContent value="notes" className="space-y-4">
						<div className="flex justify-end">
							<Button onClick={() => setNoteDialogOpen(true)} className="cursor-pointer">
								<Plus className="mr-2 h-4 w-4" />
								Izoh qo'shish
							</Button>
						</div>

						<div className="space-y-4">
							{student.notesList.length > 0 ? (
								student.notesList.map((note) => (
									<Card key={note.id}>
										<CardHeader>
											<div className="flex items-center justify-between">
												<CardTitle className="text-base">{note.author}</CardTitle>
												<CardDescription>
													{new Date(note.date).toLocaleDateString("uz-UZ")}
												</CardDescription>
											</div>
										</CardHeader>
										<CardContent>
											<p>{note.content}</p>
										</CardContent>
									</Card>
								))
							) : (
								<Card>
									<CardContent className="py-8 text-center text-muted-foreground">
										Hech qanday izohlar mavjud emas
									</CardContent>
								</Card>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</div>

			{/* Payment Dialog */}
			<Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>To'lov qo'shish</DialogTitle>
						<DialogDescription>Yangi to'lov ma'lumotlarini kiriting</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<Label>To'lov miqdori</Label>
							<Input
								type="number"
								value={paymentAmount}
								onChange={(e) => setPaymentAmount(e.target.value)}
								placeholder="500000"
							/>
						</div>
						<div>
							<Label>To'lov turi</Label>
							<Select value={paymentType} onValueChange={(v: any) => setPaymentType(v)}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(PAYMENT_TYPE_LABELS_UZ).map(([key, label]) => (
										<SelectItem key={key} value={key}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>To'langan oy</Label>
							<Input
								value={paymentMonth}
								onChange={(e) => setPaymentMonth(e.target.value)}
								placeholder="Yanvar 2024"
							/>
						</div>
						<div>
							<Label>Sana</Label>
							<Input
								type="date"
								value={paymentDate}
								onChange={(e) => setPaymentDate(e.target.value)}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
							Bekor qilish
						</Button>
						<Button onClick={handleAddPayment}>Qo'shish</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Note Dialog */}
			<Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Izoh qo'shish</DialogTitle>
						<DialogDescription>Talaba uchun izoh qoldiring</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<Label>Izoh</Label>
							<Input
								value={noteContent}
								onChange={(e) => setNoteContent(e.target.value)}
								placeholder="Izoh matni..."
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setNoteDialogOpen(false)}>
							Bekor qilish
						</Button>
						<Button onClick={handleAddNote}>Qo'shish</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Attendance Dialog */}
			<Dialog open={attendanceDialogOpen} onOpenChange={setAttendanceDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Davomat qo'shish</DialogTitle>
						<DialogDescription>Davomat ma'lumotlarini kiriting</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<Label>Sana</Label>
							<Input
								type="date"
								value={attendanceDate}
								onChange={(e) => setAttendanceDate(e.target.value)}
							/>
						</div>
						<div>
							<Label>Guruh</Label>
							<Select value={attendanceGroup} onValueChange={setAttendanceGroup}>
								<SelectTrigger>
									<SelectValue placeholder="Guruh tanlang" />
								</SelectTrigger>
								<SelectContent>
									{student.courses.map((course) => (
										<SelectItem key={course.id} value={course.group}>
											{course.group}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>Status</Label>
							<Select
								value={attendanceStatus}
								onValueChange={(v: any) => setAttendanceStatus(v)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="present">⚪ Kelgan</SelectItem>
									<SelectItem value="absent">🔴 Kelmagan</SelectItem>
									<SelectItem value="excused">🟡 Sababli</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setAttendanceDialogOpen(false)}>
							Bekor qilish
						</Button>
						<Button onClick={handleAddAttendance}>Qo'shish</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

