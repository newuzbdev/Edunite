"use client"

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import { useTeachersStore } from "../utils/teachers-store"
import TeachersForm from "./teachers-form"

export default function TeachersDrawer() {
	const open = useTeachersStore((state) => state.open)
	const onClose = useTeachersStore((state) => state.onClose)
	const data = useTeachersStore((state) => state.data)

	return (
		<Sheet open={open} onOpenChange={onClose}>
			<SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
				<SheetHeader>
					<SheetTitle className="text-2xl font-bold tracking-tight">
						{data ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi qo'shish"}
					</SheetTitle>
					<SheetDescription className="text-sm text-muted-foreground mt-2">
						{data
							? "O'qituvchi ma'lumotlarini yangilang"
							: "Yangi o'qituvchi ma'lumotlarini kiriting"}
					</SheetDescription>
				</SheetHeader>
				<div className="mt-6">
					<TeachersForm />
				</div>
			</SheetContent>
		</Sheet>
	)
}
