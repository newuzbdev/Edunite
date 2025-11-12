"use client"
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerFooter,
	DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import LidsForm from "./lids-form"
import { useLidsStore } from "../utils/lids-store"

export default function LidsDrawer() {
	const open = useLidsStore(state => state.open)
	const onOpen = useLidsStore(state => state.onOpen)
	const onClose = useLidsStore(state => state.onClose)

	return (
		<Drawer open={open} onOpenChange={(v: boolean) => (v ? onOpen() : onClose())}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Lid qo'shish</DrawerTitle>
					<DrawerDescription>Yangi lids (faqat UI, hech qanday so'rov yuborilmaydi)</DrawerDescription>
				</DrawerHeader>

				<div className="p-2">
					<LidsForm />
				</div>

				<DrawerFooter>
					<DrawerClose>
						<Button variant="outline">Yopish</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
