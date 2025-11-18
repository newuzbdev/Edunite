import { create } from 'zustand'

export type PaymentType = 'cash' | 'card' | 'payme' | 'click' | 'bank_transfer' | 'terminal' | 'discount' | 'coupon'
export type PaymentStatus = 'paid' | 'refunded' | 'pending'

export interface PaymentRecord {
  id: string
  studentId: string
  studentName: string
  course: string
  paymentType: PaymentType
  amount: number
  date: string
  operator: string
  status: PaymentStatus
  receipt?: string
  notes?: string
}

interface PaymentsStore {
  open: boolean
  payments: PaymentRecord[]
  data: PaymentRecord | null
  onOpen: (data?: PaymentRecord | null) => void
  onClose: () => void
  addPayment: (payment: Omit<PaymentRecord, 'id'>) => void
  updatePayment: (payment: PaymentRecord) => void
  deletePayment: (id: string) => void
}

export const PAYMENT_TYPE_LABELS_UZ: Record<PaymentType, string> = {
  cash: 'Naqd',
  card: 'Karta',
  payme: 'Payme',
  click: 'Click',
  bank_transfer: 'Bank o\'tkazmasi',
  terminal: 'Terminal',
  discount: 'Chegirma',
  coupon: 'Kupon',
}

export const PAYMENT_STATUS_LABELS_UZ: Record<PaymentStatus, string> = {
  paid: 'To\'langan',
  refunded: 'Qaytarilgan',
  pending: 'Kutilmoqda',
}

export const usePaymentsStore = create<PaymentsStore>((set, get) => ({
  open: false,
  payments: [
    {
      id: '1',
      studentId: '1',
      studentName: 'Ali Ahmadov',
      course: 'Frontend kursi',
      paymentType: 'cash',
      amount: 300000,
      date: '2024-01-15',
      operator: 'Admin',
      status: 'paid',
      receipt: 'REC-001',
      notes: 'To\'liq to\'lov',
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'Gulnoza Karimova',
      course: 'Backend kursi',
      paymentType: 'payme',
      amount: 250000,
      date: '2024-01-20',
      operator: 'O\'qituvchi',
      status: 'pending',
      notes: 'Qisman to\'lov',
    },
  ],
  data: null,
  onOpen: (data?: PaymentRecord | null) => set({ open: true, data: data || null }),
  onClose: () => set({ open: false, data: null }),
  addPayment: (payment) => {
    const newPayment: PaymentRecord = {
      id: Date.now().toString(),
      ...payment,
    }
    set({ payments: [...get().payments, newPayment], open: false, data: null })
  },
  updatePayment: (payment) => {
    set({
      payments: get().payments.map((p) => (p.id === payment.id ? payment : p)),
      open: false,
      data: null,
    })
  },
  deletePayment: (id) => {
    set({ payments: get().payments.filter((p) => p.id !== id) })
  },
}))