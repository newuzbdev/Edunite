"use client"

import { forwardRef, useCallback, useMemo, useState, useEffect } from "react"
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
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetFooter,
} from "@/components/ui/sheet"
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
	Filter,
	Plus,
	X,
	Search,
	Calendar,
	Globe,
	User,
	MapPin,
	EllipsisVertical,
	Pencil,
	Trash2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLidsStore, STATUS_LABELS_UZ, SOURCE_LABELS_UZ, MANAGERS, type Lid, type LidStatus } from "../utils/lids-store"
import LidsDrawer from "./lids-drawer"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const STATUS_ORDER: LidStatus[] = ["new", "called", "interested", "thinking", "closed", "converted"]

// Mock data for regions and branches
const REGIONS = [
	{ id: "1", name: "Toshkent shahri" },
	{ id: "2", name: "Toshkent viloyati" },
	{ id: "3", name: "Samarqand" },
	{ id: "4", name: "Buxoro" },
	{ id: "5", name: "Andijon" },
]

const BRANCHES = [
	{ id: "1", name: "Chilonzor filiali" },
	{ id: "2", name: "Yunusobod filiali" },
	{ id: "3", name: "Yashnobod filiali" },
	{ id: "4", name: "Olmazor filiali" },
]

type StatusChangeOptions = { silent?: boolean }

type LidsBoardProps = {
  lids: Lid[]
  customColumns: Array<{ id: string; name: string }>
  statusColumnLabels: Partial<Record<LidStatus, string>>
  hiddenStatuses: LidStatus[]
  onEdit: (lid: Lid) => void
  onDelete: (lid: Lid) => void
  onStatusChange: (id: string, status: LidStatus, options?: StatusChangeOptions) => void
  onViewProfile: (lid: Lid) => void
  onAddLead: (status: LidStatus) => void
  onEditColumn: (column: { id: string; name: string }) => void
  onDeleteColumn: (column: { id: string; name: string }) => void
  onEditStatusColumn: (status: LidStatus) => void
  onDeleteStatusColumn: (status: LidStatus) => void
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
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border-0 bg-white">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <div className="space-y-1">
          <CardDescription className="text-xs font-medium text-muted-foreground">{card.title}</CardDescription>
          <CardTitle className="text-2xl font-bold tabular-nums text-foreground">{formattedValue}</CardTitle>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm">
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

function LidsBoard({
  lids,
  customColumns,
  statusColumnLabels,
  hiddenStatuses,
  onEdit,
  onDelete,
  onStatusChange,
  onViewProfile,
  onAddLead,
  onEditColumn,
  onDeleteColumn,
  onEditStatusColumn,
  onDeleteStatusColumn,
}: LidsBoardProps) {
  const [activeLidId, setActiveLidId] = useState<string | null>(null)
  const activeLid = activeLidId ? lids.find(lid => lid.id === activeLidId) ?? null : null

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: 100,
        tolerance: 5,
      },
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
    <div className="flex flex-col w-full h-full">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="overflow-x-auto overflow-y-visible scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgb(209_213_219)_transparent] hover:[scrollbar-color:rgb(156_163_175)_transparent] w-full" style={{ maxHeight: 'calc(100vh - 20rem)' }}>
          <div className="flex gap-3 sm:gap-4 min-w-max pb-4" style={{ minHeight: '400px' }}>
            {STATUS_ORDER.filter(status => !hiddenStatuses.includes(status)).map(status => {
              const items = lids.filter(lid => lid.status === status)
              const label = statusColumnLabels[status] ?? STATUS_LABELS_UZ[status]
              return (
                <div key={status} className="shrink-0 w-[260px] min-[375px]:w-[280px] sm:w-[300px] md:w-[320px] h-auto">
                  <StatusColumn
                    status={status}
                    label={label}
                    lids={items}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewProfile={onViewProfile}
                    onAddLead={onAddLead}
                    onEditColumn={onEditStatusColumn}
                    onDeleteColumn={onDeleteStatusColumn}
                  />
                </div>
              )
            })}
            {customColumns.map(column => (
              <div key={column.id} className="shrink-0 w-[260px] min-[375px]:w-[280px] sm:w-[300px] md:w-[320px] h-auto">
                <CustomKanbanColumn
                  column={column}
                  lids={[]}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewProfile={onViewProfile}
                  onEditColumn={onEditColumn}
                  onDeleteColumn={onDeleteColumn}
                />
              </div>
            ))}
          </div>
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
    </div>
  )
}

type StatusColumnProps = {
  status: LidStatus
  label: string
  lids: Lid[]
  onEdit: (lid: Lid) => void
  onDelete: (lid: Lid) => void
  onViewProfile: (lid: Lid) => void
  onAddLead: (status: LidStatus) => void
  onEditColumn: (status: LidStatus) => void
  onDeleteColumn: (status: LidStatus) => void
}

function StatusColumn({
  status,
  label,
  lids,
  onEdit,
  onDelete,
  onViewProfile,
  onAddLead,
  onEditColumn,
  onDeleteColumn,
}: StatusColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  })

  return (
    <div ref={setNodeRef} className="h-full w-full flex flex-col">
      <Card
        className={cn(
          "h-full w-full flex flex-col border-dashed transition-colors",
          isOver && "border-primary bg-primary/5"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between px-3 sm:px-5 py-2 sm:py-3 shrink-0 border-b bg-background">
          <CardTitle className="text-sm sm:text-base font-semibold truncate">
            {label}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer">
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex items-center justify-between gap-2">
                <span>{label}</span>
                <span className="text-xs text-muted-foreground">({lids.length})</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAddLead(status)} className="cursor-pointer">
                <Plus className="h-4 w-4" />
                Lead qo&apos;shish
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditColumn(status)} className="cursor-pointer">
                <Pencil className="h-4 w-4" />
                Bo&apos;lakni tahrirlash
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteColumn(status)}
                className="cursor-pointer text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Bo&apos;lakni o&apos;chirish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 flex-1 overflow-y-auto overflow-x-hidden min-h-[300px] max-h-[600px] sm:max-h-[calc(100vh-25rem)] scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgb(209_213_219)_transparent] hover:[scrollbar-color:rgb(156_163_175)_transparent]">
          <SortableContext
            items={lids.map(lid => lid.id)}
            strategy={verticalListSortingStrategy}
          >
            {lids.length ? (
              lids.map(lid => (
                <LidCard key={lid.id} lid={lid} onEdit={onEdit} onDelete={onDelete} onViewProfile={onViewProfile} />
              ))
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 px-3 py-8 text-center text-xs sm:text-sm text-muted-foreground">
                Hozircha lids mavjud emas
              </div>
            )}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  )
}

type CustomKanbanColumnProps = {
  column: { id: string; name: string }
  lids: Lid[]
  onEdit: (lid: Lid) => void
  onDelete: (lid: Lid) => void
  onViewProfile: (lid: Lid) => void
  onEditColumn: (column: { id: string; name: string }) => void
  onDeleteColumn: (column: { id: string; name: string }) => void
}

function CustomKanbanColumn({
  column,
  lids,
  onEdit,
  onDelete,
  onViewProfile,
  onEditColumn,
  onDeleteColumn,
}: CustomKanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `custom-${column.id}`,
    data: { customColumnId: column.id },
  })

  return (
    <div ref={setNodeRef} className="h-full w-full flex flex-col">
      <Card
        className={cn(
          "h-full w-full flex flex-col border-dashed transition-colors",
          isOver && "border-primary bg-primary/5"
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between px-3 sm:px-5 py-2 sm:py-3 shrink-0 border-b bg-background">
          <CardTitle className="text-sm sm:text-base font-semibold truncate">
            {column.name}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer">
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex items-center justify-between gap-2">
                <span>{column.name}</span>
                <span className="text-xs text-muted-foreground">({lids.length})</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEditColumn(column)} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Tahrirlash
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteColumn(column)} className="cursor-pointer text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                O&apos;chirish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 flex-1 overflow-y-auto overflow-x-hidden min-h-[300px] max-h-[600px] sm:max-h-[calc(100vh-25rem)] scroll-smooth [scrollbar-width:thin] [scrollbar-color:rgb(209_213_219)_transparent] hover:[scrollbar-color:rgb(156_163_175)_transparent]">
          <SortableContext
            items={lids.map(lid => lid.id)}
            strategy={verticalListSortingStrategy}
          >
            {lids.length ? (
              lids.map(lid => (
                <LidCard key={lid.id} lid={lid} onEdit={onEdit} onDelete={onDelete} onViewProfile={onViewProfile} />
              ))
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 px-3 py-8 text-center text-xs sm:text-sm text-muted-foreground">
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
        "flex cursor-grab active:cursor-grabbing flex-col gap-2 rounded-lg border bg-background p-3 sm:p-4 shadow-sm transition w-full",
        dragOverlay && "cursor-grabbing border-primary bg-background shadow-lg",
        isDragging && "cursor-grabbing border-primary bg-primary/10 shadow-lg"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <GripVertical className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="space-y-1 flex-1 min-w-0">
            <button 
              onClick={() => onViewProfile(lid)}
              className="font-semibold text-sm sm:text-base leading-5 text-left hover:underline cursor-pointer truncate w-full"
            >
              {lid.name}
            </button>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{lid.phoneNumber}</p>
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
                <Pencil className="mr-2 h-4 w-4" />
                Tahrirlash
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(lid)}
                variant="destructive"
                className="cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Ochirish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground truncate">{lid.courseType}</p>
    </div>
  )
}
)

LidCardContent.displayName = "LidCardContent"

export default function LidsTable() {
  const navigate = useNavigate()
  const lids = useLidsStore(state => state.lids)
	const customKanbanColumns = useLidsStore(state => state.customKanbanColumns)
  const statusColumnLabels = useLidsStore(state => state.statusColumnLabels)
  const hiddenStatuses = useLidsStore(state => state.hiddenStatuses)
  const onOpen = useLidsStore(state => state.onOpen)
  const shouldSwitchToKanban = useLidsStore(state => state.shouldSwitchToKanban)
  const resetKanbanSwitch = useLidsStore(state => state.resetKanbanSwitch)
	const addCustomKanbanColumn = useLidsStore(state => state.addCustomKanbanColumn)
	const updateCustomKanbanColumn = useLidsStore(state => state.updateCustomKanbanColumn)
	const deleteCustomKanbanColumn = useLidsStore(state => state.deleteCustomKanbanColumn)
  const updateStatusColumnLabel = useLidsStore(state => state.updateStatusColumnLabel)
  const hideStatusColumn = useLidsStore(state => state.hideStatusColumn)
  const restoreStatusColumn = useLidsStore(state => state.restoreStatusColumn)
  const deleteLid = useLidsStore(state => state.deleteLid)
  const updateStatus = useLidsStore(state => state.updateStatus)
  const convertToStudent = useLidsStore(state => state.convertToStudent)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [lidToDelete, setLidToDelete] = useState<Lid | null>(null)
	const [viewMode, setViewMode] = useState<"board" | "table">("board")
	const [kanbanDialogOpen, setKanbanDialogOpen] = useState(false)
	const [kanbanColumnName, setKanbanColumnName] = useState("")
	const [editKanbanDialogOpen, setEditKanbanDialogOpen] = useState(false)
	const [kanbanColumnToEdit, setKanbanColumnToEdit] = useState<{ id: string; name: string } | null>(null)
	const [kanbanEditName, setKanbanEditName] = useState("")
	const [deleteKanbanDialogOpen, setDeleteKanbanDialogOpen] = useState(false)
	const [kanbanColumnToDelete, setKanbanColumnToDelete] = useState<{ id: string; name: string } | null>(null)
  const [editStatusDialogOpen, setEditStatusDialogOpen] = useState(false)
  const [statusToEdit, setStatusToEdit] = useState<LidStatus | null>(null)
  const [statusEditName, setStatusEditName] = useState("")
  const [deleteStatusDialogOpen, setDeleteStatusDialogOpen] = useState(false)
  const [statusToDelete, setStatusToDelete] = useState<LidStatus | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  
  // Comprehensive filter state
  const [filterState, setFilterState] = useState<{
    dateRange: string
    source: string
    manager: string
    region: string
    branch: string
    startedStudying: boolean
    paid: boolean
    signedContract: boolean
    reContacted: boolean
  }>({
    dateRange: "",
    source: "",
    manager: "",
    region: "",
    branch: "",
    startedStudying: false,
    paid: false,
    signedContract: false,
    reContacted: false,
  })
  
  // Filter state - track active filters for display
  const [activeFilters, setActiveFilters] = useState<Array<{
    id: string
    type: string
    value: string
    label: string
  }>>([])

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

  // Switch to kanban view when shouldSwitchToKanban is true
  useEffect(() => {
    if (shouldSwitchToKanban) {
      setViewMode("board")
      resetKanbanSwitch()
    }
  }, [shouldSwitchToKanban, resetKanbanSwitch, lids.length])

  const getStatusLabel = useCallback(
    (status: LidStatus) => statusColumnLabels[status] ?? STATUS_LABELS_UZ[status],
    [statusColumnLabels]
  )

  const handleAddKanbanColumn = useCallback(() => {
    if (!kanbanColumnName.trim()) {
      toast.error("Iltimos, bo'lak nomini kiriting")
      return
    }
    addCustomKanbanColumn(kanbanColumnName)
    toast.success("Bo'lak muvaffaqiyatli qo'shildi")
    setKanbanColumnName("")
    setKanbanDialogOpen(false)
  }, [kanbanColumnName, addCustomKanbanColumn])

  const handleOpenEditKanban = useCallback((column: { id: string; name: string }) => {
    setKanbanColumnToEdit(column)
    setKanbanEditName(column.name)
    setEditKanbanDialogOpen(true)
  }, [])

  const handleUpdateKanbanColumn = useCallback(() => {
    if (!kanbanColumnToEdit) return
    if (!kanbanEditName.trim()) {
      toast.error("Iltimos, bo'lak nomini kiriting")
      return
    }
    updateCustomKanbanColumn(kanbanColumnToEdit.id, kanbanEditName)
    toast.success("Bo'lak nomi yangilandi")
    setEditKanbanDialogOpen(false)
    setKanbanColumnToEdit(null)
    setKanbanEditName("")
  }, [kanbanColumnToEdit, kanbanEditName, updateCustomKanbanColumn])

  const handleOpenDeleteKanban = useCallback((column: { id: string; name: string }) => {
    setKanbanColumnToDelete(column)
    setDeleteKanbanDialogOpen(true)
  }, [])

  const handleConfirmDeleteKanban = useCallback(() => {
    if (!kanbanColumnToDelete) return
    deleteCustomKanbanColumn(kanbanColumnToDelete.id)
    toast.success("Bo'lak o'chirildi")
    setDeleteKanbanDialogOpen(false)
    setKanbanColumnToDelete(null)
  }, [kanbanColumnToDelete, deleteCustomKanbanColumn])

  const handleOpenEditStatusColumn = useCallback((status: LidStatus) => {
    setStatusToEdit(status)
    setStatusEditName(getStatusLabel(status))
    setEditStatusDialogOpen(true)
  }, [getStatusLabel])

  const handleUpdateStatusColumn = useCallback(() => {
    if (!statusToEdit) return
    if (!statusEditName.trim()) {
      toast.error("Iltimos, bo'lak nomini kiriting")
      return
    }
    updateStatusColumnLabel(statusToEdit, statusEditName)
    toast.success("Bo'lak nomi yangilandi")
    setEditStatusDialogOpen(false)
    setStatusToEdit(null)
    setStatusEditName("")
  }, [statusToEdit, statusEditName, updateStatusColumnLabel])

  const handleOpenDeleteStatusColumn = useCallback((status: LidStatus) => {
    setStatusToDelete(status)
    setDeleteStatusDialogOpen(true)
  }, [])

  const handleConfirmDeleteStatusColumn = useCallback(() => {
    if (!statusToDelete) return
    hideStatusColumn(statusToDelete)
    toast.success("Bo'lak yashirildi")
    setDeleteStatusDialogOpen(false)
    setStatusToDelete(null)
  }, [statusToDelete, hideStatusColumn])

  const handleRestoreStatusColumn = useCallback((status: LidStatus) => {
    restoreStatusColumn(status)
    toast.success("Bo'lak qayta tiklandi")
  }, [restoreStatusColumn])

  const handleAddLead = useCallback((_: LidStatus) => {
    onOpen()
  }, [onOpen])

  const visibleStatuses = useMemo(() => STATUS_ORDER.filter(status => !hiddenStatuses.includes(status)), [hiddenStatuses])

  const filteredLids = useMemo(() => {
    return lids.filter(lid => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = lid.name.toLowerCase().includes(query)
        const matchesPhone = lid.phoneNumber.toLowerCase().includes(query)
        if (!matchesName && !matchesPhone) return false
      }

      // Date range filter
      if (filterState.dateRange) {
        const lidDate = new Date(lid.interestedDate).toISOString().split('T')[0]
        if (lidDate !== filterState.dateRange) return false
      }

      // Source filter
      if (filterState.source && lid.source !== filterState.source) return false

      // Manager filter
      if (filterState.manager && lid.managerId !== filterState.manager) return false

      // Note: Region and branch filters would need to be added to Lid interface
      // Additional parameters would also need to be tracked in the Lid data

      return true
    })
  }, [lids, searchQuery, filterState])

  const handleApplyFilters = useCallback(() => {
    const newFilters: Array<{ id: string; type: string; value: string; label: string }> = []
    
    if (filterState.dateRange) {
      newFilters.push({
        id: `date-${filterState.dateRange}`,
        type: "date",
        value: filterState.dateRange,
        label: new Date(filterState.dateRange).toLocaleDateString("uz-UZ")
      })
    }
    
    if (filterState.source) {
      newFilters.push({
        id: `source-${filterState.source}`,
        type: "source",
        value: filterState.source,
        label: SOURCE_LABELS_UZ[filterState.source as keyof typeof SOURCE_LABELS_UZ] || filterState.source
      })
    }
    
    if (filterState.manager) {
      const manager = MANAGERS.find(m => m.id === filterState.manager)
      newFilters.push({
        id: `manager-${filterState.manager}`,
        type: "manager",
        value: filterState.manager,
        label: manager?.name || filterState.manager
      })
    }
    
    if (filterState.region) {
      const region = REGIONS.find(r => r.id === filterState.region)
      newFilters.push({
        id: `region-${filterState.region}`,
        type: "region",
        value: filterState.region,
        label: region?.name || filterState.region
      })
    }
    
    if (filterState.branch) {
      const branch = BRANCHES.find(b => b.id === filterState.branch)
      newFilters.push({
        id: `branch-${filterState.branch}`,
        type: "branch",
        value: filterState.branch,
        label: branch?.name || filterState.branch
      })
    }
    
    if (filterState.startedStudying) {
      newFilters.push({
        id: "started-studying",
        type: "additional",
        value: "started-studying",
        label: "O'qishni boshlagan"
      })
    }
    
    if (filterState.paid) {
      newFilters.push({
        id: "paid",
        type: "additional",
        value: "paid",
        label: "To'lov qilgan"
      })
    }
    
    if (filterState.signedContract) {
      newFilters.push({
        id: "signed-contract",
        type: "additional",
        value: "signed-contract",
        label: "Shartnoma imzolagan"
      })
    }
    
    if (filterState.reContacted) {
      newFilters.push({
        id: "re-contacted",
        type: "additional",
        value: "re-contacted",
        label: "Qayta aloqa"
      })
    }
    
    setActiveFilters(newFilters)
    setFilterSheetOpen(false)
  }, [filterState])

  const handleClearFilters = useCallback(() => {
    setFilterState({
      dateRange: "",
      source: "",
      manager: "",
      region: "",
      branch: "",
      startedStudying: false,
      paid: false,
      signedContract: false,
      reContacted: false,
    })
    setActiveFilters([])
  }, [])

  const handleRemoveFilter = useCallback((filterId: string) => {
    const filter = activeFilters.find(f => f.id === filterId)
    if (!filter) return
    
    setActiveFilters(prev => prev.filter(f => f.id !== filterId))
    
    // Update filterState based on removed filter
    switch (filter.type) {
      case "date":
        setFilterState(prev => ({ ...prev, dateRange: "" }))
        break
      case "source":
        setFilterState(prev => ({ ...prev, source: "" }))
        break
      case "manager":
        setFilterState(prev => ({ ...prev, manager: "" }))
        break
      case "region":
        setFilterState(prev => ({ ...prev, region: "" }))
        break
      case "branch":
        setFilterState(prev => ({ ...prev, branch: "" }))
        break
      case "additional":
        if (filter.value === "started-studying") {
          setFilterState(prev => ({ ...prev, startedStudying: false }))
        } else if (filter.value === "paid") {
          setFilterState(prev => ({ ...prev, paid: false }))
        } else if (filter.value === "signed-contract") {
          setFilterState(prev => ({ ...prev, signedContract: false }))
        } else if (filter.value === "re-contacted") {
          setFilterState(prev => ({ ...prev, reContacted: false }))
        }
        break
    }
  }, [activeFilters])

  const handleResetFilters = useCallback(() => {
    handleClearFilters()
    setSearchQuery("")
  }, [handleClearFilters])

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
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-4 shrink-0">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {summaryCards.map(card => (
            <LidSummaryCard key={card.key} card={card} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Tabs value={viewMode} onValueChange={value => setViewMode(value as "board" | "table")} className="w-auto">
            <TabsList className="grid grid-cols-2 bg-white shadow-sm">
            <TabsTrigger value="board" className="cursor-pointer text-xs sm:text-sm">Kanban</TabsTrigger>
              <TabsTrigger value="table" className="cursor-pointer text-xs sm:text-sm">Jadval</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={() => setKanbanDialogOpen(true)} variant="outline" size="sm" className="cursor-pointer shadow-sm hover:shadow-md transition-shadow text-xs sm:text-sm">
              <span className="hidden sm:inline">Bo&apos;lak qo&apos;shish</span>
              <span className="sm:hidden">Bo&apos;lak</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                  <EllipsisVertical className="h-4 w-4" />
                  <span className="sr-only">Bo&apos;laklarni boshqarish</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Asosiy bo&apos;laklar</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {visibleStatuses.map(status => (
                  <div key={`status-${status}`}>
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      {getStatusLabel(status)}
                    </div>
                    <DropdownMenuItem onClick={() => handleOpenEditStatusColumn(status)} className="cursor-pointer">
                      <Pencil className="h-4 w-4" />
                      Tahrirlash
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleOpenDeleteStatusColumn(status)}
                      className="cursor-pointer"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      O&apos;chirish
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                ))}
                {hiddenStatuses.length > 0 && (
                  <>
                    <DropdownMenuLabel>Yashirilgan bo&apos;laklar</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {hiddenStatuses.map(status => (
                      <DropdownMenuItem key={`hidden-${status}`} onClick={() => handleRestoreStatusColumn(status)} className="cursor-pointer">
                        <Plus className="h-4 w-4" />
                        {getStatusLabel(status)}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuLabel>Qo&apos;shimcha bo&apos;laklar</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {customKanbanColumns.length ? (
                  customKanbanColumns.map((column, index) => (
                    <div key={column.id}>
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">{column.name}</div>
                      <DropdownMenuItem onClick={() => handleOpenEditKanban(column)} className="cursor-pointer">
                        <Pencil className="h-4 w-4" />
                        Tahrirlash
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenDeleteKanban(column)}
                        className="cursor-pointer"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        O&apos;chirish
                      </DropdownMenuItem>
                      {index < customKanbanColumns.length - 1 && <DropdownMenuSeparator />}
                    </div>
                  ))
                ) : (
                  <div className="px-2 py-1 text-xs text-muted-foreground">Qo&apos;shimcha bo&apos;laklar mavjud emas</div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => onOpen()} size="sm" className="cursor-pointer shadow-sm hover:shadow-md transition-shadow text-xs sm:text-sm">
              <span className="hidden sm:inline">Lead qo&apos;shish</span>
              <span className="sm:hidden">Lead</span>
            </Button>
          </div>
        </div>
        
        {/* Search and Filters */}
        {viewMode === "table" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Ism yoki telefon orqali qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full bg-white shadow-sm"
              />
            </div>

            {/* Filter Button */}
            <div className="flex flex-wrap items-center gap-2">
              {(activeFilters.length > 0 || searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="cursor-pointer shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  Tozalash
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFilterSheetOpen(true)}
                className="cursor-pointer shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <Filter className="h-4 w-4 mr-1.5" />
                Barcha Filterlar
              </Button>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeFilters.map(filter => (
                <Badge key={filter.id} variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm bg-white">
                  <span className="font-medium">
                    {filter.type === "date" && "Sana: "}
                    {filter.type === "source" && "Manba: "}
                    {filter.type === "manager" && "Menedjer: "}
                    {filter.type === "region" && "Hudud: "}
                    {filter.type === "branch" && "Filial: "}
                  </span>
                  <span>{filter.label}</span>
                  <button
                    onClick={() => handleRemoveFilter(filter.id)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Comprehensive Filter Sheet */}
          <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b bg-linear-to-b from-background to-muted/20">
                  <SheetTitle className="text-2xl font-bold tracking-tight">Kengaytirilgan Filterlar</SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground mt-2">
                    Aniqroq natija olish uchun quyidagi parametrlarni sozlang.
                  </SheetDescription>
                </SheetHeader>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="flex flex-col gap-6">
                    {/* Date Range */}
                    <Card className="border shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                            <Calendar className="h-4 w-4" />
                          </div>
                          Sana oralig&apos;i
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Input
                          type="date"
                          value={filterState.dateRange}
                          onChange={(e) => setFilterState(prev => ({ ...prev, dateRange: e.target.value }))}
                          placeholder="Sanani tanlang"
                          className="bg-background"
                        />
                      </CardContent>
                    </Card>

                    {/* Source */}
                    <Card className="border shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                            <Globe className="h-4 w-4" />
                          </div>
                          Manba
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Select value={filterState.source} onValueChange={(value) => setFilterState(prev => ({ ...prev, source: value }))}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(SOURCE_LABELS_UZ).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>

                    {/* Manager */}
                    <Card className="border shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                            <User className="h-4 w-4" />
                          </div>
                          Menedjer
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Select value={filterState.manager} onValueChange={(value) => setFilterState(prev => ({ ...prev, manager: value }))}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            {MANAGERS.map(manager => (
                              <SelectItem key={manager.id} value={manager.id}>
                                {manager.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>

                    {/* Region and Branch */}
                    <Card className="border shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                            <MapPin className="h-4 w-4" />
                          </div>
                          Hudud va Filial
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Select value={filterState.region} onValueChange={(value) => setFilterState(prev => ({ ...prev, region: value }))}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Hudud" />
                          </SelectTrigger>
                          <SelectContent>
                            {REGIONS.map(region => (
                              <SelectItem key={region.id} value={region.id}>
                                {region.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={filterState.branch} onValueChange={(value) => setFilterState(prev => ({ ...prev, branch: value }))}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Filial" />
                          </SelectTrigger>
                          <SelectContent>
                            {BRANCHES.map(branch => (
                              <SelectItem key={branch.id} value={branch.id}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>

                    {/* Additional Parameters */}
                    <Card className="border shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Qo&apos;shimcha parametrlar</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground mt-1">
                          Qo&apos;shimcha filtrlarni tanlang
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2.5">
                          <Button
                            type="button"
                            variant={filterState.startedStudying ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterState(prev => ({ ...prev, startedStudying: !prev.startedStudying }))}
                            className={cn(
                              "cursor-pointer transition-all",
                              filterState.startedStudying 
                                ? "bg-primary text-primary-foreground shadow-sm" 
                                : "hover:bg-muted"
                            )}
                          >
                            O&apos;qishni boshlagan
                          </Button>
                          <Button
                            type="button"
                            variant={filterState.paid ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterState(prev => ({ ...prev, paid: !prev.paid }))}
                            className={cn(
                              "cursor-pointer transition-all",
                              filterState.paid 
                                ? "bg-primary text-primary-foreground shadow-sm" 
                                : "hover:bg-muted"
                            )}
                          >
                            To&apos;lov qilgan
                          </Button>
                          <Button
                            type="button"
                            variant={filterState.signedContract ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterState(prev => ({ ...prev, signedContract: !prev.signedContract }))}
                            className={cn(
                              "cursor-pointer transition-all",
                              filterState.signedContract 
                                ? "bg-primary text-primary-foreground shadow-sm" 
                                : "hover:bg-muted"
                            )}
                          >
                            Shartnoma imzolagan
                          </Button>
                          <Button
                            type="button"
                            variant={filterState.reContacted ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterState(prev => ({ ...prev, reContacted: !prev.reContacted }))}
                            className={cn(
                              "cursor-pointer transition-all",
                              filterState.reContacted 
                                ? "bg-primary text-primary-foreground shadow-sm" 
                                : "hover:bg-muted"
                            )}
                          >
                            Qayta aloqa
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Footer */}
                <SheetFooter className="px-6 py-4 border-t bg-muted/30 flex flex-row items-center justify-between gap-3 mt-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearFilters}
                    className="cursor-pointer hover:bg-muted"
                  >
                    Tozalash
                  </Button>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setFilterSheetOpen(false)}
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                    >
                      Bekor qilish
                    </Button>
                    <Button
                      type="button"
                      onClick={handleApplyFilters}
                      className="cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                    >
                      Natijalarni ko&apos;rsatish
                    </Button>
                  </div>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        )}
      </div>

      {viewMode === "table" ? (
        <div className="w-full overflow-x-auto">
          <div className="min-w-full rounded-lg border-0 bg-white shadow-sm">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id} className="border-b bg-muted/30">
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id} colSpan={header.colSpan} className="font-semibold text-foreground whitespace-nowrap">
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
                    <TableRow key={row.id} className="border-b hover:bg-muted/30 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="py-3 whitespace-nowrap">
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
        <div className="w-full" style={{ minHeight: '400px', maxHeight: 'calc(100vh - 20rem)' }}>
          <LidsBoard
            lids={filteredLids}
            customColumns={customKanbanColumns}
            statusColumnLabels={statusColumnLabels}
            hiddenStatuses={hiddenStatuses}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onStatusChange={handleStatusChange}
            onViewProfile={(lid) => navigate(`/lids/${lid.id}`)}
            onAddLead={handleAddLead}
            onEditColumn={handleOpenEditKanban}
            onDeleteColumn={handleOpenDeleteKanban}
            onEditStatusColumn={handleOpenEditStatusColumn}
            onDeleteStatusColumn={handleOpenDeleteStatusColumn}
          />
        </div>
      )}

      <LidsDrawer />

      <Dialog open={kanbanDialogOpen} onOpenChange={setKanbanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi bo&apos;lak qo&apos;shish</DialogTitle>
            <DialogDescription>
              Kanban doskasiga yangi bo&apos;lak (ustun) nomini kiriting
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={kanbanColumnName}
              onChange={(e) => setKanbanColumnName(e.target.value)}
              placeholder="Bo'lak nomi"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddKanbanColumn()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setKanbanDialogOpen(false)
                setKanbanColumnName("")
              }}
              className="cursor-pointer"
            >
              Bekor qilish
            </Button>
            <Button onClick={handleAddKanbanColumn} className="cursor-pointer">
              Qo&apos;shish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editKanbanDialogOpen} onOpenChange={setEditKanbanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bo&apos;lakni tahrirlash</DialogTitle>
            <DialogDescription>
              Tanlangan bo&apos;lak nomini yangilang
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={kanbanEditName}
              onChange={(e) => setKanbanEditName(e.target.value)}
              placeholder="Bo'lak nomi"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateKanbanColumn()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditKanbanDialogOpen(false)
                setKanbanColumnToEdit(null)
                setKanbanEditName("")
              }}
              className="cursor-pointer"
            >
              Bekor qilish
            </Button>
            <Button onClick={handleUpdateKanbanColumn} className="cursor-pointer">
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editStatusDialogOpen} onOpenChange={setEditStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asosiy bo&apos;lakni tahrirlash</DialogTitle>
            <DialogDescription>
              Tanlangan bo&apos;lak nomini yangilang
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={statusEditName}
              onChange={e => setStatusEditName(e.target.value)}
              placeholder="Bo'lak nomi"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleUpdateStatusColumn()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditStatusDialogOpen(false)
                setStatusToEdit(null)
                setStatusEditName("")
              }}
              className="cursor-pointer"
            >
              Bekor qilish
            </Button>
            <Button onClick={handleUpdateStatusColumn} className="cursor-pointer">
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteStatusDialogOpen} onOpenChange={setDeleteStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asosiy bo&apos;lakni yashirish</DialogTitle>
            <DialogDescription>
              &quot;{statusToDelete ? getStatusLabel(statusToDelete) : ""}&quot; bo&apos;lagini yashirmoqchimisiz? Bu ustunni Kanban ko&apos;rinishiga qayta tiklamaguncha ko&apos;rmaysiz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteStatusDialogOpen(false)}
              className="cursor-pointer"
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleConfirmDeleteStatusColumn}
              className="cursor-pointer"
              variant="destructive"
            >
              Yashirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteKanbanDialogOpen} onOpenChange={setDeleteKanbanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bo&apos;lakni o&apos;chirish</DialogTitle>
            <DialogDescription>
              &quot;{kanbanColumnToDelete?.name}&quot; bo&apos;lagini o&apos;chirmoqchimisiz? Bu amalni qaytarib bo&apos;lmaydi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteKanbanDialogOpen(false)}
              className="cursor-pointer"
            >
              Bekor qilish
            </Button>
            <Button
              onClick={handleConfirmDeleteKanban}
              className="cursor-pointer"
              variant="destructive"
            >
              O&apos;chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
