import { create } from 'zustand'

export type LidStatus = 'interested' | 'tested' | 'failed' | 'accepted'

export interface Lid {
	id: string
	name: string
	phoneNumber: string
	courseType: string
	status: LidStatus
}

interface LidsStore {
	open: boolean
	lids: Lid[]
	// open the drawer; optional data to edit an existing lid
	data: Lid | null
	onOpen: (data?: Lid | null) => void
	onClose: () => void
	addLid: (lid: Omit<Lid, 'id'>) => void
	updateLid: (lid: Lid) => void
	updateStatus: (id: string, status: LidStatus) => void
	deleteLid: (id: string) => void
}

export const COURSE_TYPES_UZ = [
	'Frontend kursi',
	'Backend kursi',
	'Fullstack kursi',
	'UI/UX dizayn kursi',
]

export const STATUS_LABELS_UZ: Record<LidStatus, string> = {
	interested: 'Qiziqish bildirgan',
	tested: 'Testdan o‘tgan',
	failed: 'Muvaffaqiyatsiz',
	accepted: 'Qabul qilingan',
}

export const useLidsStore = create<LidsStore>((set, get) => ({
	open: false,
	// Add a couple of sample lids so the table shows data during development.
	lids: [
		{ id: '1', name: 'Ali Ahmadov', phoneNumber: '+998901234567', courseType: COURSE_TYPES_UZ[0], status: 'interested' },
		{ id: '2', name: 'Gulnoza Karimova', phoneNumber: '+998939876543', courseType: COURSE_TYPES_UZ[2], status: 'tested' }
	],
	data: null,
	onOpen: (data?: Lid | null) => set({ open: true, data: data || null }),
	onClose: () => set({ open: false, data: null }),
	addLid: (lid) => {
		const newLid: Lid = { id: Date.now().toString(), ...lid }
		set({ lids: [...get().lids, newLid], open: false, data: null })
	},
	updateLid: (lid) => {
		set({ lids: get().lids.map(l => (l.id === lid.id ? lid : l)), open: false, data: null })
	},
	updateStatus: (id, status) => {
		set({ lids: get().lids.map(l => (l.id === id ? { ...l, status } : l)) })
	},
	deleteLid: (id) => {
		set({ lids: get().lids.filter(l => l.id !== id) })
	}
}))

