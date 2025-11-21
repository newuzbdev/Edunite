import { create } from 'zustand'

export type TeacherStatus = 'active' | 'busy' | 'inactive'
export type WorkType = 'monthly' | 'rate' | 'percentage'

export interface Subject {
	id: string
	name: string
}

export interface TeacherGroup {
	id: string
	name: string
	course: string
	studentCount: number
}

export interface TeacherLesson {
	id: string
	groupId: string
	groupName: string
	courseName: string
	date: string
	startTime: string
	endTime: string
	room: string
	studentCount: number
}

export interface Teacher {
	id: string
	fullName: string
	phone: string
	avatar?: string
	subjects: Subject[]
	workType: WorkType
	salary?: number // Monthly salary
	rate?: number // Rate per lesson
	percentage?: number // Percentage
	hireDate: string
	status: TeacherStatus
	groups: TeacherGroup[]
	lessons: TeacherLesson[]
	attendance: {
		last30Days: number // Percentage
	}
	workingDays: string[] // e.g., ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum']
}

interface TeachersStore {
	open: boolean
	teachers: Teacher[]
	data: Teacher | null
	onOpen: (data?: Teacher | null) => void
	onClose: () => void
	addTeacher: (teacher: Omit<Teacher, 'id' | 'groups' | 'lessons' | 'attendance'>) => void
	updateTeacher: (teacher: Teacher) => void
	deleteTeacher: (id: string) => void
	archiveTeacher: (id: string) => void
}

export const TEACHER_STATUS_LABELS_UZ: Record<TeacherStatus, string> = {
	active: 'Aktiv',
	busy: 'Band',
	inactive: 'Nofaol',
}

export const WORK_TYPE_LABELS_UZ: Record<WorkType, string> = {
	monthly: 'Oylik',
	rate: 'Stavka',
	percentage: '%',
}

export const DAYS_OF_WEEK_SHORT = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak']

export const useTeachersStore = create<TeachersStore>((set, get) => ({
	open: false,
	teachers: [
		{
			id: '1',
			fullName: 'Akmal O\'qituvchi',
			phone: '+998901234567',
			subjects: [
				{ id: 's1', name: 'English' },
				{ id: 's2', name: 'IELTS' },
			],
			workType: 'monthly',
			salary: 3000000,
			hireDate: '2023-01-15',
			status: 'active',
			groups: [
				{ id: 'g1', name: 'GE-1', course: 'General English', studentCount: 14 },
				{ id: 'g2', name: 'IELTS-E', course: 'IELTS Exam Preparation', studentCount: 8 },
			],
			lessons: [],
			attendance: {
				last30Days: 95,
			},
			workingDays: ['Dush', 'Chor', 'Jum'],
		},
		{
			id: '2',
			fullName: 'Gulnora O\'qituvchi',
			phone: '+998939876543',
			subjects: [
				{ id: 's3', name: 'Math' },
				{ id: 's4', name: 'Physics' },
			],
			workType: 'rate',
			rate: 40000,
			hireDate: '2023-03-20',
			status: 'active',
			groups: [
				{ id: 'g3', name: 'Math-1', course: 'Mathematics', studentCount: 12 },
			],
			lessons: [],
			attendance: {
				last30Days: 88,
			},
			workingDays: ['Sesh', 'Paysh'],
		},
		{
			id: '3',
			fullName: 'Bobur O\'qituvchi',
			phone: '+998901112233',
			subjects: [
				{ id: 's5', name: 'Backend' },
			],
			workType: 'percentage',
			percentage: 15,
			hireDate: '2023-05-10',
			status: 'busy',
			groups: [
				{ id: 'g4', name: 'Backend-1', course: 'Backend kursi', studentCount: 10 },
			],
			lessons: [],
			attendance: {
				last30Days: 92,
			},
			workingDays: ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum'],
		},
	],
	data: null,
	onOpen: (data?: Teacher | null) => set({ open: true, data: data || null }),
	onClose: () => set({ open: false, data: null }),
	addTeacher: (teacher) => {
		const newTeacher: Teacher = {
			id: Date.now().toString(),
			...teacher,
			groups: [],
			lessons: [],
			attendance: {
				last30Days: 0,
			},
		}
		set({ teachers: [...get().teachers, newTeacher], open: false, data: null })
	},
	updateTeacher: (teacher) => {
		set({
			teachers: get().teachers.map((t) => (t.id === teacher.id ? teacher : t)),
			open: false,
			data: null,
		})
	},
	deleteTeacher: (id) => {
		set({ teachers: get().teachers.filter((t) => t.id !== id) })
	},
	archiveTeacher: (id) => {
		set({
			teachers: get().teachers.map((t) =>
				t.id === id ? { ...t, status: 'inactive' as TeacherStatus } : t
			),
		})
	},
}))
