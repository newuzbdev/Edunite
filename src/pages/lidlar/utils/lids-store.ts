import { create } from 'zustand'

export type LidStatus = 'new' | 'called' | 'interested' | 'thinking' | 'closed' | 'converted'

export type LeadSource = 'instagram' | 'telegram' | 'banner' | 'friend_recommendation' | 'website' | 'other'

export interface ActionLog {
	id: string
	type: 'call' | 'status_change' | 'comment'
	timestamp: string
	description: string
	managerName?: string
}

export interface Lid {
	id: string
	name: string
	phoneNumber: string
	courseType: string
	status: LidStatus
	interestedDate: string // ISO date string
	source?: LeadSource
	managerId?: string
	managerName?: string
	comments?: string
	suitableGroup?: string
	createdAt: string // ISO date string
	actionLog: ActionLog[]
}

interface LidsStore {
	open: boolean
	profileOpen: boolean
	selectedLid: Lid | null
	lids: Lid[]
	// open the drawer; optional data to edit an existing lid
	data: Lid | null
	onOpen: (data?: Lid | null) => void
	onClose: () => void
	openProfile: (lid: Lid) => void
	closeProfile: () => void
	addLid: (lid: Omit<Lid, 'id' | 'createdAt' | 'actionLog'>) => void
	updateLid: (lid: Lid) => void
	updateStatus: (id: string, status: LidStatus, managerName?: string) => void
	deleteLid: (id: string) => void
	addActionLog: (lidId: string, log: Omit<ActionLog, 'id' | 'timestamp'>) => void
	convertToStudent: (lidId: string) => void
}

export const COURSE_TYPES_UZ = [
	'Frontend kursi',
	'Backend kursi',
	'Fullstack kursi',
	'UI/UX dizayn kursi',
	'Mobile Development',
]

export const STATUS_LABELS_UZ: Record<LidStatus, string> = {
	new: 'Yangi',
	called: 'Qo\'ng\'iroq qilingan',
	interested: 'Qiziqdi',
	thinking: 'O\'ylab ko\'ryapti',
	closed: 'Yopildi (yo\'q bo\'ldi)',
	converted: 'Studentga aylandi',
}

export const SOURCE_LABELS_UZ: Record<LeadSource, string> = {
	instagram: 'Instagram',
	telegram: 'Telegram',
	banner: 'Banner',
	friend_recommendation: 'Do\'st tavsiyasi',
	website: 'Sayt',
	other: 'Boshqa',
}

export const MANAGERS = [
	{ id: '1', name: 'Akmal Toshmatov' },
	{ id: '2', name: 'Dilshod Karimov' },
	{ id: '3', name: 'Sardor Valiyev' },
]

export const useLidsStore = create<LidsStore>((set, get) => ({
	open: false,
	profileOpen: false,
	selectedLid: null,
	// Add a couple of sample lids so the table shows data during development.
	lids: [
		{ 
			id: '1', 
			name: 'Ali Ahmadov', 
			phoneNumber: '+998901234567', 
			courseType: COURSE_TYPES_UZ[0], 
			status: 'interested',
			interestedDate: new Date().toISOString(),
			source: 'instagram',
			managerId: '1',
			managerName: 'Akmal Toshmatov',
			comments: 'Qiziqish bildirdi',
			createdAt: new Date(Date.now() - 86400000).toISOString(),
			actionLog: [
				{
					id: '1',
					type: 'status_change',
					timestamp: new Date().toISOString(),
					description: 'Status "Qiziqdi" ga o\'zgartirildi',
					managerName: 'Akmal Toshmatov'
				}
			]
		},
		{ 
			id: '2', 
			name: 'Gulnoza Karimova', 
			phoneNumber: '+998939876543', 
			courseType: COURSE_TYPES_UZ[2], 
			status: 'called',
			interestedDate: new Date().toISOString(),
			source: 'telegram',
			managerId: '2',
			managerName: 'Dilshod Karimov',
			createdAt: new Date(Date.now() - 172800000).toISOString(),
			actionLog: [
				{
					id: '2',
					type: 'call',
					timestamp: new Date().toISOString(),
					description: 'Qo\'ng\'iroq qilindi',
					managerName: 'Dilshod Karimov'
				}
			]
		}
	],
	data: null,
	onOpen: (data?: Lid | null) => set({ open: true, data: data || null }),
	onClose: () => set({ open: false, data: null }),
	openProfile: (lid: Lid) => set({ profileOpen: true, selectedLid: lid }),
	closeProfile: () => set({ profileOpen: false, selectedLid: null }),
	addLid: (lid) => {
		const now = new Date().toISOString()
		const newLid: Lid = { 
			id: Date.now().toString(), 
			...lid,
			createdAt: now,
			actionLog: [
				{
					id: Date.now().toString(),
					type: 'status_change',
					timestamp: now,
					description: `Lead "${STATUS_LABELS_UZ[lid.status]}" statusi bilan yaratildi`,
					managerName: lid.managerName
				}
			]
		}
		set({ lids: [...get().lids, newLid], open: false, data: null })
	},
	updateLid: (lid) => {
		set({ lids: get().lids.map(l => (l.id === lid.id ? lid : l)), open: false, data: null })
	},
	updateStatus: (id, status, managerName) => {
		const lid = get().lids.find(l => l.id === id)
		if (!lid) return
		
		const newLog: ActionLog = {
			id: Date.now().toString(),
			type: 'status_change',
			timestamp: new Date().toISOString(),
			description: `Status "${STATUS_LABELS_UZ[lid.status]}" dan "${STATUS_LABELS_UZ[status]}" ga o'zgartirildi`,
			managerName: managerName || lid.managerName
		}
		
		set({ 
			lids: get().lids.map(l => 
				l.id === id 
					? { ...l, status, actionLog: [...l.actionLog, newLog] } 
					: l
			) 
		})
	},
	deleteLid: (id) => {
		set({ lids: get().lids.filter(l => l.id !== id) })
	},
	addActionLog: (lidId, log) => {
		const newLog: ActionLog = {
			...log,
			id: Date.now().toString(),
			timestamp: new Date().toISOString()
		}
		set({
			lids: get().lids.map(l =>
				l.id === lidId
					? { ...l, actionLog: [...l.actionLog, newLog] }
					: l
			)
		})
	},
	convertToStudent: (lidId) => {
		const lid = get().lids.find(l => l.id === lidId)
		if (!lid) return
		
		const newLog: ActionLog = {
			id: Date.now().toString(),
			type: 'status_change',
			timestamp: new Date().toISOString(),
			description: 'Lead Studentga aylantirildi',
			managerName: lid.managerName
		}
		
		set({
			lids: get().lids.map(l =>
				l.id === lidId
					? { ...l, status: 'converted', actionLog: [...l.actionLog, newLog] }
					: l
			)
		})
	}
}))

