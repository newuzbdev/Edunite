"use client"

import { useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { MoreVertical } from "lucide-react"
import { useLidsStore, STATUS_LABELS_UZ } from "../utils/lids-store"
import LidsDrawer from "./lids-drawer"
import { toast } from "sonner"

type Lid = {
  id: string
  name: string
  phoneNumber: string
  courseType: string
  status: "interested" | "tested" | "failed" | "accepted"
}

export default function LidsTable() {
  const lids = useLidsStore(state => state.lids)
  const onOpen = useLidsStore(state => state.onOpen)
  const deleteLid = useLidsStore(state => state.deleteLid)
  const updateStatus = useLidsStore(state => state.updateStatus)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [lidToDelete, setLidToDelete] = useState<Lid | null>(null)

  const handleDeleteClick = (lid: Lid) => {
    setLidToDelete(lid)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (lidToDelete) {
      deleteLid(lidToDelete.id)
      toast.success("Lid muvaffaqiyatli o'chirildi")
      setDeleteDialogOpen(false)
      setLidToDelete(null)
    }
  }

  const columns = useMemo<ColumnDef<Lid, any>[]>(() => {
    const handleStatusChangeInCell = (lid: Lid, newStatus: Lid['status']) => {
      updateStatus(lid.id, newStatus)
      toast.success("Status muvaffaqiyatli yangilandi")
    }

    return [
    {
      id: 'rowNumber',
      header: '#',
      cell: info => {
        return <span className="text-muted-foreground">{info.row.index + 1}</span>
      },
      enableSorting: false,
    },
    { accessorKey: "name", header: "Ism" },
    { accessorKey: "phoneNumber", header: "Telefon" },
    { accessorKey: "courseType", header: "Kurs turi" },
    {
      accessorKey: "status",
      header: "Status",
      cell: info => {
        const row = info.row.original
        const currentStatus = info.getValue() as Lid['status']
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer hover:underline text-left">
                {STATUS_LABELS_UZ[currentStatus]}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem 
                onClick={() => handleStatusChangeInCell(row, 'interested')}
                className="cursor-pointer"
              >
                {STATUS_LABELS_UZ.interested}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusChangeInCell(row, 'tested')}
                className="cursor-pointer"
              >
                {STATUS_LABELS_UZ.tested}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusChangeInCell(row, 'failed')}
                className="cursor-pointer"
              >
                {STATUS_LABELS_UZ.failed}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusChangeInCell(row, 'accepted')}
                className="cursor-pointer"
              >
                {STATUS_LABELS_UZ.accepted}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: info => {
        const row = info.row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onOpen(row)} className="cursor-pointer">
                Tahrirlash
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteClick(row)} 
                variant="destructive"
                className="cursor-pointer"
              >
                Ochirish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
    ]
  }, [onOpen, updateStatus, handleDeleteClick])

  const table = useReactTable({
    data: lids,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <h2 className="text-lg font-semibold">Lidlar</h2>
        <div>
          <Button onClick={() => onOpen()} className="cursor-pointer">Lids qo'shish</Button>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="h-24 text-center" colSpan={columns.length}>
                    Hech qanday lids mavjud emas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <LidsDrawer />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lidni o'chirish</DialogTitle>
            <DialogDescription>
              "{lidToDelete?.name}" ni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="cursor-pointer"
            >
              Bekor qilish
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="cursor-pointer"
            >
              O'chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
