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
			fullName: 'Dilbar Toshmatova',
			phone: '+998901234567',
			subjects: [
				{ id: 's1', name: 'Ona tili' },
			],
			workType: 'monthly',
			salary: 3500000,
			hireDate: '2023-01-15',
			status: 'active',
			groups: [
				{ id: 'g1', name: 'Ona-Tili-1', course: 'Ona tili - Boshlang\'ich', studentCount: 15 },
			],
			lessons: [],
			attendance: {
				last30Days: 96,
			},
			workingDays: ['Dush', 'Chor', 'Jum'],
		},
		{
			id: '2',
			fullName: 'Akmal O\'qituvchi',
			phone: '+998901234568',
			subjects: [
				{ id: 's2', name: 'English' },
			],
			workType: 'monthly',
			salary: 4000000,
			hireDate: '2023-02-10',
			status: 'active',
			groups: [
				{ id: 'g2', name: 'English-Beginner-1', course: 'English - Beginner', studentCount: 14 },
			],
			lessons: [],
			attendance: {
				last30Days: 94,
			},
			workingDays: ['Sesh', 'Paysh', 'Shanba'],
		},
		{
			id: '3',
			fullName: 'Gulnora Karimova',
			phone: '+998901234569',
			subjects: [
				{ id: 's3', name: 'English' },
			],
			workType: 'monthly',
			salary: 4200000,
			hireDate: '2023-01-20',
			status: 'active',
			groups: [
				{ id: 'g3', name: 'English-Intermediate-1', course: 'English - Intermediate', studentCount: 12 },
			],
			lessons: [],
			attendance: {
				last30Days: 97,
			},
			workingDays: ['Dush', 'Chor', 'Jum'],
		},
		{
			id: '4',
			fullName: 'Bobur Ismoilov',
			phone: '+998901234570',
			subjects: [
				{ id: 's4', name: 'English' },
			],
			workType: 'monthly',
			salary: 4500000,
			hireDate: '2023-03-05',
			status: 'active',
			groups: [
				{ id: 'g4', name: 'English-Advanced-1', course: 'English - Advanced', studentCount: 10 },
			],
			lessons: [],
			attendance: {
				last30Days: 95,
			},
			workingDays: ['Sesh', 'Paysh'],
		},
		{
			id: '5',
			fullName: 'Malika Yusupova',
			phone: '+998901234571',
			subjects: [
				{ id: 's5', name: 'IELTS' },
			],
			workType: 'monthly',
			salary: 5000000,
			hireDate: '2023-01-10',
			status: 'active',
			groups: [
				{ id: 'g5', name: 'IELTS-1', course: 'IELTS tayyorlov', studentCount: 9 },
			],
			lessons: [],
			attendance: {
				last30Days: 98,
			},
			workingDays: ['Dush', 'Chor', 'Jum'],
		},
		{
			id: '6',
			fullName: 'Feruza Alimova',
			phone: '+998901234572',
			subjects: [
				{ id: 's6', name: 'Ona tili' },
			],
			workType: 'monthly',
			salary: 3600000,
			hireDate: '2023-02-15',
			status: 'active',
			groups: [
				{ id: 'g6', name: 'Ona-Tili-2', course: 'Ona tili - O\'rta', studentCount: 16 },
			],
			lessons: [],
			attendance: {
				last30Days: 93,
			},
			workingDays: ['Sesh', 'Paysh'],
		},
		{
			id: '7',
			fullName: 'Sardor Valiyev',
			phone: '+998901234573',
			subjects: [
				{ id: 's7', name: 'Ona tili' },
			],
			workType: 'monthly',
			salary: 3800000,
			hireDate: '2023-01-25',
			status: 'active',
			groups: [
				{ id: 'g7', name: 'Ona-Tili-3', course: 'Ona tili - Yuqori', studentCount: 13 },
			],
			lessons: [],
			attendance: {
				last30Days: 96,
			},
			workingDays: ['Dush', 'Chor', 'Jum'],
		},
		{
			id: '8',
			fullName: 'Nigora Xasanova',
			phone: '+998901234574',
			subjects: [
				{ id: 's8', name: 'Rus tili' },
			],
			workType: 'rate',
			rate: 45000,
			hireDate: '2023-03-10',
			status: 'active',
			groups: [
				{ id: 'g8', name: 'Rus-Tili-1', course: 'Rus tili - Boshlang\'ich', studentCount: 14 },
			],
			lessons: [],
			attendance: {
				last30Days: 92,
			},
			workingDays: ['Sesh', 'Paysh', 'Shanba'],
		},
		{
			id: '9',
			fullName: 'Azizbek Usmonov',
			phone: '+998901234575',
			subjects: [
				{ id: 's9', name: 'Rus tili' },
			],
			workType: 'monthly',
			salary: 4000000,
			hireDate: '2023-02-20',
			status: 'active',
			groups: [
				{ id: 'g9', name: 'Rus-Tili-2', course: 'Rus tili - O\'rta', studentCount: 11 },
			],
			lessons: [],
			attendance: {
				last30Days: 94,
			},
			workingDays: ['Dush', 'Chor', 'Jum'],
		},
		{
			id: '10',
			fullName: 'Javohir Karimov',
			phone: '+998901234576',
			subjects: [
				{ id: 's10', name: 'Matematika' },
			],
			workType: 'monthly',
			salary: 4200000,
			hireDate: '2023-01-12',
			status: 'active',
			groups: [
				{ id: 'g10', name: 'Matematika-5-9-1', course: 'Matematika - 5-9 sinf', studentCount: 10 },
			],
			lessons: [],
			attendance: {
				last30Days: 95,
			},
			workingDays: ['Sesh', 'Paysh'],
		},
		{
			id: '11',
			fullName: 'Kamola Rahimova',
			phone: '+998901234577',
			subjects: [
				{ id: 's11', name: 'Matematika' },
			],
			workType: 'monthly',
			salary: 4500000,
			hireDate: '2023-02-05',
			status: 'active',
			groups: [
				{ id: 'g11', name: 'Matematika-10-11-1', course: 'Matematika - 10-11 sinf', studentCount: 15 },
			],
			lessons: [],
			attendance: {
				last30Days: 97,
			},
			workingDays: ['Dush', 'Chor', 'Jum'],
		},
		{
			id: '12',
			fullName: 'Shohruh Mirzayev',
			phone: '+998901234578',
			subjects: [
				{ id: 's12', name: 'Fizika' },
			],
			workType: 'monthly',
			salary: 4300000,
			hireDate: '2023-01-18',
			status: 'active',
			groups: [
				{ id: 'g12', name: 'Fizika-1', course: 'Fizika - O\'rta maktab', studentCount: 13 },
			],
			lessons: [],
			attendance: {
				last30Days: 94,
			},
			workingDays: ['Sesh', 'Paysh'],
		},
		{
			id: '13',
			fullName: 'Dilshoda Toshmatova',
			phone: '+998901234579',
			subjects: [
				{ id: 's13', name: 'Kimyo' },
			],
			workType: 'rate',
			rate: 50000,
			hireDate: '2023-03-15',
			status: 'active',
			groups: [
				{ id: 'g13', name: 'Kimyo-1', course: 'Kimyo - O\'rta maktab', studentCount: 12 },
			],
			lessons: [],
			attendance: {
				last30Days: 91,
			},
			workingDays: ['Dush', 'Chor'],
		},
		{
			id: '14',
			fullName: 'Madina Sobirova',
			phone: '+998901234580',
			subjects: [
				{ id: 's14', name: 'Biologiya' },
			],
			workType: 'monthly',
			salary: 3800000,
			hireDate: '2023-02-25',
			status: 'active',
			groups: [
				{ id: 'g14', name: 'Biologiya-1', course: 'Biologiya - O\'rta maktab', studentCount: 11 },
			],
			lessons: [],
			attendance: {
				last30Days: 93,
			},
			workingDays: ['Paysh', 'Shanba'],
		},
		{
			id: '15',
			fullName: 'Rustam Abdurahmonov',
			phone: '+998901234581',
			subjects: [
				{ id: 's15', name: 'Tarix' },
			],
			workType: 'monthly',
			salary: 3500000,
			hireDate: '2023-01-30',
			status: 'active',
			groups: [
				{ id: 'g15', name: 'Tarix-1', course: 'Tarix - O\'zbekiston tarixi', studentCount: 9 },
			],
			lessons: [],
			attendance: {
				last30Days: 95,
			},
			workingDays: ['Juma', 'Shanba'],
		},
		{
			id: '16',
			fullName: 'Zarina Qodirova',
			phone: '+998901234582',
			subjects: [
				{ id: 's16', name: 'English' },
			],
			workType: 'monthly',
			salary: 4000000,
			hireDate: '2023-03-01',
			status: 'active',
			groups: [
				{ id: 'g16', name: 'English-Kids-1', course: 'English - Kids (5-8 yosh)', studentCount: 12 },
			],
			lessons: [],
			attendance: {
				last30Days: 96,
			},
			workingDays: ['Shanba', 'Yakshanba'],
		},
		{
			id: '17',
			fullName: 'Farhod Jalilov',
			phone: '+998901234583',
			subjects: [
				{ id: 's17', name: 'English' },
			],
			workType: 'monthly',
			salary: 4200000,
			hireDate: '2023-02-08',
			status: 'active',
			groups: [
				{ id: 'g17', name: 'English-Teens-1', course: 'English - Teens (13-17 yosh)', studentCount: 14 },
			],
			lessons: [],
			attendance: {
				last30Days: 94,
			},
			workingDays: ['Dush', 'Chor', 'Jum'],
		},
		{
			id: '18',
			fullName: 'Yulduz Toshmatova',
			phone: '+998901234584',
			subjects: [
				{ id: 's18', name: 'Ona tili' },
			],
			workType: 'monthly',
			salary: 4000000,
			hireDate: '2023-03-20',
			status: 'active',
			groups: [
				{ id: 'g18', name: 'Ona-Tili-Imtihon-1', course: 'Ona tili - Imtihon tayyorlov', studentCount: 13 },
			],
			lessons: [],
			attendance: {
				last30Days: 97,
			},
			workingDays: ['Sesh', 'Paysh'],
		},
		{
			id: '19',
			fullName: 'Nodira Xamidova',
			phone: '+998901234585',
			subjects: [
				{ id: 's19', name: 'English' },
			],
			workType: 'rate',
			rate: 55000,
			hireDate: '2023-02-12',
			status: 'active',
			groups: [
				{ id: 'g19', name: 'English-Conversation-1', course: 'English Conversation', studentCount: 10 },
			],
			lessons: [],
			attendance: {
				last30Days: 92,
			},
			workingDays: ['Dush', 'Chor', 'Jum'],
		},
		{
			id: '20',
			fullName: 'Sanjar Rahimov',
			phone: '+998901234586',
			subjects: [
				{ id: 's20', name: 'Rus tili' },
			],
			workType: 'monthly',
			salary: 4200000,
			hireDate: '2023-01-28',
			status: 'active',
			groups: [
				{ id: 'g20', name: 'Rus-Tili-Imtihon-1', course: 'Rus tili - Imtihon tayyorlov', studentCount: 8 },
			],
			lessons: [],
			attendance: {
				last30Days: 95,
			},
			workingDays: ['Sesh', 'Paysh'],
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
