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
	'Ona tili',
	'English',
	'IELTS',
	'Rus tili',
	'Matematika',
	'Fizika',
	'Kimyo',
	'Biologiya',
	'Tarix',
	'Boshqa',
]

export const useCoursesStore = create<CoursesStore>((set, get) => ({
	open: false,
	courses: [
		{
			id: '1',
			name: 'Ona tili - Boshlang\'ich',
			category: 'Ona tili',
			shortDescription: 'O\'zbek tili grammatikasi va adabiyot asoslari',
			fullDescription: 'O\'zbek tilining grammatik qoidalari, imlo, sintaksis va adabiyot asoslarini o\'rganish. Boshlang\'ich daraja uchun mo\'ljallangan.',
			priceType: 'monthly',
			price: 350000,
			duration: '3 oy',
			lessonsCount: 36,
			lessonDuration: 90,
			format: 'offline',
			mainTeacher: {
				id: '1',
				fullName: 'Dilbar Toshmatova',
				phone: '+998901234567',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['monday', 'wednesday', 'friday'],
				time: '16:00',
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
			name: 'English - Beginner',
			category: 'English',
			shortDescription: 'Ingliz tili boshlang\'ich daraja',
			fullDescription: 'Ingliz tilini noldan o\'rganish. Asosiy grammatika, lug\'at va gapirish ko\'nikmalarini rivojlantirish.',
			priceType: 'monthly',
			price: 450000,
			duration: '4 oy',
			lessonsCount: 48,
			lessonDuration: 90,
			format: 'offline',
			mainTeacher: {
				id: '2',
				fullName: 'Akmal O\'qituvchi',
				phone: '+998901234568',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['tuesday', 'thursday', 'saturday'],
				time: '17:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-10',
			updatedAt: '2024-01-10',
		},
		{
			id: '3',
			name: 'English - Intermediate',
			category: 'English',
			shortDescription: 'Ingliz tili o\'rta daraja',
			fullDescription: 'Ingliz tilini chuqurlashtirish. Muloqot ko\'nikmalarini rivojlantirish va grammatikani mustahkamlash.',
			priceType: 'monthly',
			price: 500000,
			duration: '4 oy',
			lessonsCount: 48,
			lessonDuration: 90,
			format: 'hybrid',
			mainTeacher: {
				id: '3',
				fullName: 'Gulnora Karimova',
				phone: '+998901234569',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['monday', 'wednesday', 'friday'],
				time: '18:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-05',
			updatedAt: '2024-01-05',
		},
		{
			id: '4',
			name: 'English - Advanced',
			category: 'English',
			shortDescription: 'Ingliz tili yuqori daraja',
			fullDescription: 'Ingliz tilini professional darajada o\'rganish. Muloqot, yozish va eshitish ko\'nikmalarini rivojlantirish.',
			priceType: 'monthly',
			price: 550000,
			duration: '3 oy',
			lessonsCount: 36,
			lessonDuration: 120,
			format: 'offline',
			mainTeacher: {
				id: '4',
				fullName: 'Bobur Ismoilov',
				phone: '+998901234570',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['tuesday', 'thursday'],
				time: '19:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-08',
			updatedAt: '2024-01-08',
		},
		{
			id: '5',
			name: 'IELTS tayyorlov',
			category: 'IELTS',
			shortDescription: 'IELTS imtihoniga tayyorlov kursi',
			fullDescription: 'IELTS imtihoniga professional tayyorlov. Barcha bo\'limlar: Reading, Writing, Listening, Speaking. Natijaga kafolat.',
			priceType: 'monthly',
			price: 650000,
			duration: '3 oy',
			lessonsCount: 36,
			lessonDuration: 120,
			format: 'hybrid',
			mainTeacher: {
				id: '5',
				fullName: 'Malika Yusupova',
				phone: '+998901234571',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['monday', 'wednesday', 'friday'],
				time: '17:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-12',
			updatedAt: '2024-01-12',
		},
		{
			id: '6',
			name: 'Ona tili - O\'rta',
			category: 'Ona tili',
			shortDescription: 'O\'zbek tili o\'rta daraja',
			fullDescription: 'O\'zbek tilining chuqur o\'rganilishi. Adabiyot, she\'riyat va nutq madaniyati.',
			priceType: 'monthly',
			price: 400000,
			duration: '3 oy',
			lessonsCount: 36,
			lessonDuration: 90,
			format: 'offline',
			mainTeacher: {
				id: '6',
				fullName: 'Feruza Alimova',
				phone: '+998901234572',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['tuesday', 'thursday'],
				time: '16:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-03',
			updatedAt: '2024-01-03',
		},
		{
			id: '7',
			name: 'Ona tili - Yuqori',
			category: 'Ona tili',
			shortDescription: 'O\'zbek tili yuqori daraja',
			fullDescription: 'O\'zbek tilining professional darajada o\'rganilishi. Adabiyotshunoslik va tilshunoslik asoslari.',
			priceType: 'monthly',
			price: 450000,
			duration: '4 oy',
			lessonsCount: 48,
			lessonDuration: 90,
			format: 'offline',
			mainTeacher: {
				id: '7',
				fullName: 'Sardor Valiyev',
				phone: '+998901234573',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['monday', 'wednesday', 'friday'],
				time: '17:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-07',
			updatedAt: '2024-01-07',
		},
		{
			id: '8',
			name: 'Rus tili - Boshlang\'ich',
			category: 'Rus tili',
			shortDescription: 'Rus tili boshlang\'ich daraja',
			fullDescription: 'Rus tilini noldan o\'rganish. Asosiy grammatika va lug\'at.',
			priceType: 'monthly',
			price: 400000,
			duration: '4 oy',
			lessonsCount: 48,
			lessonDuration: 90,
			format: 'offline',
			mainTeacher: {
				id: '8',
				fullName: 'Nigora Xasanova',
				phone: '+998901234574',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['tuesday', 'thursday', 'saturday'],
				time: '15:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-09',
			updatedAt: '2024-01-09',
		},
		{
			id: '9',
			name: 'Rus tili - O\'rta',
			category: 'Rus tili',
			shortDescription: 'Rus tili o\'rta daraja',
			fullDescription: 'Rus tilini chuqurlashtirish va muloqot ko\'nikmalarini rivojlantirish.',
			priceType: 'monthly',
			price: 450000,
			duration: '3 oy',
			lessonsCount: 36,
			lessonDuration: 90,
			format: 'hybrid',
			mainTeacher: {
				id: '9',
				fullName: 'Azizbek Usmonov',
				phone: '+998901234575',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['monday', 'wednesday', 'friday'],
				time: '18:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-11',
			updatedAt: '2024-01-11',
		},
		{
			id: '10',
			name: 'Matematika - 5-9 sinf',
			category: 'Matematika',
			shortDescription: 'Matematika maktab dasturi',
			fullDescription: '5-9 sinflar uchun matematika kursi. Algebra va geometriya asoslari.',
			priceType: 'monthly',
			price: 400000,
			duration: '9 oy',
			lessonsCount: 108,
			lessonDuration: 90,
			format: 'offline',
			mainTeacher: {
				id: '10',
				fullName: 'Javohir Karimov',
				phone: '+998901234576',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['tuesday', 'thursday'],
				time: '16:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-02',
			updatedAt: '2024-01-02',
		},
		{
			id: '11',
			name: 'Matematika - 10-11 sinf',
			category: 'Matematika',
			shortDescription: 'Matematika yuqori sinflar',
			fullDescription: '10-11 sinflar uchun matematika kursi. Imtihonlarga tayyorlov.',
			priceType: 'monthly',
			price: 500000,
			duration: '9 oy',
			lessonsCount: 108,
			lessonDuration: 120,
			format: 'offline',
			mainTeacher: {
				id: '11',
				fullName: 'Kamola Rahimova',
				phone: '+998901234577',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['monday', 'wednesday', 'friday'],
				time: '17:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-04',
			updatedAt: '2024-01-04',
		},
		{
			id: '12',
			name: 'Fizika - O\'rta maktab',
			category: 'Fizika',
			shortDescription: 'Fizika asoslari',
			fullDescription: 'Fizika fanining asosiy qonunlari va formulalari. Amaliy mashg\'ulotlar.',
			priceType: 'monthly',
			price: 450000,
			duration: '9 oy',
			lessonsCount: 108,
			lessonDuration: 90,
			format: 'offline',
			mainTeacher: {
				id: '12',
				fullName: 'Shohruh Mirzayev',
				phone: '+998901234578',
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
			createdAt: '2024-01-06',
			updatedAt: '2024-01-06',
		},
		{
			id: '13',
			name: 'Kimyo - O\'rta maktab',
			category: 'Kimyo',
			shortDescription: 'Kimyo fanining asoslari',
			fullDescription: 'Kimyo fanining asosiy tushunchalari, formulalar va reaksiyalar.',
			priceType: 'monthly',
			price: 450000,
			duration: '9 oy',
			lessonsCount: 108,
			lessonDuration: 90,
			format: 'offline',
			mainTeacher: {
				id: '13',
				fullName: 'Dilshoda Toshmatova',
				phone: '+998901234579',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['monday', 'wednesday'],
				time: '16:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-13',
			updatedAt: '2024-01-13',
		},
		{
			id: '14',
			name: 'Biologiya - O\'rta maktab',
			category: 'Biologiya',
			shortDescription: 'Biologiya fanining asoslari',
			fullDescription: 'Biologiya fanining asosiy tushunchalari va qonunlari.',
			priceType: 'monthly',
			price: 400000,
			duration: '9 oy',
			lessonsCount: 108,
			lessonDuration: 90,
			format: 'offline',
			mainTeacher: {
				id: '14',
				fullName: 'Madina Sobirova',
				phone: '+998901234580',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['thursday', 'saturday'],
				time: '15:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-14',
			updatedAt: '2024-01-14',
		},
		{
			id: '15',
			name: 'Tarix - O\'zbekiston tarixi',
			category: 'Tarix',
			shortDescription: 'O\'zbekiston tarixi',
			fullDescription: 'O\'zbekiston tarixining muhim davrlari va voqealari.',
			priceType: 'monthly',
			price: 350000,
			duration: '6 oy',
			lessonsCount: 72,
			lessonDuration: 90,
			format: 'offline',
			mainTeacher: {
				id: '15',
				fullName: 'Rustam Abdurahmonov',
				phone: '+998901234581',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['friday', 'saturday'],
				time: '14:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-15',
			updatedAt: '2024-01-15',
		},
		{
			id: '16',
			name: 'English - Kids (5-8 yosh)',
			category: 'English',
			shortDescription: 'Ingliz tili bolalar uchun',
			fullDescription: '5-8 yoshli bolalar uchun ingliz tili kursi. O\'yinlar va qiziqarli mashg\'ulotlar.',
			priceType: 'monthly',
			price: 400000,
			duration: '9 oy',
			lessonsCount: 108,
			lessonDuration: 60,
			format: 'offline',
			mainTeacher: {
				id: '16',
				fullName: 'Zarina Qodirova',
				phone: '+998901234582',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['saturday', 'sunday'],
				time: '10:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-16',
			updatedAt: '2024-01-16',
		},
		{
			id: '17',
			name: 'English - Teens (13-17 yosh)',
			category: 'English',
			shortDescription: 'Ingliz tili o\'smirlar uchun',
			fullDescription: '13-17 yoshli o\'smirlar uchun ingliz tili kursi. Zamonaviy metodlar.',
			priceType: 'monthly',
			price: 480000,
			duration: '9 oy',
			lessonsCount: 108,
			lessonDuration: 90,
			format: 'hybrid',
			mainTeacher: {
				id: '17',
				fullName: 'Farhod Jalilov',
				phone: '+998901234583',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['monday', 'wednesday', 'friday'],
				time: '16:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-17',
			updatedAt: '2024-01-17',
		},
		{
			id: '18',
			name: 'Ona tili - Imtihon tayyorlov',
			category: 'Ona tili',
			shortDescription: 'Ona tili imtihonlarga tayyorlov',
			fullDescription: 'O\'zbek tili bo\'yicha imtihonlarga tayyorlov. Test yechish va yozma ishlar.',
			priceType: 'monthly',
			price: 500000,
			duration: '6 oy',
			lessonsCount: 72,
			lessonDuration: 120,
			format: 'offline',
			mainTeacher: {
				id: '18',
				fullName: 'Yulduz Toshmatova',
				phone: '+998901234584',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['tuesday', 'thursday'],
				time: '18:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-18',
			updatedAt: '2024-01-18',
		},
		{
			id: '19',
			name: 'English Conversation',
			category: 'English',
			shortDescription: 'Ingliz tili gapirish kursi',
			fullDescription: 'Ingliz tilida erkin muloqot qilish ko\'nikmalarini rivojlantirish. Faqat gapirish.',
			priceType: 'monthly',
			price: 450000,
			duration: '2 oy',
			lessonsCount: 24,
			lessonDuration: 90,
			format: 'offline',
			mainTeacher: {
				id: '19',
				fullName: 'Nodira Xamidova',
				phone: '+998901234585',
				isMain: true,
			},
			additionalTeachers: [],
			schedule: {
				daysOfWeek: ['monday', 'wednesday', 'friday'],
				time: '19:00',
			},
			status: 'active',
			students: [],
			lessons: [],
			payments: [],
			createdAt: '2024-01-19',
			updatedAt: '2024-01-19',
		},
		{
			id: '20',
			name: 'Rus tili - Imtihon tayyorlov',
			category: 'Rus tili',
			shortDescription: 'Rus tili imtihonlarga tayyorlov',
			fullDescription: 'Rus tili bo\'yicha imtihonlarga tayyorlov. Test yechish va muloqot.',
			priceType: 'monthly',
			price: 500000,
			duration: '6 oy',
			lessonsCount: 72,
			lessonDuration: 120,
			format: 'offline',
			mainTeacher: {
				id: '20',
				fullName: 'Sanjar Rahimov',
				phone: '+998901234586',
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
			createdAt: '2024-01-20',
			updatedAt: '2024-01-20',
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

