"use client"
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerClose,
} from "@/components/ui/drawer"
import LidsForm from "./lids-form"
import { useLidsStore } from "../utils/lids-store"
import { XIcon } from "lucide-react"

export default function LidsDrawer() {
	const open = useLidsStore(state => state.open)
	const onOpen = useLidsStore(state => state.onOpen)
	const onClose = useLidsStore(state => state.onClose)
	const data = useLidsStore(state => state.data)

	return (
		<Drawer open={open} onOpenChange={(v: boolean) => (v ? onOpen() : onClose())} direction="right">
			<DrawerContent className="max-w-3xl w-full h-full flex flex-col">
				<DrawerClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none z-10">
					<XIcon className="size-4" />
					<span className="sr-only">Close</span>
				</DrawerClose>
				<DrawerHeader>
					<DrawerTitle>{data ? "Lidni tahrirlash" : "Lid qo'shish"}</DrawerTitle>
				</DrawerHeader>

				<div className="flex-1 overflow-y-auto min-h-0 p-2">
					<LidsForm />
				</div>
			</DrawerContent>
		</Drawer>
	)
}
