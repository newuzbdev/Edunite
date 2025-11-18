"use client"

import { forwardRef, useCallback, useMemo, useState } from "react"
import type { CSSProperties } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import {
	DndContext,
	type DragEndEvent,
	type DragStartEvent,
	type DraggableAttributes,
	DragOverlay,
	PointerSensor,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select"
import {
	GripVertical,
	MoreVertical,
	TrendingDown,
	TrendingUp,
	UserCheck,
	UserPlus,
	UserX,
	Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLidsStore, STATUS_LABELS_UZ, SOURCE_LABELS_UZ, COURSE_TYPES_UZ, MANAGERS, type Lid, type LidStatus } from "../utils/lids-store"
import LidsDrawer from "./lids-drawer"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const STATUS_ORDER: LidStatus[] = ["new", "called", "interested", "thinking", "closed", "converted"]

type StatusChangeOptions = { silent?: boolean }

type LidsBoardProps = {
  lids: Lid[]
  onEdit: (lid: Lid) => void
  onDelete: (lid: Lid) => void
  onStatusChange: (id: string, status: LidStatus, options?: StatusChangeOptions) => void
  onViewProfile: (lid: Lid) => void
}

type SortableListeners = ReturnType<typeof useSortable>["listeners"]

type LidSummaryCardConfig = {
  key: string
  title: string
  value: number
  icon?: LucideIcon
  caption?: string
  delta?: string
  description?: string
  trend?: "up" | "down"
}

function LidSummaryCard({ card }: { card: LidSummaryCardConfig }) {
  const Icon = card.icon ?? Users
  const formattedValue = new Intl.NumberFormat("en-US").format(card.value)
  const showTrend = Boolean(card.delta)
  const trendIsDown = card.trend === "down"
  const trendColor = trendIsDown ? "text-destructive" : "text-emerald-500"

  return (
    <Card className="shadow-xs">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <div className="space-y-1">
          <CardDescription>{card.title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">{formattedValue}</CardTitle>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      {(card.delta || card.caption) && (
        <CardContent className="flex items-center gap-2 pt-0 text-sm text-muted-foreground">
          {showTrend ? (
            <span className={`flex items-center gap-1 font-medium ${trendColor}`}>
              {trendIsDown ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
              {card.delta}
            </span>
          ) : null}
          {card.caption ? <span>{card.caption}</span> : null}
        </CardContent>
      )}
      {card.description ? (
        <CardFooter className="pt-0 text-sm text-muted-foreground">{card.description}</CardFooter>
      ) : null}
    </Card>
  )
}

function LidsBoard({ lids, onEdit, onDelete, onStatusChange, onViewProfile }: LidsBoardProps) {
  const [activeLidId, setActiveLidId] = useState<string | null>(null)
  const activeLid = activeLidId ? lids.find(lid => lid.id === activeLidId) ?? null : null

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  )

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveLidId(active.id as string)
  }, [])

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over) {
        setActiveLidId(null)
        return
      }

      const sourceStatus = active.data.current?.status as LidStatus | undefined
      const destinationStatus = over.data.current?.status as LidStatus | undefined

      if (!destinationStatus || destinationStatus === sourceStatus) {
        setActiveLidId(null)
        return
      }

      onStatusChange(active.id as string, destinationStatus, { silent: true })
      setActiveLidId(null)
    },
    [onStatusChange]
  )

  const handleDragCancel = useCallback(() => {
    setActiveLidId(null)
  }, [])

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {STATUS_ORDER.map(status => {
          const items = lids.filter(lid => lid.status === status)
          return (
            <StatusColumn
              key={status}
              status={status}
              lids={items}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewProfile={onViewProfile}
            />
          )
        })}
      </div>
      <DragOverlay>
        {activeLid ? (
          <LidCardContent
            lid={activeLid}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewProfile={onViewProfile}
            dragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

type StatusColumnProps = {
  status: LidStatus
  lids: Lid[]
  onEdit: (lid: Lid) => void
  onDelete: (lid: Lid) => void
  onViewProfile: (lid: Lid) => void
}

function StatusColumn({ status, lids, onEdit, onDelete, onViewProfile }: StatusColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  })

  return (
    <div ref={setNodeRef} className="h-full min-h-[280px]">
      <Card
        className={cn(
          "h-full gap-3 border-dashed transition-colors",
          isOver && "border-primary bg-primary/5"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between px-5 py-0 pt-4">
          <CardTitle className="text-base font-semibold">
            {STATUS_LABELS_UZ[status]}
          </CardTitle>
          <Badge variant="secondary">{lids.length}</Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 px-5 pb-5">
          <SortableContext
            items={lids.map(lid => lid.id)}
            strategy={verticalListSortingStrategy}
          >
            {lids.length ? (
              lids.map(lid => (
                <LidCard key={lid.id} lid={lid} onEdit={onEdit} onDelete={onDelete} onViewProfile={onViewProfile} />
              ))
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 px-3 py-8 text-center text-sm text-muted-foreground">
                Hozircha lids mavjud emas
              </div>
            )}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  )
}

type LidCardProps = {
  lid: Lid
  onEdit: (lid: Lid) => void
  onDelete: (lid: Lid) => void
  onViewProfile: (lid: Lid) => void
}

function LidCard({ lid, onEdit, onDelete, onViewProfile }: LidCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lid.id,
    data: { status: lid.status },
    transition: {
      duration: 200,
      easing: "ease",
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "transform 0.2s ease" : transition ?? undefined,
  }

  return (
    <LidCardContent
      ref={setNodeRef}
      lid={lid}
      onEdit={onEdit}
      onDelete={onDelete}
      onViewProfile={onViewProfile}
      attributes={attributes}
      listeners={listeners}
      style={style}
      isDragging={isDragging}
    />
  )
}

type LidCardContentProps = LidCardProps & {
  isDragging?: boolean
  dragOverlay?: boolean
  style?: CSSProperties
  attributes?: DraggableAttributes
  listeners?: SortableListeners
}

const LidCardContent = forwardRef<HTMLDivElement, LidCardContentProps>(
  (
    {
      lid,
      onEdit,
      onDelete,
      onViewProfile,
      isDragging,
      dragOverlay,
      style,
      attributes,
      listeners,
    },
    ref
  ) => {
  return (
    <div
      ref={ref}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex cursor-grab flex-col gap-2 rounded-lg border bg-background p-4 shadow-sm transition",
        dragOverlay && "cursor-grabbing border-primary bg-background shadow-lg",
        isDragging && "cursor-grabbing border-primary bg-primary/10 shadow-lg"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <GripVertical className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="space-y-1 flex-1">
            <button 
              onClick={() => onViewProfile(lid)}
              className="font-semibold leading-5 text-left hover:underline cursor-pointer"
            >
              {lid.name}
            </button>
            <p className="text-sm text-muted-foreground">{lid.phoneNumber}</p>
          </div>
        </div>
        {!dragOverlay && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-7 w-7 cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewProfile(lid)} className="cursor-pointer">
                Profilni ko'rish
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(lid)} className="cursor-pointer">
                Tahrirlash
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(lid)}
                variant="destructive"
                className="cursor-pointer"
              >
                Ochirish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{lid.courseType}</p>
    </div>
  )
}
)

LidCardContent.displayName = "LidCardContent"

export default function LidsTable() {
  const navigate = useNavigate()
  const lids = useLidsStore(state => state.lids)
  const onOpen = useLidsStore(state => state.onOpen)
  const deleteLid = useLidsStore(state => state.deleteLid)
  const updateStatus = useLidsStore(state => state.updateStatus)
  const convertToStudent = useLidsStore(state => state.convertToStudent)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [lidToDelete, setLidToDelete] = useState<Lid | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "board">("table")
  const [statusFilter, setStatusFilter] = useState<LidStatus | "all">("all")
  const [courseFilter, setCourseFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [managerFilter, setManagerFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")

  const handleEdit = useCallback((lid: Lid) => {
    onOpen(lid)
  }, [onOpen])

  const handleDeleteClick = useCallback((lid: Lid) => {
    setLidToDelete(lid)
    setDeleteDialogOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (!lidToDelete) return

    deleteLid(lidToDelete.id)
    toast.success("Lid muvaffaqiyatli o'chirildi")
    setDeleteDialogOpen(false)
    setLidToDelete(null)
  }, [deleteLid, lidToDelete])

  const handleStatusChange = useCallback((
    id: string,
    status: LidStatus,
    options?: StatusChangeOptions
  ) => {
    const lid = lids.find(l => l.id === id)
    updateStatus(id, status, lid?.managerName)
    if (!options?.silent) {
      toast.success("Status muvaffaqiyatli yangilandi")
    }
  }, [updateStatus, lids])

  const handleConvertToStudent = useCallback((lid: Lid) => {
    convertToStudent(lid.id)
    toast.success("Lead Studentga aylantirildi")
  }, [convertToStudent])

  const filteredLids = useMemo(() => {
    return lids.filter(lid => {
      if (statusFilter !== "all" && lid.status !== statusFilter) return false
      if (courseFilter !== "all" && lid.courseType !== courseFilter) return false
      if (sourceFilter !== "all" && lid.source !== sourceFilter) return false
      if (managerFilter !== "all" && lid.managerId !== managerFilter) return false
      if (dateFilter && !new Date(lid.interestedDate).toISOString().split('T')[0].includes(dateFilter)) return false
      return true
    })
  }, [lids, statusFilter, courseFilter, sourceFilter, managerFilter, dateFilter])

  const columns = useMemo<ColumnDef<Lid, unknown>[]>(() => [
    {
      id: "rowNumber",
      header: "#",
      cell: info => <span className="text-muted-foreground">{info.row.index + 1}</span>,
      enableSorting: false,
    },
    { 
      accessorKey: "name", 
      header: "Ism Familiya",
      cell: info => {
        const row = info.row.original
        return (
          <button 
            onClick={() => navigate(`/lids/${row.id}`)}
            className="text-left font-medium hover:underline cursor-pointer"
          >
            {row.name}
          </button>
        )
      }
    },
    { accessorKey: "phoneNumber", header: "Telefon raqami" },
    { accessorKey: "courseType", header: "Qiziqqan kursi" },
    {
      accessorKey: "interestedDate",
      header: "Qiziqqan vaqti",
      cell: info => {
        const date = new Date(info.getValue() as string)
        return date.toLocaleDateString("uz-UZ", { year: "numeric", month: "short", day: "numeric" })
      }
    },
    {
      accessorKey: "source",
      header: "Manba",
      cell: info => {
        const source = info.getValue() as string | undefined
        return source ? SOURCE_LABELS_UZ[source as keyof typeof SOURCE_LABELS_UZ] : "-"
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: info => {
        const row = info.row.original
        const currentStatus = info.getValue() as LidStatus

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer text-left hover:underline">
                {STATUS_LABELS_UZ[currentStatus]}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {STATUS_ORDER.map(status => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(row.id, status)}
                  className="cursor-pointer"
                >
                  {STATUS_LABELS_UZ[status]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
    {
      accessorKey: "managerName",
      header: "Mas'ul menedjer",
      cell: info => {
        const manager = info.getValue() as string | undefined
        return manager || "-"
      }
    },
    {
      accessorKey: "comments",
      header: "Izohlar",
      cell: info => {
        const comments = info.getValue() as string | undefined
        return comments ? (
          <span className="max-w-[200px] truncate block" title={comments}>
            {comments}
          </span>
        ) : "-"
      }
    },
    {
      id: "actions",
      header: "Amallar",
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
              <DropdownMenuItem onClick={() => navigate(`/lids/${row.id}`)} className="cursor-pointer">
                Profilni ko'rish
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(row)} className="cursor-pointer">
                Tahrirlash
              </DropdownMenuItem>
              {row.status !== "converted" && (
                <DropdownMenuItem 
                  onClick={() => handleConvertToStudent(row)} 
                  className="cursor-pointer"
                >
                  Studentga aylantirish
                </DropdownMenuItem>
              )}
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
      },
    },
  ], [handleDeleteClick, handleEdit, handleStatusChange, handleConvertToStudent, navigate])

  const table = useReactTable({
    data: filteredLids,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const summaryCounts = useMemo(() => {
    const counts: Record<"total" | LidStatus, number> = {
      total: 0,
      new: 0,
      called: 0,
      interested: 0,
      thinking: 0,
      closed: 0,
      converted: 0,
    }

    lids.forEach(lid => {
      counts.total += 1
      counts[lid.status] += 1
    })

    return counts
  }, [lids])

  const { total, new: newCount, interested, closed, converted } = summaryCounts

  const summaryCards = useMemo<LidSummaryCardConfig[]>(() => {
    return [
      {
        key: "total",
        title: "Jami lidlar",
        value: total,
        icon: Users,
      },
      {
        key: "new",
        title: "Yangi",
        value: newCount,
        icon: UserPlus,
      },
      {
        key: "interested",
        title: "Qiziqdi",
        value: interested,
        icon: UserCheck,
      },
      {
        key: "converted",
        title: "Studentga aylandi",
        value: converted,
        icon: UserCheck,
      },
      {
        key: "closed",
        title: "Yopilgan",
        value: closed,
        icon: UserX,
      },
    ]
  }, [total, newCount, interested, converted, closed])

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 -m-2 lg:-m-3">
      <div className="min-h-[calc(100vh-8rem)] rounded-lg bg-white p-4 lg:p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="mb-2">
            <h1 className="text-3xl font-bold">Lidlar</h1>
            <p className="text-muted-foreground mt-1">Lead management and statistics</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {summaryCards.map(card => (
              <LidSummaryCard key={card.key} card={card} />
            ))}
          </div>
          
          <div className="mt-2 flex flex-col gap-4 md:mt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Tabs value={viewMode} onValueChange={value => setViewMode(value as "table" | "board")} className="w-auto">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="table" className="cursor-pointer">Jadval</TabsTrigger>
                  <TabsTrigger value="board" className="cursor-pointer">Kanban</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button onClick={() => onOpen()} className="cursor-pointer">
                Lead qo&apos;shish
              </Button>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LidStatus | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Status bo'yicha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha statuslar</SelectItem>
                  {STATUS_ORDER.map(status => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABELS_UZ[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Kurs bo'yicha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha kurslar</SelectItem>
                  {COURSE_TYPES_UZ.map(course => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Manba bo'yicha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha manbalar</SelectItem>
                  {Object.entries(SOURCE_LABELS_UZ).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={managerFilter} onValueChange={setManagerFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Menedjer bo'yicha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha menedjerlar</SelectItem>
                  {MANAGERS.map(manager => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="Sana bo'yicha"
              />
            </div>
          </div>

          {viewMode === "table" ? (
            <div>
              <div className="overflow-hidden rounded-lg border bg-white">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
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
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
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
          ) : (
            <LidsBoard
              lids={lids}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onStatusChange={handleStatusChange}
              onViewProfile={(lid) => navigate(`/lids/${lid.id}`)}
            />
          )}
        </div>
      </div>

      <LidsDrawer />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lidni o&apos;chirish</DialogTitle>
            <DialogDescription>
              &quot;{lidToDelete?.name}&quot; ni o&apos;chirishni xohlaysizmi? Bu amalni qaytarib
              bo&apos;lmaydi.
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
              O&apos;chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
