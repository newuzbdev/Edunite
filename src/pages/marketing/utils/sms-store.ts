import { create } from 'zustand'

export type SMSTemplateType = 
  | 'welcome'
  | 'payment_reminder'
  | 'class_reminder'
  | 'exam_notification'
  | 'birthday'
  | 'holiday'
  | 'custom'

export interface SMSTemplate {
  id: string
  type: SMSTemplateType
  name: string
  content: string
  variables?: string[] // e.g., ['name', 'date', 'amount']
}

export type SMSStatus = 'pending' | 'sending' | 'sent' | 'failed' | 'delivered'

export interface SMSRecord {
  id: string
  recipient: string
  recipientName?: string
  message: string
  templateId?: string
  templateType?: SMSTemplateType
  status: SMSStatus
  sentAt: string
  deliveredAt?: string
  error?: string
  groupId?: string // If sent to a group
}

interface SMSStore {
  templates: SMSTemplate[]
  history: SMSRecord[]
  addTemplate: (template: Omit<SMSTemplate, 'id'>) => void
  updateTemplate: (id: string, template: Partial<SMSTemplate>) => void
  deleteTemplate: (id: string) => void
  sendSMS: (recipient: string, message: string, templateId?: string, recipientName?: string) => Promise<void>
  addToHistory: (record: Omit<SMSRecord, 'id' | 'sentAt'>) => void
  updateSMSStatus: (id: string, status: SMSStatus, deliveredAt?: string, error?: string) => void
}

const defaultTemplates: SMSTemplate[] = [
  {
    id: '1',
    type: 'welcome',
    name: 'Xush kelibsiz',
    content: 'Salom {{name}}! Edunite o\'quv markaziga xush kelibsiz. Bizning kurslarimiz haqida ma\'lumot olish uchun biz bilan bog\'laning.',
    variables: ['name'],
  },
  {
    id: '2',
    type: 'payment_reminder',
    name: 'To\'lov eslatmasi',
    content: 'Salom {{name}}! Sizning {{amount}} so\'mlik to\'lovingiz {{date}} kuni muddati tugaydi. Iltimos, vaqtida to\'lov qiling.',
    variables: ['name', 'amount', 'date'],
  },
  {
    id: '3',
    type: 'class_reminder',
    name: 'Dars eslatmasi',
    content: 'Salom {{name}}! Eslatib o\'tamiz, sizning darsingiz {{date}} kuni soat {{time}} da bo\'ladi. Keling!',
    variables: ['name', 'date', 'time'],
  },
  {
    id: '4',
    type: 'exam_notification',
    name: 'Imtihon xabari',
    content: 'Salom {{name}}! {{course}} kursi bo\'yicha imtihon {{date}} kuni soat {{time}} da bo\'lib o\'tadi. Tayyorgarlik ko\'ring!',
    variables: ['name', 'course', 'date', 'time'],
  },
  {
    id: '5',
    type: 'birthday',
    name: 'Tug\'ilgan kun',
    content: '{{name}}, tug\'ilgan kuningiz bilan! Sizga baxt, omad va muvaffaqiyatlar tilaymiz! Edunite jamoasi.',
    variables: ['name'],
  },
  {
    id: '6',
    type: 'holiday',
    name: 'Bayram tabriki',
    content: 'Hurmatli {{name}}! Bayramingiz bilan! Sizga va oilangizga baxt, omad va sog\'lik tilaymiz!',
    variables: ['name'],
  },
]

// Generate fake SMS history data
const generateFakeHistory = (): SMSRecord[] => {
  const now = new Date()
  const fakeRecords: SMSRecord[] = []

  // Helper to create date N days ago
  const daysAgo = (days: number) => {
    const date = new Date(now)
    date.setDate(date.getDate() - days)
    return date.toISOString()
  }

  // Helper to create delivered date (sentAt + some minutes)
  const deliveredAfter = (sentAt: string, minutes: number) => {
    const date = new Date(sentAt)
    date.setMinutes(date.getMinutes() + minutes)
    return date.toISOString()
  }

  // Delivered SMS records
  fakeRecords.push(
    {
      id: '1',
      recipient: '+998901234567',
      recipientName: 'Ali Ahmadov',
      message: 'Salom Ali Ahmadov! Edunite o\'quv markaziga xush kelibsiz. Bizning kurslarimiz haqida ma\'lumot olish uchun biz bilan bog\'laning.',
      templateId: '1',
      templateType: 'welcome',
      status: 'delivered',
      sentAt: daysAgo(5),
      deliveredAt: deliveredAfter(daysAgo(5), 2),
    },
    {
      id: '2',
      recipient: '+998901234568',
      recipientName: 'Gulnoza Karimova',
      message: 'Salom Gulnoza Karimova! Sizning 500,000 so\'mlik to\'lovingiz 2024-01-15 kuni muddati tugaydi. Iltimos, vaqtida to\'lov qiling.',
      templateId: '2',
      templateType: 'payment_reminder',
      status: 'delivered',
      sentAt: daysAgo(3),
      deliveredAt: deliveredAfter(daysAgo(3), 1),
    },
    {
      id: '3',
      recipient: '+998901234569',
      recipientName: 'Sardor Valiyev',
      message: 'Salom Sardor Valiyev! Eslatib o\'tamiz, sizning darsingiz 2024-01-15 kuni soat 10:00 da bo\'ladi. Keling!',
      templateId: '3',
      templateType: 'class_reminder',
      status: 'delivered',
      sentAt: daysAgo(2),
      deliveredAt: deliveredAfter(daysAgo(2), 3),
    },
    {
      id: '4',
      recipient: '+998901234570',
      recipientName: 'Dilshod Toshmatov',
      message: 'Salom Dilshod Toshmatov! Frontend kursi bo\'yicha imtihon 2024-01-15 kuni soat 10:00 da bo\'lib o\'tadi. Tayyorgarlik ko\'ring!',
      templateId: '4',
      templateType: 'exam_notification',
      status: 'delivered',
      sentAt: daysAgo(1),
      deliveredAt: deliveredAfter(daysAgo(1), 2),
    },
    {
      id: '5',
      recipient: '+998901234571',
      recipientName: 'Malika Yusupova',
      message: 'Malika Yusupova, tug\'ilgan kuningiz bilan! Sizga baxt, omad va muvaffaqiyatlar tilaymiz! Edunite jamoasi.',
      templateId: '5',
      templateType: 'birthday',
      status: 'delivered',
      sentAt: daysAgo(7),
      deliveredAt: deliveredAfter(daysAgo(7), 1),
    },
    {
      id: '6',
      recipient: '+998901234572',
      recipientName: 'Akmal Rahimov',
      message: 'Salom Akmal Rahimov! Sizning 750,000 so\'mlik to\'lovingiz 2024-01-20 kuni muddati tugaydi. Iltimos, vaqtida to\'lov qiling.',
      templateId: '2',
      templateType: 'payment_reminder',
      status: 'delivered',
      sentAt: daysAgo(4),
      deliveredAt: deliveredAfter(daysAgo(4), 2),
    },
    {
      id: '7',
      recipient: '+998901234573',
      recipientName: 'Feruza Alimova',
      message: 'Salom Feruza Alimova! Eslatib o\'tamiz, sizning darsingiz 2024-01-16 kuni soat 14:00 da bo\'ladi. Keling!',
      templateId: '3',
      templateType: 'class_reminder',
      status: 'delivered',
      sentAt: daysAgo(1),
      deliveredAt: deliveredAfter(daysAgo(1), 1),
    },
    {
      id: '8',
      recipient: '+998901234574',
      recipientName: 'Bobur Ismoilov',
      message: 'Hurmatli Bobur Ismoilov! Bayramingiz bilan! Sizga va oilangizga baxt, omad va sog\'lik tilaymiz!',
      templateId: '6',
      templateType: 'holiday',
      status: 'delivered',
      sentAt: daysAgo(6),
      deliveredAt: deliveredAfter(daysAgo(6), 2),
    },
    {
      id: '9',
      recipient: '+998901234575',
      recipientName: 'Zarina Qodirova',
      message: 'Salom Zarina Qodirova! Backend kursi bo\'yicha imtihon 2024-01-18 kuni soat 11:00 da bo\'lib o\'tadi. Tayyorgarlik ko\'ring!',
      templateId: '4',
      templateType: 'exam_notification',
      status: 'delivered',
      sentAt: daysAgo(2),
      deliveredAt: deliveredAfter(daysAgo(2), 3),
    },
    {
      id: '10',
      recipient: '+998901234576',
      recipientName: 'Javohir Karimov',
      message: 'Salom Javohir Karimov! Edunite o\'quv markaziga xush kelibsiz. Bizning kurslarimiz haqida ma\'lumot olish uchun biz bilan bog\'laning.',
      templateId: '1',
      templateType: 'welcome',
      status: 'delivered',
      sentAt: daysAgo(8),
      deliveredAt: deliveredAfter(daysAgo(8), 2),
    }
  )

  // Sent but not yet delivered
  fakeRecords.push(
    {
      id: '11',
      recipient: '+998901234577',
      recipientName: 'Dilshoda Toshmatova',
      message: 'Salom Dilshoda Toshmatova! Sizning 300,000 so\'mlik to\'lovingiz 2024-01-22 kuni muddati tugaydi. Iltimos, vaqtida to\'lov qiling.',
      templateId: '2',
      templateType: 'payment_reminder',
      status: 'sent',
      sentAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    },
    {
      id: '12',
      recipient: '+998901234578',
      recipientName: 'Shohruh Mirzayev',
      message: 'Salom Shohruh Mirzayev! Eslatib o\'tamiz, sizning darsingiz 2024-01-17 kuni soat 16:00 da bo\'ladi. Keling!',
      templateId: '3',
      templateType: 'class_reminder',
      status: 'sent',
      sentAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    }
  )

  // Currently sending
  fakeRecords.push(
    {
      id: '13',
      recipient: '+998901234579',
      recipientName: 'Madina Sobirova',
      message: 'Salom Madina Sobirova! Fullstack kursi bo\'yicha imtihon 2024-01-19 kuni soat 09:00 da bo\'lib o\'tadi. Tayyorgarlik ko\'ring!',
      templateId: '4',
      templateType: 'exam_notification',
      status: 'sending',
      sentAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    }
  )

  // Failed SMS
  fakeRecords.push(
    {
      id: '14',
      recipient: '+998901234580',
      recipientName: 'Rustam Abdurahmonov',
      message: 'Salom Rustam Abdurahmonov! Sizning 400,000 so\'mlik to\'lovingiz 2024-01-21 kuni muddati tugaydi. Iltimos, vaqtida to\'lov qiling.',
      templateId: '2',
      templateType: 'payment_reminder',
      status: 'failed',
      sentAt: daysAgo(1),
      error: 'Telefon raqami mavjud emas',
    },
    {
      id: '15',
      recipient: '+998901234581',
      recipientName: 'Nigora Xasanova',
      message: 'Salom Nigora Xasanova! Eslatib o\'tamiz, sizning darsingiz 2024-01-18 kuni soat 12:00 da bo\'ladi. Keling!',
      templateId: '3',
      templateType: 'class_reminder',
      status: 'failed',
      sentAt: daysAgo(2),
      error: 'Xabar yuborilmadi',
    }
  )

  // Pending SMS
  fakeRecords.push(
    {
      id: '16',
      recipient: '+998901234582',
      recipientName: 'Azizbek Usmonov',
      message: 'Azizbek Usmonov, tug\'ilgan kuningiz bilan! Sizga baxt, omad va muvaffaqiyatlar tilaymiz! Edunite jamoasi.',
      templateId: '5',
      templateType: 'birthday',
      status: 'pending',
      sentAt: new Date(Date.now() - 30 * 1000).toISOString(), // 30 seconds ago
    }
  )

  // Custom SMS (no template)
  fakeRecords.push(
    {
      id: '17',
      recipient: '+998901234583',
      recipientName: 'Kamola Rahimova',
      message: 'Hurmatli Kamola Rahimova! Sizning kursingiz yakunlandi. Sertifikat olish uchun bizning ofisimizga keling.',
      status: 'delivered',
      sentAt: daysAgo(3),
      deliveredAt: deliveredAfter(daysAgo(3), 2),
    },
    {
      id: '18',
      recipient: '+998901234584',
      recipientName: 'Farhod Jalilov',
      message: 'Salom Farhod Jalilov! Yangi kurslarimiz haqida ma\'lumot olish uchun bizning veb-saytimizga tashrif buyuring.',
      status: 'delivered',
      sentAt: daysAgo(5),
      deliveredAt: deliveredAfter(daysAgo(5), 1),
    }
  )

  // Sort by sentAt descending (newest first)
  return fakeRecords.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
}

export const useSMSStore = create<SMSStore>((set, get) => ({
  templates: defaultTemplates,
  history: generateFakeHistory(),
  addTemplate: (template) => {
    const newTemplate: SMSTemplate = {
      ...template,
      id: Date.now().toString(),
    }
    set({ templates: [...get().templates, newTemplate] })
  },
  updateTemplate: (id, updates) => {
    set({
      templates: get().templates.map(t =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })
  },
  deleteTemplate: (id) => {
    set({ templates: get().templates.filter(t => t.id !== id) })
  },
  sendSMS: async (recipient, message, templateId, recipientName) => {
    // Simulate SMS sending
    const record: Omit<SMSRecord, 'id' | 'sentAt'> = {
      recipient,
      recipientName,
      message,
      templateId,
      templateType: templateId ? get().templates.find(t => t.id === templateId)?.type : undefined,
      status: 'pending',
    }
    
    get().addToHistory(record)
    
    // Simulate sending process
    const historyRecord = get().history[get().history.length - 1]
    if (historyRecord) {
      setTimeout(() => {
        get().updateSMSStatus(historyRecord.id, 'sending')
        setTimeout(() => {
          // Randomly succeed or fail
          const success = Math.random() > 0.1
          if (success) {
            get().updateSMSStatus(historyRecord.id, 'sent')
            setTimeout(() => {
              get().updateSMSStatus(historyRecord.id, 'delivered', new Date().toISOString())
            }, 2000)
          } else {
            get().updateSMSStatus(historyRecord.id, 'failed', undefined, 'Xabar yuborilmadi')
          }
        }, 1500)
      }, 500)
    }
  },
  addToHistory: (record) => {
    const newRecord: SMSRecord = {
      ...record,
      id: Date.now().toString(),
      sentAt: new Date().toISOString(),
    }
    set({ history: [newRecord, ...get().history] })
  },
  updateSMSStatus: (id, status, deliveredAt, error) => {
    set({
      history: get().history.map(record =>
        record.id === id
          ? { ...record, status, deliveredAt, error }
          : record
      ),
    })
  },
}))

