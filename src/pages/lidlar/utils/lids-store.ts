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

export interface CustomKanbanColumn {
	id: string
	name: string
	createdAt: string
}

interface LidsStore {
	open: boolean
	profileOpen: boolean
	selectedLid: Lid | null
	lids: Lid[]
	// open the drawer; optional data to edit an existing lid
	data: Lid | null
	shouldSwitchToKanban: boolean
	customKanbanColumns: CustomKanbanColumn[]
	statusColumnLabels: Partial<Record<LidStatus, string>>
	hiddenStatuses: LidStatus[]
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
	resetKanbanSwitch: () => void
	addCustomKanbanColumn: (name: string) => void
	updateCustomKanbanColumn: (id: string, name: string) => void
	deleteCustomKanbanColumn: (id: string) => void
	updateStatusColumnLabel: (status: LidStatus, name: string) => void
	hideStatusColumn: (status: LidStatus) => void
	restoreStatusColumn: (status: LidStatus) => void
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

export const STATUS_LABELS_UZ: Record<LidStatus, string> = {
	new: 'Yangi',
	called: 'Qo\'ng\'iroq qilingan',
	interested: 'Qiziqdi',
	thinking: 'O\'ylab ko\'ryapti',
	closed: 'Yopildi',
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
			comments: 'Ona tili kursiga qiziqish bildirdi',
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
			courseType: COURSE_TYPES_UZ[4], 
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
		},
		{ 
			id: '3', 
			name: 'Sardor Valiyev', 
			phoneNumber: '+998901234568', 
			courseType: COURSE_TYPES_UZ[5], 
			status: 'thinking',
			interestedDate: new Date(Date.now() - 259200000).toISOString(),
			source: 'website',
			managerId: '1',
			managerName: 'Akmal Toshmatov',
			comments: 'O\'ylab ko\'rmoqda',
			createdAt: new Date(Date.now() - 259200000).toISOString(),
			actionLog: [
				{
					id: '3',
					type: 'status_change',
					timestamp: new Date().toISOString(),
					description: 'Status "O\'ylab ko\'ryapti" ga o\'zgartirildi',
					managerName: 'Akmal Toshmatov'
				}
			]
		},
		{ 
			id: '4', 
			name: 'Dilshod Toshmatov', 
			phoneNumber: '+998901234569', 
			courseType: COURSE_TYPES_UZ[10], 
			status: 'interested',
			interestedDate: new Date(Date.now() - 345600000).toISOString(),
			source: 'banner',
			managerId: '2',
			managerName: 'Dilshod Karimov',
			comments: 'IELTS kursiga qiziqdi',
			createdAt: new Date(Date.now() - 345600000).toISOString(),
			actionLog: [
				{
					id: '4',
					type: 'call',
					timestamp: new Date().toISOString(),
					description: 'Qo\'ng\'iroq qilindi',
					managerName: 'Dilshod Karimov'
				}
			]
		},
		{ 
			id: '5', 
			name: 'Malika Yusupova', 
			phoneNumber: '+998901234570', 
			courseType: COURSE_TYPES_UZ[11], 
			status: 'new',
			interestedDate: new Date().toISOString(),
			source: 'friend_recommendation',
			managerId: '3',
			managerName: 'Sardor Valiyev',
			createdAt: new Date(Date.now() - 432000000).toISOString(),
			actionLog: []
		},
		{ 
			id: '6', 
			name: 'Feruza Alimova', 
			phoneNumber: '+998901234571', 
			courseType: COURSE_TYPES_UZ[1], 
			status: 'called',
			interestedDate: new Date(Date.now() - 518400000).toISOString(),
			source: 'instagram',
			managerId: '1',
			managerName: 'Akmal Toshmatov',
			comments: 'Qo\'ng\'iroq qilindi, ma\'lumot berildi',
			createdAt: new Date(Date.now() - 518400000).toISOString(),
			actionLog: [
				{
					id: '5',
					type: 'call',
					timestamp: new Date().toISOString(),
					description: 'Qo\'ng\'iroq qilindi',
					managerName: 'Akmal Toshmatov'
				}
			]
		},
		{ 
			id: '7', 
			name: 'Bobur Ismoilov', 
			phoneNumber: '+998901234572', 
			courseType: COURSE_TYPES_UZ[6], 
			status: 'interested',
			interestedDate: new Date(Date.now() - 604800000).toISOString(),
			source: 'telegram',
			managerId: '2',
			managerName: 'Dilshod Karimov',
			comments: 'Advanced English kursiga qiziqdi',
			createdAt: new Date(Date.now() - 604800000).toISOString(),
			actionLog: [
				{
					id: '6',
					type: 'status_change',
					timestamp: new Date().toISOString(),
					description: 'Status "Qiziqdi" ga o\'zgartirildi',
					managerName: 'Dilshod Karimov'
				}
			]
		},
		{ 
			id: '8', 
			name: 'Nigora Xasanova', 
			phoneNumber: '+998901234573', 
			courseType: COURSE_TYPES_UZ[14], 
			status: 'thinking',
			interestedDate: new Date(Date.now() - 691200000).toISOString(),
			source: 'website',
			managerId: '3',
			managerName: 'Sardor Valiyev',
			comments: 'Matematika kursi haqida so\'radi',
			createdAt: new Date(Date.now() - 691200000).toISOString(),
			actionLog: [
				{
					id: '7',
					type: 'call',
					timestamp: new Date().toISOString(),
					description: 'Qo\'ng\'iroq qilindi',
					managerName: 'Sardor Valiyev'
				}
			]
		},
		{ 
			id: '9', 
			name: 'Azizbek Usmonov', 
			phoneNumber: '+998901234574', 
			courseType: COURSE_TYPES_UZ[7], 
			status: 'new',
			interestedDate: new Date().toISOString(),
			source: 'banner',
			managerId: '1',
			managerName: 'Akmal Toshmatov',
			createdAt: new Date(Date.now() - 777600000).toISOString(),
			actionLog: []
		},
		{ 
			id: '10', 
			name: 'Javohir Karimov', 
			phoneNumber: '+998901234575', 
			courseType: COURSE_TYPES_UZ[12], 
			status: 'called',
			interestedDate: new Date(Date.now() - 864000000).toISOString(),
			source: 'friend_recommendation',
			managerId: '2',
			managerName: 'Dilshod Karimov',
			comments: 'Rus tili kursiga qiziqdi',
			createdAt: new Date(Date.now() - 864000000).toISOString(),
			actionLog: [
				{
					id: '8',
					type: 'call',
					timestamp: new Date().toISOString(),
					description: 'Qo\'ng\'iroq qilindi',
					managerName: 'Dilshod Karimov'
				}
			]
		},
		{ 
			id: '11', 
			name: 'Kamola Rahimova', 
			phoneNumber: '+998901234576', 
			courseType: COURSE_TYPES_UZ[3], 
			status: 'interested',
			interestedDate: new Date(Date.now() - 950400000).toISOString(),
			source: 'instagram',
			managerId: '3',
			managerName: 'Sardor Valiyev',
			comments: 'Ona tili imtihon tayyorlov kursiga qiziqdi',
			createdAt: new Date(Date.now() - 950400000).toISOString(),
			actionLog: [
				{
					id: '9',
					type: 'status_change',
					timestamp: new Date().toISOString(),
					description: 'Status "Qiziqdi" ga o\'zgartirildi',
					managerName: 'Sardor Valiyev'
				}
			]
		},
		{ 
			id: '12', 
			name: 'Shohruh Mirzayev', 
			phoneNumber: '+998901234577', 
			courseType: COURSE_TYPES_UZ[16], 
			status: 'thinking',
			interestedDate: new Date(Date.now() - 1036800000).toISOString(),
			source: 'telegram',
			managerId: '1',
			managerName: 'Akmal Toshmatov',
			comments: 'Fizika kursi haqida ma\'lumot so\'radi',
			createdAt: new Date(Date.now() - 1036800000).toISOString(),
			actionLog: [
				{
					id: '10',
					type: 'call',
					timestamp: new Date().toISOString(),
					description: 'Qo\'ng\'iroq qilindi',
					managerName: 'Akmal Toshmatov'
				}
			]
		},
		{ 
			id: '13', 
			name: 'Dilshoda Toshmatova', 
			phoneNumber: '+998901234578', 
			courseType: COURSE_TYPES_UZ[9], 
			status: 'new',
			interestedDate: new Date().toISOString(),
			source: 'website',
			managerId: '2',
			managerName: 'Dilshod Karimov',
			createdAt: new Date(Date.now() - 1123200000).toISOString(),
			actionLog: []
		},
		{ 
			id: '14', 
			name: 'Madina Sobirova', 
			phoneNumber: '+998901234579', 
			courseType: COURSE_TYPES_UZ[8], 
			status: 'called',
			interestedDate: new Date(Date.now() - 1209600000).toISOString(),
			source: 'banner',
			managerId: '3',
			managerName: 'Sardor Valiyev',
			comments: 'Bolalar uchun English kursiga qiziqdi',
			createdAt: new Date(Date.now() - 1209600000).toISOString(),
			actionLog: [
				{
					id: '11',
					type: 'call',
					timestamp: new Date().toISOString(),
					description: 'Qo\'ng\'iroq qilindi',
					managerName: 'Sardor Valiyev'
				}
			]
		},
		{ 
			id: '15', 
			name: 'Rustam Abdurahmonov', 
			phoneNumber: '+998901234580', 
			courseType: COURSE_TYPES_UZ[19], 
			status: 'interested',
			interestedDate: new Date(Date.now() - 1296000000).toISOString(),
			source: 'friend_recommendation',
			managerId: '1',
			managerName: 'Akmal Toshmatov',
			comments: 'Tarix kursiga qiziqish bildirdi',
			createdAt: new Date(Date.now() - 1296000000).toISOString(),
			actionLog: [
				{
					id: '12',
					type: 'status_change',
					timestamp: new Date().toISOString(),
					description: 'Status "Qiziqdi" ga o\'zgartirildi',
					managerName: 'Akmal Toshmatov'
				}
			]
		},
		{ 
			id: '16', 
			name: 'Zarina Qodirova', 
			phoneNumber: '+998901234581', 
			courseType: COURSE_TYPES_UZ[15], 
			status: 'thinking',
			interestedDate: new Date(Date.now() - 1382400000).toISOString(),
			source: 'instagram',
			managerId: '2',
			managerName: 'Dilshod Karimov',
			comments: '10-11 sinf matematika kursi haqida so\'radi',
			createdAt: new Date(Date.now() - 1382400000).toISOString(),
			actionLog: [
				{
					id: '13',
					type: 'call',
					timestamp: new Date().toISOString(),
					description: 'Qo\'ng\'iroq qilindi',
					managerName: 'Dilshod Karimov'
				}
			]
		},
		{ 
			id: '17', 
			name: 'Farhod Jalilov', 
			phoneNumber: '+998901234582', 
			courseType: COURSE_TYPES_UZ[13], 
			status: 'new',
			interestedDate: new Date().toISOString(),
			source: 'telegram',
			managerId: '3',
			managerName: 'Sardor Valiyev',
			createdAt: new Date(Date.now() - 1468800000).toISOString(),
			actionLog: []
		},
		{ 
			id: '18', 
			name: 'Yulduz Toshmatova', 
			phoneNumber: '+998901234583', 
			courseType: COURSE_TYPES_UZ[17], 
			status: 'called',
			interestedDate: new Date(Date.now() - 1555200000).toISOString(),
			source: 'website',
			managerId: '1',
			managerName: 'Akmal Toshmatov',
			comments: 'Kimyo kursi haqida ma\'lumot so\'radi',
			createdAt: new Date(Date.now() - 1555200000).toISOString(),
			actionLog: [
				{
					id: '14',
					type: 'call',
					timestamp: new Date().toISOString(),
					description: 'Qo\'ng\'iroq qilindi',
					managerName: 'Akmal Toshmatov'
				}
			]
		},
		{ 
			id: '19', 
			name: 'Nodira Xamidova', 
			phoneNumber: '+998901234584', 
			courseType: COURSE_TYPES_UZ[18], 
			status: 'interested',
			interestedDate: new Date(Date.now() - 1641600000).toISOString(),
			source: 'banner',
			managerId: '2',
			managerName: 'Dilshod Karimov',
			comments: 'Biologiya kursiga qiziqdi',
			createdAt: new Date(Date.now() - 1641600000).toISOString(),
			actionLog: [
				{
					id: '15',
					type: 'status_change',
					timestamp: new Date().toISOString(),
					description: 'Status "Qiziqdi" ga o\'zgartirildi',
					managerName: 'Dilshod Karimov'
				}
			]
		},
		{ 
			id: '20', 
			name: 'Sanjar Rahimov', 
			phoneNumber: '+998901234585', 
			courseType: COURSE_TYPES_UZ[2], 
			status: 'closed',
			interestedDate: new Date(Date.now() - 1728000000).toISOString(),
			source: 'friend_recommendation',
			managerId: '3',
			managerName: 'Sardor Valiyev',
			comments: 'Yopildi - boshqa markazga ketdi',
			createdAt: new Date(Date.now() - 1728000000).toISOString(),
			actionLog: [
				{
					id: '16',
					type: 'status_change',
					timestamp: new Date().toISOString(),
					description: 'Status "Yopildi" ga o\'zgartirildi',
					managerName: 'Sardor Valiyev'
				}
			]
		},
	],
	data: null,
	shouldSwitchToKanban: false,
	customKanbanColumns: [],
	statusColumnLabels: {},
	hiddenStatuses: [],
	onOpen: (data?: Lid | null) => set({ open: true, data: data || null, shouldSwitchToKanban: false }),
	onClose: () => {
		const state = get()
		// Only reset shouldSwitchToKanban if we're editing (data is not null) or if it's already false
		// If we're adding (data is null) and shouldSwitchToKanban is true, preserve it
		const shouldPreserve = state.data === null && state.shouldSwitchToKanban
		set({ open: false, data: null, shouldSwitchToKanban: shouldPreserve })
	},
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
		const shouldSwitch = get().shouldSwitchToKanban
		set({ lids: [...get().lids, newLid], open: false, data: null, shouldSwitchToKanban: shouldSwitch })
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
	},
	resetKanbanSwitch: () => set({ shouldSwitchToKanban: false }),
	addCustomKanbanColumn: (name) => {
		const newColumn: CustomKanbanColumn = {
			id: Date.now().toString(),
			name: name.trim(),
			createdAt: new Date().toISOString()
		}
		set({ customKanbanColumns: [...get().customKanbanColumns, newColumn] })
	},
	updateCustomKanbanColumn: (id, name) => {
		set({
			customKanbanColumns: get().customKanbanColumns.map(col =>
				col.id === id ? { ...col, name: name.trim() } : col
			),
		})
	},
	deleteCustomKanbanColumn: (id) => {
		set({ customKanbanColumns: get().customKanbanColumns.filter(col => col.id !== id) })
	},
	updateStatusColumnLabel: (status, name) => {
		const currentLabels = get().statusColumnLabels
		const trimmed = name.trim()
		if (!trimmed || trimmed === STATUS_LABELS_UZ[status]) {
			const { [status]: _removed, ...rest } = currentLabels
			set({ statusColumnLabels: rest })
			return
		}
		set({
			statusColumnLabels: {
				...currentLabels,
				[status]: trimmed,
			},
		})
	},
	hideStatusColumn: status => {
		const hidden = get().hiddenStatuses
		if (hidden.includes(status)) return
		set({ hiddenStatuses: [...hidden, status] })
	},
	restoreStatusColumn: status => {
		set({ hiddenStatuses: get().hiddenStatuses.filter(item => item !== status) })
	},
}))

