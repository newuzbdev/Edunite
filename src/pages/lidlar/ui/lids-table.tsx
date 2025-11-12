"use client"

import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useLidsStore, STATUS_LABELS_UZ } from "../utils/lids-store"
import LidsDrawer from "./lids-drawer"

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

  const columns = useMemo<ColumnDef<Lid, any>[]>(() => [
    { accessorKey: "name", header: "Ism" },
    { accessorKey: "phoneNumber", header: "Telefon" },
    { accessorKey: "courseType", header: "Kurs turi" },
    {
      accessorKey: "status",
      header: "Status",
      cell: info => {
        const s = info.getValue() as Lid['status']
        // import label mapping dynamically via STATUS_LABELS_UZ
        return STATUS_LABELS_UZ[s]
      }
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: info => {
        const row = info.row.original
        return <Button size="sm" variant="ghost" onClick={() => onOpen(row)}>Tahrirlash</Button>
      }
    }
  ], [onOpen])

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
          <Button onClick={() => onOpen()}>Lids qo'shish</Button>
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
    </div>
  )
}
