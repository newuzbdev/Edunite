"use client"

import { useParams, useNavigate } from "react-router-dom"
import {
	useCoursesStore,
	COURSE_STATUS_LABELS_UZ,
	PRICE_TYPE_LABELS_UZ,
	FORMAT_LABELS_UZ,
	DAYS_OF_WEEK_UZ,
} from "./utils/courses-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
	DollarSign,
	Trash2,
	Archive,
	UserPlus,
	X,
} from "lucide-react"
import { useState, useMemo } from "react"
import { toast } from "sonner"
import { PageLayout } from "@/shared/layout/page-layout"
import { PAYMENT_TYPE_LABELS_UZ } from "@/pages/talabalar/utils/students-store"

export default function CourseDetail() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const courses = useCoursesStore((state) => state.courses)
	const deleteCourse = useCoursesStore((state) => state.deleteCourse)
	const archiveCourse = useCoursesStore((state) => state.archiveCourse)
	const addStudent = useCoursesStore((state) => state.addStudent)
	const removeStudent = useCoursesStore((state) => state.removeStudent)
	const addLesson = useCoursesStore((state) => state.addLesson)
	const addPayment = useCoursesStore((state) => state.addPayment)
	const onOpen = useCoursesStore((state) => state.onOpen)

	const course = courses.find((c) => c.id === id)

	const [lessonDialogOpen, setLessonDialogOpen] = useState(false)
	const [studentDialogOpen, setStudentDialogOpen] = useState(false)
	const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)

	// Lesson form state
	const [lessonTitle, setLessonTitle] = useState("")
	const [lessonDate, setLessonDate] = useState("")
	const [lessonTime, setLessonTime] = useState("")
	const [lessonRoom, setLessonRoom] = useState("")
	const [lessonTeacherId, setLessonTeacherId] = useState("")

	// Student form state
	const [studentName, setStudentName] = useState("")
	const [studentPhone, setStudentPhone] = useState("")

	// Payment form state
	const [paymentStudentId, setPaymentStudentId] = useState("")
	const [paymentAmount, setPaymentAmount] = useState("")
	const [paymentType, setPaymentType] = useState<"cash" | "card" | "payme" | "click">("cash")
	const [paymentMonth, setPaymentMonth] = useState("")
	const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])

	if (!course) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<p className="text-muted-foreground">Kurs topilmadi</p>
				<Button onClick={() => navigate("/kurslar")} className="cursor-pointer">
					Orqaga
				</Button>
			</div>
		)
	}

	const handleAddLesson = () => {
		if (!course || !lessonTitle || !lessonDate || !lessonTime || !lessonTeacherId) {
			toast.error("Iltimos, barcha maydonlarni to'ldiring")
			return
		}

		const teacher = course.mainTeacher.id === lessonTeacherId
			? course.mainTeacher
			: course.additionalTeachers.find((t) => t.id === lessonTeacherId)

		if (!teacher) {
			toast.error("O'qituvchi topilmadi")
			return
		}

		addLesson(course.id, {
			date: lessonDate,
			time: lessonTime,
			room: lessonRoom || undefined,
			title: lessonTitle,
			teacherId: teacher.id,
			teacherName: teacher.fullName,
		})

		toast.success("Dars muvaffaqiyatli qo'shildi")
		setLessonDialogOpen(false)
		setLessonTitle("")
		setLessonDate("")
		setLessonTime("")
		setLessonRoom("")
		setLessonTeacherId("")
	}

	const handleAddStudent = () => {
		if (!course || !studentName || !studentPhone) {
			toast.error("Iltimos, barcha maydonlarni to'ldiring")
			return
		}

		addStudent(course.id, {
			id: Date.now().toString(),
			fullName: studentName,
			phone: studentPhone,
			paymentStatus: "debt",
			enrolledDate: new Date().toISOString().split("T")[0],
		})

		toast.success("Talaba muvaffaqiyatli qo'shildi")
		setStudentDialogOpen(false)
		setStudentName("")
		setStudentPhone("")
	}

	const handleAddPayment = () => {
		if (!course || !paymentStudentId || !paymentAmount || !paymentMonth || !paymentDate) {
			toast.error("Iltimos, barcha maydonlarni to'ldiring")
			return
		}

		const student = course.students.find((s) => s.id === paymentStudentId)
		if (!student) {
			toast.error("Talaba topilmadi")
			return
		}

		addPayment(course.id, {
			studentId: paymentStudentId,
			studentName: student.fullName,
			date: paymentDate,
			amount: Number(paymentAmount),
			month: paymentMonth,
			type: paymentType,
			status: "paid",
		})

		toast.success("To'lov muvaffaqiyatli qo'shildi")
		setPaymentDialogOpen(false)
		setPaymentStudentId("")
		setPaymentAmount("")
		setPaymentType("cash")
		setPaymentMonth("")
		setPaymentDate(new Date().toISOString().split("T")[0])
	}

	const handleDelete = () => {
		if (!course) return
		deleteCourse(course.id)
		toast.success("Kurs muvaffaqiyatli o'chirildi")
		navigate("/kurslar")
	}

	const handleArchive = () => {
		if (!course) return
		archiveCourse(course.id)
		toast.success("Kurs arxivlandi")
		setArchiveDialogOpen(false)
	}

	const totalRevenue = useMemo(() => {
		return course.payments.reduce((sum, p) => sum + p.amount, 0)
	}, [course.payments])

	const attendanceRate = useMemo(() => {
		if (course.lessons.length === 0) return 0
		const totalAttendances = course.lessons.reduce((sum, lesson) => {
			if (!lesson.attendance) return sum
			return sum + lesson.attendance.filter((a) => a.status === "present").length
		}, 0)
		const totalPossible = course.lessons.length * course.students.length
		return totalPossible > 0 ? Math.round((totalAttendances / totalPossible) * 100) : 0
	}, [course.lessons, course.students])

	const completionRate = useMemo(() => {
		if (course.lessonsCount === 0) return 0
		return Math.round((course.lessons.length / course.lessonsCount) * 100)
	}, [course.lessons.length, course.lessonsCount])

	const statusColors = {
		active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
		archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
		draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
	}

	const scheduleDays = course.schedule.daysOfWeek.map((day) => DAYS_OF_WEEK_UZ[day]).join(", ")

	return (
		<PageLayout
			title={course.name}
			description={course.shortDescription}
			headerActions={
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/kurslar")}
						className="cursor-pointer"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						onClick={() => onOpen(course)}
						className="cursor-pointer"
					>
						<Edit className="mr-2 h-4 w-4" />
						Tahrirlash
					</Button>
				</div>
			}
		>
			{/* Overview Card */}
			<Card className="mb-6">
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="space-y-2">
							<div className="flex items-center gap-3">
								<CardTitle className="text-2xl">{course.name}</CardTitle>
								<Badge className={statusColors[course.status]}>
									{COURSE_STATUS_LABELS_UZ[course.status]}
								</Badge>
							</div>
							<CardDescription>{course.shortDescription}</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div>
							<Label className="text-muted-foreground text-sm">O'qituvchi</Label>
							<p className="font-medium">{course.mainTeacher.fullName}</p>
						</div>
						<div>
							<Label className="text-muted-foreground text-sm">Davomiyligi</Label>
							<p className="font-medium">{course.duration}</p>
						</div>
						<div>
							<Label className="text-muted-foreground text-sm">Narxi</Label>
							<p className="font-medium">
								{course.priceType === "free"
									? "Bepul"
									: `${course.price.toLocaleString("uz-UZ")} so'm / ${PRICE_TYPE_LABELS_UZ[course.priceType]}`}
							</p>
						</div>
						<div>
							<Label className="text-muted-foreground text-sm">Talabalar soni</Label>
							<p className="font-medium">{course.students.length}</p>
						</div>
						<div>
							<Label className="text-muted-foreground text-sm">Kategoriya</Label>
							<p className="font-medium">{course.category}</p>
						</div>
						<div>
							<Label className="text-muted-foreground text-sm">Format</Label>
							<p className="font-medium">{FORMAT_LABELS_UZ[course.format]}</p>
						</div>
						<div>
							<Label className="text-muted-foreground text-sm">Dars jadvali</Label>
							<p className="font-medium">{scheduleDays}, {course.schedule.time}</p>
						</div>
						<div>
							<Label className="text-muted-foreground text-sm">Darslar soni</Label>
							<p className="font-medium">{course.lessons.length} / {course.lessonsCount}</p>
						</div>
					</div>
					{course.fullDescription && (
						<div className="mt-4 pt-4 border-t">
							<Label className="text-muted-foreground text-sm">Batafsil tavsif</Label>
							<p className="mt-1 text-sm">{course.fullDescription}</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Tabs */}
			<Tabs defaultValue="overview" className="w-full">
				<TabsList>
					<TabsTrigger value="overview" className="cursor-pointer">
						Umumiy ko'rinish
					</TabsTrigger>
					<TabsTrigger value="lessons" className="cursor-pointer">
						Darslar jadvali
					</TabsTrigger>
					<TabsTrigger value="students" className="cursor-pointer">
						Talabalar
					</TabsTrigger>
					<TabsTrigger value="payments" className="cursor-pointer">
						To'lovlar
					</TabsTrigger>
					<TabsTrigger value="analytics" className="cursor-pointer">
						Hisobotlar
					</TabsTrigger>
					<TabsTrigger value="settings" className="cursor-pointer">
						Sozlamalar
					</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-3">
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Jami daromad</CardDescription>
								<CardTitle className="text-2xl">{totalRevenue.toLocaleString("uz-UZ")} so'm</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Talabalar davomati</CardDescription>
								<CardTitle className="text-2xl">{attendanceRate}%</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Bitiruv foizi</CardDescription>
								<CardTitle className="text-2xl">{completionRate}%</CardTitle>
							</CardHeader>
						</Card>
					</div>
				</TabsContent>

				{/* Lessons Tab */}
				<TabsContent value="lessons" className="space-y-4">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">Darslar jadvali</h3>
						<Button onClick={() => setLessonDialogOpen(true)} className="cursor-pointer">
							<Plus className="mr-2 h-4 w-4" />
							Dars qo'shish
						</Button>
					</div>

					<Card>
						<CardContent className="p-0">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Sana</TableHead>
										<TableHead>Vaqt</TableHead>
										<TableHead>Dars nomi</TableHead>
										<TableHead>O'qituvchi</TableHead>
										<TableHead>Auditoriya</TableHead>
										<TableHead>Davomat</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{course.lessons.length > 0 ? (
										course.lessons.map((lesson) => (
											<TableRow key={lesson.id}>
												<TableCell>
													{new Date(lesson.date).toLocaleDateString("uz-UZ")}
												</TableCell>
												<TableCell>{lesson.time}</TableCell>
												<TableCell>{lesson.title}</TableCell>
												<TableCell>{lesson.teacherName}</TableCell>
												<TableCell>{lesson.room || "-"}</TableCell>
												<TableCell>
													{lesson.attendance
														? `${lesson.attendance.filter((a) => a.status === "present").length} / ${course.students.length}`
														: "-"}
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={6} className="text-center text-muted-foreground">
												Hozircha darslar mavjud emas
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Students Tab */}
				<TabsContent value="students" className="space-y-4">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">Talabalar ro'yxati</h3>
						<Button onClick={() => setStudentDialogOpen(true)} className="cursor-pointer">
							<UserPlus className="mr-2 h-4 w-4" />
							Talaba qo'shish
						</Button>
					</div>

					<Card>
						<CardContent className="p-0">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Ism</TableHead>
										<TableHead>Telefon</TableHead>
										<TableHead>To'lov statusi</TableHead>
										<TableHead>Qo'shilgan sana</TableHead>
										<TableHead>Amallar</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{course.students.length > 0 ? (
										course.students.map((student) => {
											const statusColors = {
												paid: "bg-green-100 text-green-800",
												debt: "bg-red-100 text-red-800",
												deadline_near: "bg-yellow-100 text-yellow-800",
											}
											return (
												<TableRow key={student.id}>
													<TableCell>
														<button
															onClick={() => navigate(`/talabalar/${student.id}`)}
															className="hover:underline font-medium cursor-pointer"
														>
															{student.fullName}
														</button>
													</TableCell>
													<TableCell>{student.phone}</TableCell>
													<TableCell>
														<Badge className={statusColors[student.paymentStatus]}>
															{student.paymentStatus === "paid"
																? "To'langan"
																: student.paymentStatus === "debt"
																? "Qarzdor"
																: "Deadline yaqin"}
														</Badge>
													</TableCell>
													<TableCell>
														{new Date(student.enrolledDate).toLocaleDateString("uz-UZ")}
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<Button
																size="sm"
																variant="outline"
																onClick={() => {
																	setPaymentStudentId(student.id)
																	setPaymentDialogOpen(true)
																}}
																className="cursor-pointer"
															>
																<DollarSign className="h-4 w-4" />
															</Button>
															<Button
																size="sm"
																variant="outline"
																onClick={() => {
																	removeStudent(course.id, student.id)
																	toast.success("Talaba kursdan olib tashlandi")
																}}
																className="cursor-pointer text-destructive"
															>
																<X className="h-4 w-4" />
															</Button>
														</div>
													</TableCell>
												</TableRow>
											)
										})
									) : (
										<TableRow>
											<TableCell colSpan={5} className="text-center text-muted-foreground">
												Hozircha talabalar mavjud emas
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Payments Tab */}
				<TabsContent value="payments" className="space-y-4">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">To'lovlar tarixi</h3>
						<Button onClick={() => setPaymentDialogOpen(true)} className="cursor-pointer">
							<Plus className="mr-2 h-4 w-4" />
							To'lov qo'shish
						</Button>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Jami tushgan daromad</CardTitle>
							<CardDescription className="text-2xl font-bold text-green-600">
								{totalRevenue.toLocaleString("uz-UZ")} so'm
							</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Talaba</TableHead>
										<TableHead>Sana</TableHead>
										<TableHead>Miqdor</TableHead>
										<TableHead>To'lov turi</TableHead>
										<TableHead>Oy</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{course.payments.length > 0 ? (
										course.payments.map((payment) => (
											<TableRow key={payment.id}>
												<TableCell>{payment.studentName}</TableCell>
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
																? "bg-green-100 text-green-800"
																: "bg-red-100 text-red-800"
														}
													>
														{payment.status === "paid" ? "To'langan" : "Qarz"}
													</Badge>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={6} className="text-center text-muted-foreground">
												Hozircha to'lovlar mavjud emas
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Analytics Tab */}
				<TabsContent value="analytics" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Kurs daromadi</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-green-600">
									{totalRevenue.toLocaleString("uz-UZ")} so'm
								</div>
								<p className="text-sm text-muted-foreground mt-2">
									{course.payments.length} ta to'lov
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Talabalar davomati</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold">{attendanceRate}%</div>
								<p className="text-sm text-muted-foreground mt-2">
									O'rtacha davomat foizi
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Bitiruv foizi</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold">{completionRate}%</div>
								<p className="text-sm text-muted-foreground mt-2">
									{course.lessons.length} / {course.lessonsCount} dars
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Talabalar soni</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold">{course.students.length}</div>
								<p className="text-sm text-muted-foreground mt-2">
									Kursga yozilgan talabalar
								</p>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Settings Tab */}
				<TabsContent value="settings" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Kurs sozlamalari</CardTitle>
							<CardDescription>Kurs ma'lumotlarini o'zgartirish va boshqarish</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between p-4 border rounded-lg">
								<div>
									<p className="font-medium">Kurs nomini o'zgartirish</p>
									<p className="text-sm text-muted-foreground">
										Hozirgi nom: {course.name}
									</p>
								</div>
								<Button variant="outline" onClick={() => onOpen(course)} className="cursor-pointer">
									<Edit className="mr-2 h-4 w-4" />
									Tahrirlash
								</Button>
							</div>

							<div className="flex items-center justify-between p-4 border rounded-lg">
								<div>
									<p className="font-medium">Narxni o'zgartirish</p>
									<p className="text-sm text-muted-foreground">
										Hozirgi narx:{" "}
										{course.priceType === "free"
											? "Bepul"
											: `${course.price.toLocaleString("uz-UZ")} so'm`}
									</p>
								</div>
								<Button variant="outline" onClick={() => onOpen(course)} className="cursor-pointer">
									<Edit className="mr-2 h-4 w-4" />
									Tahrirlash
								</Button>
							</div>

							<div className="flex items-center justify-between p-4 border rounded-lg">
								<div>
									<p className="font-medium">Kursni arxivlash</p>
									<p className="text-sm text-muted-foreground">
										Kursni arxivga o'tkazish
									</p>
								</div>
								<Button
									variant="outline"
									onClick={() => setArchiveDialogOpen(true)}
									className="cursor-pointer"
								>
									<Archive className="mr-2 h-4 w-4" />
									Arxivlash
								</Button>
							</div>

							<div className="flex items-center justify-between p-4 border rounded-lg border-destructive">
								<div>
									<p className="font-medium text-destructive">Kursni o'chirish</p>
									<p className="text-sm text-muted-foreground">
										Bu amalni qaytarib bo'lmaydi
									</p>
								</div>
								<Button
									variant="destructive"
									onClick={() => setDeleteDialogOpen(true)}
									className="cursor-pointer"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									O'chirish
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Lesson Dialog */}
			<Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Dars qo'shish</DialogTitle>
						<DialogDescription>Yangi dars ma'lumotlarini kiriting</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<Label>Dars nomi</Label>
							<Input
								value={lessonTitle}
								onChange={(e) => setLessonTitle(e.target.value)}
								placeholder="Dars nomi"
							/>
						</div>
						<div>
							<Label>Sana</Label>
							<Input
								type="date"
								value={lessonDate}
								onChange={(e) => setLessonDate(e.target.value)}
							/>
						</div>
						<div>
							<Label>Vaqt</Label>
							<Input
								type="time"
								value={lessonTime}
								onChange={(e) => setLessonTime(e.target.value)}
							/>
						</div>
						<div>
							<Label>Auditoriya (ixtiyoriy)</Label>
							<Input
								value={lessonRoom}
								onChange={(e) => setLessonRoom(e.target.value)}
								placeholder="Auditoriya nomi"
							/>
						</div>
						<div>
							<Label>O'qituvchi</Label>
							<Select value={lessonTeacherId} onValueChange={setLessonTeacherId}>
								<SelectTrigger>
									<SelectValue placeholder="O'qituvchi tanlang" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={course.mainTeacher.id}>
										{course.mainTeacher.fullName} (Asosiy)
									</SelectItem>
									{course.additionalTeachers.map((teacher) => (
										<SelectItem key={teacher.id} value={teacher.id}>
											{teacher.fullName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setLessonDialogOpen(false)}>
							Bekor qilish
						</Button>
						<Button onClick={handleAddLesson}>Qo'shish</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Student Dialog */}
			<Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Talaba qo'shish</DialogTitle>
						<DialogDescription>Yangi talaba ma'lumotlarini kiriting</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<Label>Ism Familiya</Label>
							<Input
								value={studentName}
								onChange={(e) => setStudentName(e.target.value)}
								placeholder="Ism Familiya"
							/>
						</div>
						<div>
							<Label>Telefon</Label>
							<Input
								value={studentPhone}
								onChange={(e) => setStudentPhone(e.target.value)}
								placeholder="+998901234567"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setStudentDialogOpen(false)}>
							Bekor qilish
						</Button>
						<Button onClick={handleAddStudent}>Qo'shish</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Payment Dialog */}
			<Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>To'lov qo'shish</DialogTitle>
						<DialogDescription>Yangi to'lov ma'lumotlarini kiriting</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<Label>Talaba</Label>
							<Select value={paymentStudentId} onValueChange={setPaymentStudentId}>
								<SelectTrigger>
									<SelectValue placeholder="Talaba tanlang" />
								</SelectTrigger>
								<SelectContent>
									{course.students.map((student) => (
										<SelectItem key={student.id} value={student.id}>
											{student.fullName}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
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

			{/* Delete Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Kursni o'chirish</DialogTitle>
						<DialogDescription>
							&quot;{course.name}&quot; ni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
							Bekor qilish
						</Button>
						<Button variant="destructive" onClick={handleDelete}>
							O'chirish
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Archive Dialog */}
			<Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Kursni arxivlash</DialogTitle>
						<DialogDescription>
							&quot;{course.name}&quot; ni arxivga o'tkazishni xohlaysizmi?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setArchiveDialogOpen(false)}>
							Bekor qilish
						</Button>
						<Button onClick={handleArchive}>Arxivlash</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</PageLayout>
	)
}

