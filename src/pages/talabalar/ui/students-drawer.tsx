"use client"
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerClose,
} from "@/components/ui/drawer"
import StudentsForm from "./students-form"
import { useStudentsStore } from "../utils/students-store"
import { XIcon } from "lucide-react"

export default function StudentsDrawer() {
	const open = useStudentsStore((state) => state.open)
	const onOpen = useStudentsStore((state) => state.onOpen)
	const onClose = useStudentsStore((state) => state.onClose)
	const data = useStudentsStore((state) => state.data)

	return (
		<Drawer open={open} onOpenChange={(v: boolean) => (v ? onOpen() : onClose())} direction="right">
			<DrawerContent>
				<DrawerClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none z-10">
					<XIcon className="size-4" />
					<span className="sr-only">Close</span>
				</DrawerClose>
				<DrawerHeader>
					<DrawerTitle>{data ? "Talabani tahrirlash" : "Talaba qo'shish"}</DrawerTitle>
				</DrawerHeader>

				<div className="p-2">
					<StudentsForm />
				</div>
			</DrawerContent>
		</Drawer>
	)
}

