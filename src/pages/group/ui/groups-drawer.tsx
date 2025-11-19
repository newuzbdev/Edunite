"use client"
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerClose,
} from "@/components/ui/drawer"
import GroupsForm from "./groups-form"
import { useGroupsStore } from "../utils/groups-store"
import { XIcon } from "lucide-react"

export default function GroupsDrawer() {
	const open = useGroupsStore((state) => state.open)
	const onOpen = useGroupsStore((state) => state.onOpen)
	const onClose = useGroupsStore((state) => state.onClose)
	const data = useGroupsStore((state) => state.data)

	return (
		<Drawer open={open} onOpenChange={(v: boolean) => (v ? onOpen() : onClose())} direction="right">
			<DrawerContent className="!w-full md:!w-1/2 lg:!w-1/2 !max-w-none h-full max-h-screen flex flex-col">
				<DrawerClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none z-10">
					<XIcon className="size-4" />
					<span className="sr-only">Close</span>
				</DrawerClose>
				<DrawerHeader className="flex-shrink-0">
					<DrawerTitle>{data ? "Guruhni tahrirlash" : "Guruh qo'shish"}</DrawerTitle>
				</DrawerHeader>

				<div className="flex-1 overflow-y-auto overscroll-contain min-h-0 px-2 pb-4">
					<GroupsForm />
				</div>
			</DrawerContent>
		</Drawer>
	)
}