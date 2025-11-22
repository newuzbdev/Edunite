import { create } from 'zustand'

export type PaymentStatus = 'paid' | 'debt' | 'deadline_near'
export type StudentStatus = 'active' | 'finished' | 'debtor'

export interface Course {
	id: string
	name: string
	group: string
	schedule: string
	teacher: string
}

export interface Payment {
	id: string
	date: string
	amount: number
	type: 'cash' | 'card' | 'payme' | 'click'
	month: string
	receipt?: string
	status: PaymentStatus
}

export interface Attendance {
	id: string
	date: string
	group: string
	status: 'present' | 'absent' | 'excused'
}

export interface Note {
	id: string
	date: string
	author: string
	content: string
}

export interface Student {
	id: string
	fullName: string
	phone: string
	courses: Course[]
	group: string
	paymentStatus: PaymentStatus
	nextPaymentDate: string
	status: StudentStatus
	address?: string
	notes?: string
	joinedDate: string
	studentId: string
	payments: Payment[]
	attendance: Attendance[]
	notesList: Note[]
}

interface StudentsStore {
	open: boolean
	students: Student[]
	data: Student | null
	onOpen: (data?: Student | null) => void
	onClose: () => void
	addStudent: (student: Omit<Student, 'id' | 'payments' | 'attendance' | 'notesList'>) => void
	updateStudent: (student: Student) => void
	deleteStudent: (id: string) => void
	addPayment: (studentId: string, payment: Omit<Payment, 'id'>) => void
	addAttendance: (studentId: string, attendance: Omit<Attendance, 'id'>) => void
	addNote: (studentId: string, note: Omit<Note, 'id'>) => void
}

export const COURSE_TYPES_UZ = [
	'Ona tili - Boshlang\'ich',
	'Ona tili - O\'rta',
	'Ona tili - Yuqori',
	'Ona tili - Imtihon tayyorlov',
	'English - Beginner',
	'English - Intermediate',
	'English - Advanced',
	'English - Kids (5-8 yosh)',
	'English - Teens (13-17 yosh)',
	'English Conversation',
	'IELTS tayyorlov',
	'Rus tili - Boshlang\'ich',
	'Rus tili - O\'rta',
	'Rus tili - Imtihon tayyorlov',
	'Matematika - 5-9 sinf',
	'Matematika - 10-11 sinf',
	'Fizika - O\'rta maktab',
	'Kimyo - O\'rta maktab',
	'Biologiya - O\'rta maktab',
	'Tarix - O\'zbekiston tarixi',
]

export const PAYMENT_STATUS_LABELS_UZ: Record<PaymentStatus, string> = {
	paid: 'To\'langan',
	debt: 'Qarzdor',
	deadline_near: 'Deadline yaqin',
}

export const STUDENT_STATUS_LABELS_UZ: Record<StudentStatus, string> = {
	active: 'Aktiv',
	finished: 'Tugagan',
	debtor: 'Qarzdor',
}

export const PAYMENT_TYPE_LABELS_UZ: Record<Payment['type'], string> = {
	cash: 'Naqd',
	card: 'Karta',
	payme: 'Payme',
	click: 'Click',
}

export const useStudentsStore = create<StudentsStore>((set, get) => ({
	open: false,
	students: [
		{
			id: '1',
			fullName: 'Ali Ahmadov',
			phone: '+998901234567',
			courses: [
				{
					id: 'c1',
					name: 'Ona tili - Boshlang\'ich',
					group: 'Ona-Tili-1',
					schedule: 'Dushanba, Chorshanba, Juma - 16:00',
					teacher: 'Dilbar Toshmatova',
				},
			],
			group: 'Ona-Tili-1',
			paymentStatus: 'paid',
			nextPaymentDate: '2024-02-15',
			status: 'active',
			address: 'Toshkent shahar, Chilonzor tumani',
			notes: 'Yaxshi talaba',
			joinedDate: '2024-01-15',
			studentId: 'STU-001',
			payments: [
				{
					id: 'p1',
					date: '2024-01-15',
					amount: 350000,
					type: 'cash',
					month: 'Yanvar 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '2',
			fullName: 'Gulnoza Karimova',
			phone: '+998939876543',
			courses: [
				{
					id: 'c2',
					name: 'English - Beginner',
					group: 'English-Beginner-1',
					schedule: 'Seshanba, Payshanba, Shanba - 17:00',
					teacher: 'Akmal O\'qituvchi',
				},
			],
			group: 'English-Beginner-1',
			paymentStatus: 'debt',
			nextPaymentDate: '2024-02-10',
			status: 'debtor',
			address: 'Toshkent shahar, Yunusobod tumani',
			joinedDate: '2024-01-10',
			studentId: 'STU-002',
			payments: [],
			attendance: [],
			notesList: [],
		},
		{
			id: '3',
			fullName: 'Sardor Valiyev',
			phone: '+998901234568',
			courses: [
				{
					id: 'c3',
					name: 'English - Intermediate',
					group: 'English-Intermediate-1',
					schedule: 'Dushanba, Chorshanba, Juma - 18:00',
					teacher: 'Gulnora Karimova',
				},
			],
			group: 'English-Intermediate-1',
			paymentStatus: 'deadline_near',
			nextPaymentDate: '2024-02-20',
			status: 'active',
			address: 'Toshkent shahar, Mirzo Ulug\'bek tumani',
			joinedDate: '2024-01-18',
			studentId: 'STU-003',
			payments: [
				{
					id: 'p2',
					date: '2024-01-18',
					amount: 500000,
					type: 'card',
					month: 'Yanvar 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '4',
			fullName: 'Dilshod Toshmatov',
			phone: '+998901234569',
			courses: [
				{
					id: 'c4',
					name: 'English - Advanced',
					group: 'English-Advanced-1',
					schedule: 'Seshanba, Payshanba - 19:00',
					teacher: 'Bobur Ismoilov',
				},
			],
			group: 'English-Advanced-1',
			paymentStatus: 'paid',
			nextPaymentDate: '2024-02-22',
			status: 'active',
			address: 'Toshkent shahar, Shayxontohur tumani',
			joinedDate: '2024-01-22',
			studentId: 'STU-004',
			payments: [
				{
					id: 'p3',
					date: '2024-01-22',
					amount: 550000,
					type: 'payme',
					month: 'Yanvar 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '5',
			fullName: 'Malika Yusupova',
			phone: '+998901234570',
			courses: [
				{
					id: 'c5',
					name: 'IELTS tayyorlov',
					group: 'IELTS-1',
					schedule: 'Dushanba, Chorshanba, Juma - 17:00',
					teacher: 'Malika Yusupova',
				},
			],
			group: 'IELTS-1',
			paymentStatus: 'paid',
			nextPaymentDate: '2024-02-25',
			status: 'active',
			address: 'Toshkent shahar, Yashnobod tumani',
			joinedDate: '2024-01-25',
			studentId: 'STU-005',
			payments: [
				{
					id: 'p4',
					date: '2024-01-25',
					amount: 650000,
					type: 'click',
					month: 'Yanvar 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '6',
			fullName: 'Feruza Alimova',
			phone: '+998901234571',
			courses: [
				{
					id: 'c6',
					name: 'Ona tili - O\'rta',
					group: 'Ona-Tili-2',
					schedule: 'Seshanba, Payshanba - 16:00',
					teacher: 'Feruza Alimova',
				},
			],
			group: 'Ona-Tili-2',
			paymentStatus: 'deadline_near',
			nextPaymentDate: '2024-02-16',
			status: 'active',
			address: 'Toshkent shahar, Sergeli tumani',
			joinedDate: '2024-01-16',
			studentId: 'STU-006',
			payments: [
				{
					id: 'p5',
					date: '2024-01-16',
					amount: 400000,
					type: 'cash',
					month: 'Yanvar 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '7',
			fullName: 'Bobur Ismoilov',
			phone: '+998901234572',
			courses: [
				{
					id: 'c7',
					name: 'Ona tili - Yuqori',
					group: 'Ona-Tili-3',
					schedule: 'Dushanba, Chorshanba, Juma - 17:00',
					teacher: 'Sardor Valiyev',
				},
			],
			group: 'Ona-Tili-3',
			paymentStatus: 'paid',
			nextPaymentDate: '2024-02-19',
			status: 'active',
			address: 'Toshkent shahar, Olmazor tumani',
			joinedDate: '2024-01-19',
			studentId: 'STU-007',
			payments: [
				{
					id: 'p6',
					date: '2024-01-19',
					amount: 450000,
					type: 'card',
					month: 'Yanvar 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '8',
			fullName: 'Nigora Xasanova',
			phone: '+998901234573',
			courses: [
				{
					id: 'c8',
					name: 'Rus tili - Boshlang\'ich',
					group: 'Rus-Tili-1',
					schedule: 'Seshanba, Payshanba, Shanba - 15:00',
					teacher: 'Nigora Xasanova',
				},
			],
			group: 'Rus-Tili-1',
			paymentStatus: 'paid',
			nextPaymentDate: '2024-02-21',
			status: 'active',
			address: 'Toshkent shahar, Uchtepa tumani',
			joinedDate: '2024-01-21',
			studentId: 'STU-008',
			payments: [
				{
					id: 'p7',
					date: '2024-01-21',
					amount: 400000,
					type: 'payme',
					month: 'Yanvar 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '9',
			fullName: 'Azizbek Usmonov',
			phone: '+998901234574',
			courses: [
				{
					id: 'c9',
					name: 'Rus tili - O\'rta',
					group: 'Rus-Tili-2',
					schedule: 'Dushanba, Chorshanba, Juma - 18:00',
					teacher: 'Azizbek Usmonov',
				},
			],
			group: 'Rus-Tili-2',
			paymentStatus: 'debt',
			nextPaymentDate: '2024-02-23',
			status: 'debtor',
			address: 'Toshkent shahar, Bektemir tumani',
			joinedDate: '2024-01-23',
			studentId: 'STU-009',
			payments: [],
			attendance: [],
			notesList: [],
		},
		{
			id: '10',
			fullName: 'Javohir Karimov',
			phone: '+998901234575',
			courses: [
				{
					id: 'c10',
					name: 'Matematika - 5-9 sinf',
					group: 'Matematika-5-9-1',
					schedule: 'Seshanba, Payshanba - 16:00',
					teacher: 'Javohir Karimov',
				},
			],
			group: 'Matematika-5-9-1',
			paymentStatus: 'debt',
			nextPaymentDate: '2024-02-17',
			status: 'debtor',
			address: 'Toshkent shahar, Mirobod tumani',
			joinedDate: '2024-01-17',
			studentId: 'STU-010',
			payments: [
				{
					id: 'p8',
					date: '2024-01-17',
					amount: 400000,
					type: 'cash',
					month: 'Yanvar 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '11',
			fullName: 'Kamola Rahimova',
			phone: '+998901234576',
			courses: [
				{
					id: 'c11',
					name: 'Matematika - 10-11 sinf',
					group: 'Matematika-10-11-1',
					schedule: 'Dushanba, Chorshanba, Juma - 17:00',
					teacher: 'Kamola Rahimova',
				},
			],
			group: 'Matematika-10-11-1',
			paymentStatus: 'paid',
			nextPaymentDate: '2024-02-24',
			status: 'active',
			address: 'Toshkent shahar, Yangihayot tumani',
			joinedDate: '2024-01-24',
			studentId: 'STU-011',
			payments: [
				{
					id: 'p9',
					date: '2024-01-24',
					amount: 500000,
					type: 'card',
					month: 'Yanvar 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '12',
			fullName: 'Shohruh Mirzayev',
			phone: '+998901234577',
			courses: [
				{
					id: 'c12',
					name: 'Fizika - O\'rta maktab',
					group: 'Fizika-1',
					schedule: 'Seshanba, Payshanba - 17:00',
					teacher: 'Shohruh Mirzayev',
				},
			],
			group: 'Fizika-1',
			paymentStatus: 'paid',
			nextPaymentDate: '2024-02-26',
			status: 'active',
			address: 'Toshkent shahar, Yakkasaroy tumani',
			joinedDate: '2024-01-26',
			studentId: 'STU-012',
			payments: [
				{
					id: 'p10',
					date: '2024-01-26',
					amount: 450000,
					type: 'click',
					month: 'Yanvar 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '13',
			fullName: 'Dilshoda Toshmatova',
			phone: '+998901234578',
			courses: [
				{
					id: 'c13',
					name: 'Kimyo - O\'rta maktab',
					group: 'Kimyo-1',
					schedule: 'Dushanba, Chorshanba - 16:00',
					teacher: 'Dilshoda Toshmatova',
				},
			],
			group: 'Kimyo-1',
			paymentStatus: 'deadline_near',
			nextPaymentDate: '2024-02-27',
			status: 'active',
			address: 'Toshkent shahar, Yashnobod tumani',
			joinedDate: '2024-01-27',
			studentId: 'STU-013',
			payments: [
				{
					id: 'p11',
					date: '2024-01-27',
					amount: 450000,
					type: 'payme',
					month: 'Yanvar 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '14',
			fullName: 'Madina Sobirova',
			phone: '+998901234579',
			courses: [
				{
					id: 'c14',
					name: 'Biologiya - O\'rta maktab',
					group: 'Biologiya-1',
					schedule: 'Payshanba, Shanba - 15:00',
					teacher: 'Madina Sobirova',
				},
			],
			group: 'Biologiya-1',
			paymentStatus: 'deadline_near',
			nextPaymentDate: '2024-02-28',
			status: 'active',
			address: 'Toshkent shahar, Chilonzor tumani',
			joinedDate: '2024-01-28',
			studentId: 'STU-014',
			payments: [
				{
					id: 'p12',
					date: '2024-01-28',
					amount: 400000,
					type: 'cash',
					month: 'Yanvar 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '15',
			fullName: 'Rustam Abdurahmonov',
			phone: '+998901234580',
			courses: [
				{
					id: 'c15',
					name: 'Tarix - O\'zbekiston tarixi',
					group: 'Tarix-1',
					schedule: 'Juma, Shanba - 14:00',
					teacher: 'Rustam Abdurahmonov',
				},
			],
			group: 'Tarix-1',
			paymentStatus: 'paid',
			nextPaymentDate: '2024-02-29',
			status: 'active',
			address: 'Toshkent shahar, Yunusobod tumani',
			joinedDate: '2024-01-29',
			studentId: 'STU-015',
			payments: [
				{
					id: 'p13',
					date: '2024-01-29',
					amount: 350000,
					type: 'card',
					month: 'Yanvar 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '16',
			fullName: 'Zarina Qodirova',
			phone: '+998901234581',
			courses: [
				{
					id: 'c16',
					name: 'English - Kids (5-8 yosh)',
					group: 'English-Kids-1',
					schedule: 'Shanba, Yakshanba - 10:00',
					teacher: 'Zarina Qodirova',
				},
			],
			group: 'English-Kids-1',
			paymentStatus: 'paid',
			nextPaymentDate: '2024-02-30',
			status: 'active',
			address: 'Toshkent shahar, Shayxontohur tumani',
			joinedDate: '2024-01-30',
			studentId: 'STU-016',
			payments: [
				{
					id: 'p14',
					date: '2024-01-30',
					amount: 400000,
					type: 'payme',
					month: 'Yanvar 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '17',
			fullName: 'Farhod Jalilov',
			phone: '+998901234582',
			courses: [
				{
					id: 'c17',
					name: 'English - Teens (13-17 yosh)',
					group: 'English-Teens-1',
					schedule: 'Dushanba, Chorshanba, Juma - 16:00',
					teacher: 'Farhod Jalilov',
				},
			],
			group: 'English-Teens-1',
			paymentStatus: 'paid',
			nextPaymentDate: '2024-03-01',
			status: 'active',
			address: 'Toshkent shahar, Mirzo Ulug\'bek tumani',
			joinedDate: '2024-02-01',
			studentId: 'STU-017',
			payments: [
				{
					id: 'p15',
					date: '2024-02-01',
					amount: 480000,
					type: 'click',
					month: 'Fevral 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '18',
			fullName: 'Yulduz Toshmatova',
			phone: '+998901234583',
			courses: [
				{
					id: 'c18',
					name: 'Ona tili - Imtihon tayyorlov',
					group: 'Ona-Tili-Imtihon-1',
					schedule: 'Seshanba, Payshanba - 18:00',
					teacher: 'Yulduz Toshmatova',
				},
			],
			group: 'Ona-Tili-Imtihon-1',
			paymentStatus: 'paid',
			nextPaymentDate: '2024-03-02',
			status: 'active',
			address: 'Toshkent shahar, Sergeli tumani',
			joinedDate: '2024-02-02',
			studentId: 'STU-018',
			payments: [
				{
					id: 'p16',
					date: '2024-02-02',
					amount: 500000,
					type: 'cash',
					month: 'Fevral 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
		{
			id: '19',
			fullName: 'Nodira Xamidova',
			phone: '+998901234584',
			courses: [
				{
					id: 'c19',
					name: 'English Conversation',
					group: 'English-Conversation-1',
					schedule: 'Dushanba, Chorshanba, Juma - 19:00',
					teacher: 'Nodira Xamidova',
				},
			],
			group: 'English-Conversation-1',
			paymentStatus: 'debt',
			nextPaymentDate: '2024-03-03',
			status: 'debtor',
			address: 'Toshkent shahar, Olmazor tumani',
			joinedDate: '2024-02-03',
			studentId: 'STU-019',
			payments: [],
			attendance: [],
			notesList: [],
		},
		{
			id: '20',
			fullName: 'Sanjar Rahimov',
			phone: '+998901234585',
			courses: [
				{
					id: 'c20',
					name: 'Rus tili - Imtihon tayyorlov',
					group: 'Rus-Tili-Imtihon-1',
					schedule: 'Seshanba, Payshanba - 17:00',
					teacher: 'Sanjar Rahimov',
				},
			],
			group: 'Rus-Tili-Imtihon-1',
			paymentStatus: 'paid',
			nextPaymentDate: '2024-03-04',
			status: 'active',
			address: 'Toshkent shahar, Uchtepa tumani',
			joinedDate: '2024-02-04',
			studentId: 'STU-020',
			payments: [
				{
					id: 'p17',
					date: '2024-02-04',
					amount: 500000,
					type: 'card',
					month: 'Fevral 2024',
					status: 'paid',
				},
			],
			attendance: [],
			notesList: [],
		},
	],
	data: null,
	onOpen: (data?: Student | null) => set({ open: true, data: data || null }),
	onClose: () => set({ open: false, data: null }),
	addStudent: (student) => {
		const newStudent: Student = {
			id: Date.now().toString(),
			...student,
			payments: [],
			attendance: [],
			notesList: [],
		}
		set({ students: [...get().students, newStudent], open: false, data: null })
	},
	updateStudent: (student) => {
		set({
			students: get().students.map((s) => (s.id === student.id ? student : s)),
			open: false,
			data: null,
		})
	},
	deleteStudent: (id) => {
		set({ students: get().students.filter((s) => s.id !== id) })
	},
	addPayment: (studentId, payment) => {
		const newPayment: Payment = {
			id: Date.now().toString(),
			...payment,
		}
		set({
			students: get().students.map((s) =>
				s.id === studentId ? { ...s, payments: [...s.payments, newPayment] } : s
			),
		})
	},
	addAttendance: (studentId, attendance) => {
		const newAttendance: Attendance = {
			id: Date.now().toString(),
			...attendance,
		}
		set({
			students: get().students.map((s) =>
				s.id === studentId ? { ...s, attendance: [...s.attendance, newAttendance] } : s
			),
		})
	},
	addNote: (studentId, note) => {
		const newNote: Note = {
			id: Date.now().toString(),
			...note,
		}
		set({
			students: get().students.map((s) =>
				s.id === studentId ? { ...s, notesList: [...s.notesList, newNote] } : s
			),
		})
	},
}))

