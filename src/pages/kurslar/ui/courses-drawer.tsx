"use client"
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerClose,
} from "@/components/ui/drawer"
import CoursesForm from "./courses-form"
import { useCoursesStore } from "../utils/courses-store"
import { XIcon } from "lucide-react"

export default function CoursesDrawer() {
	const open = useCoursesStore((state) => state.open)
	const onOpen = useCoursesStore((state) => state.onOpen)
	const onClose = useCoursesStore((state) => state.onClose)
	const data = useCoursesStore((state) => state.data)

	return (
		<Drawer open={open} onOpenChange={(v: boolean) => (v ? onOpen() : onClose())} direction="right">
			<DrawerContent className="!w-full md:!w-1/2 lg:!w-1/2 !max-w-none h-full max-h-screen flex flex-col">
				<DrawerClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none z-10">
					<XIcon className="size-4" />
					<span className="sr-only">Close</span>
				</DrawerClose>
				<DrawerHeader className="flex-shrink-0">
					<DrawerTitle>{data ? "Kursni tahrirlash" : "Yangi kurs yaratish"}</DrawerTitle>
				</DrawerHeader>

				<div className="flex-1 overflow-y-auto overscroll-contain min-h-0 px-6 pb-6">
					<CoursesForm />
				</div>
			</DrawerContent>
		</Drawer>
	)
}

