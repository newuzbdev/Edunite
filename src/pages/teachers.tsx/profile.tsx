"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useTeachersStore, TEACHER_STATUS_LABELS_UZ, WORK_TYPE_LABELS_UZ } from "./utils/teachers-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
	ArrowLeft,
	Edit,
	Phone,
	Calendar,
	BookOpen,
	Clock,
} from "lucide-react"
import { PageLayout } from "@/shared/layout/page-layout"
import TeacherSchedule from "./ui/teacher-schedule"
import TeacherStudents from "./ui/teacher-students"

export default function TeacherProfile() {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const teachers = useTeachersStore((state) => state.teachers)
	const onOpen = useTeachersStore((state) => state.onOpen)

	const teacher = teachers.find((t) => t.id === id)

	if (!teacher) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<p className="text-muted-foreground">O'qituvchi topilmadi</p>
				<Button onClick={() => navigate("/teachers")} className="cursor-pointer">
					Orqaga
				</Button>
			</div>
		)
	}

	const initials = teacher.fullName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2)

	const statusColors = {
		active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
		busy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
		inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
	}

	const getSalaryDisplay = () => {
		if (teacher.workType === "monthly" && teacher.salary) {
			return `${teacher.salary.toLocaleString("uz-UZ")} so'm`
		}
		if (teacher.workType === "rate" && teacher.rate) {
			return `Dars uchun ${teacher.rate.toLocaleString("uz-UZ")} so'm`
		}
		if (teacher.workType === "percentage" && teacher.percentage) {
			return `${teacher.percentage}%`
		}
		return "-"
	}

	return (
		<PageLayout
			title="O'qituvchi profili"
			description={`${teacher.fullName} - Batafsil ma'lumotlar`}
			headerActions={
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate("/teachers")}
					className="cursor-pointer"
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
			}
		>
			{/* Teacher Header Card */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-4">
							<Avatar className="h-20 w-20">
								<AvatarImage src={teacher.avatar} alt={teacher.fullName} />
								<AvatarFallback className="text-lg">{initials}</AvatarFallback>
							</Avatar>
							<div className="space-y-1">
								<CardTitle className="text-2xl">{teacher.fullName}</CardTitle>
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<span className="flex items-center gap-1">
										<Phone className="h-4 w-4" />
										{teacher.phone}
									</span>
									<span className="flex items-center gap-1">
										<Calendar className="h-4 w-4" />
										Ishga kirgan: {new Date(teacher.hireDate).toLocaleDateString("uz-UZ")}
									</span>
								</div>
								<div className="flex items-center gap-2 pt-2">
									<Badge className={statusColors[teacher.status]}>
										{TEACHER_STATUS_LABELS_UZ[teacher.status]}
									</Badge>
									<Badge variant="outline">
										{WORK_TYPE_LABELS_UZ[teacher.workType]}
									</Badge>
								</div>
								<div className="flex items-center gap-2 pt-2">
									<div className="flex items-center gap-1 text-sm text-muted-foreground">
										<BookOpen className="h-4 w-4" />
										<span>Fanlar: {teacher.subjects.map((s) => s.name).join(", ")}</span>
									</div>
								</div>
								<div className="flex items-center gap-1 text-sm text-muted-foreground pt-1">
									<Clock className="h-4 w-4" />
									<span>Ish kunlari: {teacher.workingDays.join(", ")}</span>
								</div>
								<div className="flex items-center gap-1 text-sm font-medium pt-2">
									<span>Maoshi/Stavkasi: {getSalaryDisplay()}</span>
								</div>
							</div>
						</div>
						<Button
							variant="outline"
							onClick={() => onOpen(teacher)}
							className="cursor-pointer"
						>
							<Edit className="mr-2 h-4 w-4" />
							Tahrirlash
						</Button>
					</div>
				</CardHeader>
			</Card>

			{/* Tabs */}
			<div className="mt-6">
				<Tabs defaultValue="schedule" className="w-full">
					<TabsList>
						<TabsTrigger value="schedule" className="cursor-pointer">
							Dars jadvali
						</TabsTrigger>
						<TabsTrigger value="students" className="cursor-pointer">
							O'quvchilar ro'yxati
						</TabsTrigger>
						<TabsTrigger value="reports" className="cursor-pointer">
							Hisobotlar
						</TabsTrigger>
					</TabsList>

					{/* Schedule Tab */}
					<TabsContent value="schedule" className="space-y-4 mt-6">
						<TeacherSchedule teacherId={teacher.id} />
					</TabsContent>

					{/* Students Tab */}
					<TabsContent value="students" className="space-y-4 mt-6">
						<TeacherStudents teacherId={teacher.id} />
					</TabsContent>

					{/* Reports Tab */}
					<TabsContent value="reports" className="space-y-4 mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Hisobotlar</CardTitle>
								<CardDescription>
									O'qituvchi hisobotlari tez orada qo'shiladi
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									Bu bo'limda o'qituvchi hisobotlari ko'rsatiladi.
								</p>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</PageLayout>
	)
}
