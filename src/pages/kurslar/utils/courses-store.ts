import { create } from 'zustand'

export type CourseStatus = 'active' | 'archived' | 'draft'
export type PriceType = 'monthly' | 'one_time' | 'free'
export type CourseFormat = 'offline' | 'online' | 'hybrid'
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface CourseTeacher {
	id: string
	fullName: string
	phone: string
	isMain: boolean
}

export interface CourseSchedule {
	daysOfWeek: DayOfWeek[]
	time: string // e.g., "18:00"
}

export interface CourseLesson {
	id: string
	date: string
	time: string
	room?: string
	title: string
	teacherId: string
	teacherName: string
	materials?: {
		id: string
		name: string
		type: 'pdf' | 'video' | 'other'
		url: string
	}[]
	attendance?: {
		studentId: string
		status: 'present' | 'absent' | 'excused'
	}[]
}

export interface CourseStudent {
	id: string
	fullName: string
	phone: string
	paymentStatus: 'paid' | 'debt' | 'deadline_near'
	enrolledDate: string
}

export interface CoursePayment {
	id: string
	studentId: string
	studentName: string
	date: string
	amount: number
	month: string
	type: 'cash' | 'card' | 'payme' | 'click'
	status: 'paid' | 'debt'
}

export interface Course {
	id: string
	name: string
	category: string
	shortDescription: string
	fullDescription: string
	priceType: PriceType
	price: number
	discount?: number
	duration: string // e.g., "4 hafta", "2 oy"
	lessonsCount: number
	lessonDuration: number // minutes
	format: CourseFormat
	mainTeacher: CourseTeacher
	additionalTeachers: CourseTeacher[]
	schedule: CourseSchedule
	status: CourseStatus
	students: CourseStudent[]
	lessons: CourseLesson[]
	payments: CoursePayment[]
	createdAt: string
	updatedAt: string
}

interface CoursesStore {
	open: boolean
	courses: Course[]
	data: Course | null
	onOpen: (data?: Course | null) => void
	onClose: () => void
	addCourse: (course: Omit<Course, 'id' | 'students' | 'lessons' | 'payments' | 'createdAt' | 'updatedAt'>) => void
	updateCourse: (course: Course) => void
	deleteCourse: (id: string) => void
	archiveCourse: (id: string) => void
	addStudent: (courseId: string, student: CourseStudent) => void
	removeStudent: (courseId: string, studentId: string) => void
	addLesson: (courseId: string, lesson: Omit<CourseLesson, 'id'>) => void
	updateLesson: (courseId: string, lessonId: string, lesson: Partial<CourseLesson>) => void
	addPayment: (courseId: string, payment: Omit<CoursePayment, 'id'>) => void
}

export const COURSE_STATUS_LABELS_UZ: Record<CourseStatus, string> = {
    active: 'Aktiv',
    archived: 'Arxivlangan',
    draft: ''
}

export const PRICE_TYPE_LABELS_UZ: Record<PriceType, string> = {
	monthly: 'Oylik',
	one_time: 'Bir martalik to\'lov',
	free: 'Bepul kurs',
}

export const FORMAT_LABELS_UZ: Record<CourseFormat, string> = {
	offline: 'Offline',
	online: 'Online',
	hybrid: 'Aralash',
}

export const DAYS_OF_WEEK_UZ: Record<DayOfWeek, string> = {
	monday: 'Dushanba',
	tuesday: 'Seshanba',
	wednesday: 'Chorshanba',
	thursday: 'Payshanba',
	friday: 'Juma',
	saturday: 'Shanba',
	sunday: 'Yakshanba',
}

export const COURSE_CATEGORIES = [
	'English',
	'Math',
	'IT',
	'IELTS',
	'Rus tili',
	'Frontend',
	'Backend',
	'Fullstack',
	'UI/UX dizayn',
	'Boshqa',
]

export const useCoursesStore = create<CoursesStore>((set, get) => ({
	open: false,
	courses: [
		{
			id: '1',
			name: 'Frontend kursi',
			category: 'IT',
			shortDescription: 'Zamonaviy web ilovalar yaratish',
			fullDescription: 'React, Vue, Angular kabi zamonaviy frameworklar bilan ishlashni o\'rganing. To\'liq praktik darslar va loyihalar.',
			priceType: 'monthly',
			price: 500000,
			duration: '4 oy',
			lessonsCount: 48,
			lessonDuration: 90,
			format: 'offline',
			mainTeacher: {
				id: '1',
				fullName: 'Akmal O\'qituvchi',
				phone: '+998901234567',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['monday', 'wednesday', 'friday'],
				time: '18:00',
			},
			status: 'active',
			students: [
				{
					id: 's1',
					fullName: 'Ali Ahmadov',
					phone: '+998901234567',
					paymentStatus: 'paid',
					enrolledDate: '2024-01-15',
				},
			],
			lessons: [],
			payments: [],
			createdAt: '2024-01-01',
			updatedAt: '2024-01-15',
		},
		{
			id: '2',
			name: 'IELTS tayyorlov',
			category: 'English',
			shortDescription: 'IELTS imtihoniga tayyorlov kursi',
			fullDescription: 'IELTS imtihoniga professional tayyorlov. Barcha bo\'limlar: Reading, Writing, Listening, Speaking.',
			priceType: 'monthly',
			price: 600000,
			duration: '3 oy',
			lessonsCount: 36,
			lessonDuration: 120,
			format: 'hybrid',
			mainTeacher: {
				id: '1',
				fullName: 'Akmal O\'qituvchi',
				phone: '+998901234567',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['tuesday', 'thursday'],
				time: '17:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-10',
			updatedAt: '2024-01-10',
		},
	],
	data: null,
	onOpen: (data?: Course | null) => set({ open: true, data: data || null }),
	onClose: () => set({ open: false, data: null }),
	addCourse: (course) => {
		const newCourse: Course = {
			id: Date.now().toString(),
			...course,
			students: [],
			lessons: [],
			payments: [],
			createdAt: new Date().toISOString().split('T')[0],
			updatedAt: new Date().toISOString().split('T')[0],
		}
		set({ courses: [...get().courses, newCourse], open: false, data: null })
	},
	updateCourse: (course) => {
		set({
			courses: get().courses.map((c) =>
				c.id === course.id ? { ...course, updatedAt: new Date().toISOString().split('T')[0] } : c
			),
			open: false,
			data: null,
		})
	},
	deleteCourse: (id) => {
		set({ courses: get().courses.filter((c) => c.id !== id) })
	},
	archiveCourse: (id) => {
		set({
			courses: get().courses.map((c) =>
				c.id === id ? { ...c, status: 'archived' as CourseStatus } : c
			),
		})
	},
	addStudent: (courseId, student) => {
		set({
			courses: get().courses.map((c) =>
				c.id === courseId ? { ...c, students: [...c.students, student] } : c
			),
		})
	},
	removeStudent: (courseId, studentId) => {
		set({
			courses: get().courses.map((c) =>
				c.id === courseId ? { ...c, students: c.students.filter((s) => s.id !== studentId) } : c
			),
		})
	},
	addLesson: (courseId, lesson) => {
		const newLesson: CourseLesson = {
			id: Date.now().toString(),
			...lesson,
		}
		set({
			courses: get().courses.map((c) =>
				c.id === courseId ? { ...c, lessons: [...c.lessons, newLesson] } : c
			),
		})
	},
	updateLesson: (courseId, lessonId, lesson) => {
		set({
			courses: get().courses.map((c) =>
				c.id === courseId
					? {
							...c,
							lessons: c.lessons.map((l) => (l.id === lessonId ? { ...l, ...lesson } : l)),
						}
					: c
			),
		})
	},
	addPayment: (courseId, payment) => {
		const newPayment: CoursePayment = {
			id: Date.now().toString(),
			...payment,
		}
		set({
			courses: get().courses.map((c) =>
				c.id === courseId ? { ...c, payments: [...c.payments, newPayment] } : c
			),
		})
	},
}))

