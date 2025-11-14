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
	'Frontend kursi',
	'Backend kursi',
	'Fullstack kursi',
	'UI/UX dizayn kursi',
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
					name: 'Frontend kursi',
					group: 'Frontend-1',
					schedule: 'Dushanba, Chorshanba, Juma - 18:00',
					teacher: 'Akmal O\'qituvchi',
				},
			],
			group: 'Frontend-1',
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
					amount: 500000,
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
					name: 'Backend kursi',
					group: 'Backend-1',
					schedule: 'Seshanba, Payshanba - 18:00',
					teacher: 'Bobur O\'qituvchi',
				},
			],
			group: 'Backend-1',
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

