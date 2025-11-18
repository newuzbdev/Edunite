"use client"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"
import PaymentsForm from "./payments-form"
import { usePaymentsStore } from "../utils/payments-store"
import { XIcon } from "lucide-react"

export default function PaymentsDrawer() {
  const open = usePaymentsStore((state) => state.open)
  const onOpen = usePaymentsStore((state) => state.onOpen)
  const onClose = usePaymentsStore((state) => state.onClose)
  const data = usePaymentsStore((state) => state.data)

  return (
    <Drawer open={open} onOpenChange={(v: boolean) => (v ? onOpen() : onClose())} direction="right">
      <DrawerContent className="!w-full md:!w-1/2 lg:!w-1/2 !max-w-none h-full max-h-screen flex flex-col">
        <DrawerClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none z-10">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </DrawerClose>
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle>{data ? "To'lovni tahrirlash" : "To'lov qo'shish"}</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 px-2 pb-4">
          <PaymentsForm />
        </div>
      </DrawerContent>
    </Drawer>
  )
}